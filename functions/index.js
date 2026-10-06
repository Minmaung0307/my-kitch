import {starterRecipes,ensureStarterRecipe} from './lib/catalog.js';
import {getStorage} from 'firebase-admin/storage';
import {defineString} from 'firebase-functions/params';
import {defaultCategories,validateCategory,categoryNames} from './lib/categories.js';
import {guarded} from './lib/errors.js';
const photoBucket=defineString('RECIPE_PHOTO_BUCKET',{default:'my-kitch.firebasestorage.app'});
import {initializeApp} from 'firebase-admin/app';
import {getFirestore,FieldValue} from 'firebase-admin/firestore';
import {onCall,HttpsError} from 'firebase-functions/v2/https';
import {createHash,randomUUID} from 'node:crypto';
import {isAdminToken} from './lib/admin.js';
import {validateRecipe,namesOf} from './lib/model.js';
initializeApp();const db=getFirestore();const now=()=>FieldValue.serverTimestamp();
const nameRef=n=>db.doc(`recipeNames/${createHash('sha256').update(n).digest('hex')}`);
function requireUser(request){if(!request.auth)throw new HttpsError('unauthenticated','Please sign in.');return request.auth.uid}
async function valid(input){const custom=typeof input?.category==='string'&&/^cat-[a-f0-9]{24}$/.test(input.category)&&(await db.doc(`categories/${input.category}`).get()).exists;try{return validateRecipe(input||{},custom?[input.category]:[])}catch(e){throw new HttpsError('invalid-argument',e.message)}}
export const submitRecipe=onCall({invoker:'public'},guarded('submitRecipe',async request=>{
 const uid=requireUser(request),recipe=await valid(request.data?.recipe),targetId=request.data?.targetId||null;
 if(targetId&&(typeof targetId!=='string'||!/^[\w-]{1,200}$/.test(targetId)))throw new HttpsError('invalid-argument','Invalid recipe.');
 // Import an original only when needed; no client-supplied recipe is auto-published.
 const wanted=namesOf(recipe);
 for(const starter of starterRecipes)if(starter.id===targetId||namesOf(starter).some(n=>wanted.includes(n))){const existingId=await ensureStarterRecipe(starter.id);if(starter.id===targetId&&existingId!==targetId)throw new HttpsError('already-exists','မူလချက်နည်းအမည်ကို အသုံးပြုထားသည့် recipe ကို ပြင်ပေးပါ။',{recipeId:existingId});}
 const profile=await db.doc(`users/${uid}`).get();const author=profile.data()?.name||request.auth.token.name||'Home cook';
 const ref=db.collection('requests').doc();
 return db.runTransaction(async tx=>{
  const target=targetId?await tx.get(db.doc(`recipes/${targetId}`)):null;
  if(target&&!target.exists)throw new HttpsError('not-found','ပြင်မည့် recipe ကို database ထဲတွင် မတွေ့ပါ။ စာမျက်နှာ refresh လုပ်ပြီး ရှိနေသော recipe ကို ပြန်ရွေးပါ။',{reason:'recipe-not-found'});
  for(const name of namesOf(recipe)){const existing=await tx.get(nameRef(name));if(existing.exists&&existing.data().recipeId!==targetId)throw new HttpsError('already-exists','A recipe with this exact name already exists. Open it to suggest an edit.',{recipeId:existing.data().recipeId})}
  tx.create(ref,{type:targetId?'edit':'submission',targetId,baseVersion:target?.data()?.version||0,recipe,authorId:uid,author,status:'pending',note:String(request.data?.note||'').trim().slice(0,2000),createdAt:now()});return {id:ref.id};
 });
}));
export const reviewRequest=onCall({invoker:'public'},guarded('reviewRequest',async request=>{
 const uid=requireUser(request);if(!isAdminToken(request.auth.token))throw new HttpsError('permission-denied','Admin access is required.');
 const {id,decision}=request.data||{};if(!/^[\w-]{1,200}$/.test(id||'')||!['approve','reject'].includes(decision))throw new HttpsError('invalid-argument','Invalid review.');
 const ref=db.doc(`requests/${id}`);return db.runTransaction(async tx=>{
  const snap=await tx.get(ref);if(!snap.exists)throw new HttpsError('not-found','Request not found.');const item=snap.data();
  if(item.status!=='pending')throw new HttpsError('failed-precondition','This request has already been reviewed.');
  const review={status:decision==='approve'?'approved':'rejected',reviewedBy:uid,reviewedAt:now(),reviewNote:String(request.data?.note||'').trim().slice(0,2000)};
  if(decision==='reject'){tx.update(ref,review);return {status:review.status}}
  const recipe=await valid(item.recipe),recipeId=item.targetId||id,recipeRef=db.doc(`recipes/${recipeId}`),old=await tx.get(recipeRef);
  if(item.targetId&&(!old.exists||(old.data().version||0)!==item.baseVersion))throw new HttpsError('failed-precondition','The recipe changed since this edit was submitted. Reject this stale request and ask for a new edit.');
  for(const name of namesOf(recipe)){const n=await tx.get(nameRef(name));if(n.exists&&n.data().recipeId!==recipeId)throw new HttpsError('already-exists','Another recipe now uses this name. Reject this request and ask for an edit instead.',{recipeId:n.data().recipeId})}
  const newNames=namesOf(recipe);if(old.exists)for(const n of namesOf(old.data()))if(!newNames.includes(n))tx.delete(nameRef(n));
  for(const n of newNames)tx.set(nameRef(n),{recipeId,normalizedName:n});
  tx.set(recipeRef,{...recipe,status:'published',author:old.data()?.author||item.author,authorId:old.data()?.authorId||item.authorId,lastContributor:item.author,version:(old.data()?.version||0)+1,createdAt:old.data()?.createdAt||now(),updatedAt:now()});
  tx.update(ref,{...review,recipeId});return {status:review.status,recipeId};
 });
}));

export const createCategory=onCall({invoker:'public'},guarded('createCategory',async request=>{
 const uid=requireUser(request);if(!isAdminToken(request.auth.token))throw new HttpsError('permission-denied','Admin သာ category ထည့်နိုင်ပါသည်။');
 let category;try{category=validateCategory(request.data)}catch(e){throw new HttpsError('invalid-argument',e.message)}
 const names=categoryNames(category);
 if(defaultCategories.some(c=>[c.id,...categoryNames(c)].some(n=>names.includes(n))))throw new HttpsError('already-exists','ဒီ category ရှိပြီးသားပါ။');
 const id='cat-'+createHash('sha256').update(names[0]).digest('hex').slice(0,24);
 const refs=names.map(n=>db.doc('categoryNames/'+createHash('sha256').update(n).digest('hex')));
 await db.runTransaction(async tx=>{for(const ref of refs)if((await tx.get(ref)).exists)throw new HttpsError('already-exists','ဒီ category ရှိပြီးသားပါ။');tx.create(db.doc(`categories/${id}`),{...category,createdBy:uid,createdAt:now()});for(const ref of refs)tx.create(ref,{categoryId:id})});
 return {id,...category};
}));

export const uploadRecipePhoto=onCall({invoker:'public',memory:'512MiB',timeoutSeconds:60},guarded('uploadRecipePhoto',async request=>{
 const uid=requireUser(request);let buffer;
 const {sanitizePhoto}=await import('./lib/photos.js');
 try{buffer=await sanitizePhoto(request.data?.base64)}catch(e){throw new HttpsError('invalid-argument','ဓာတ်ပုံကို ဖတ်မရပါ။ JPG/PNG/WebP ပုံအဖြစ် ပြန်ရွေးပါ။')}
 const day=new Date().toISOString().slice(0,10),quota=db.doc(`photoUploadLimits/${uid}_${day}`);
 await db.runTransaction(async tx=>{const n=(await tx.get(quota)).data()?.count||0;if(n>=30)throw new HttpsError('resource-exhausted','တစ်နေ့လျှင် ပုံ ၃၀ အထိ တင်နိုင်ပါသည်။');tx.set(quota,{count:n+1,updatedAt:now()})});
 const bucket=getStorage().bucket(photoBucket.value());const token=randomUUID();const path=`recipe-photos/${uid}/${randomUUID()}.webp`;
 try{await bucket.file(path).save(buffer,{resumable:false,metadata:{contentType:'image/webp',cacheControl:'public,max-age=31536000,immutable',metadata:{firebaseStorageDownloadTokens:token,owner:uid}}})}
 catch(e){console.error('Photo storage failed',e.code);throw new HttpsError('failed-precondition','Firebase Storage မချိတ်ရသေးပါ။ Storage bucket ဖန်တီးပြီး upload function ကို deploy လုပ်ပေးပါ။')}
 return {url:`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`,bytes:buffer.length,format:'webp'};
}));

export const initializeCatalog=onCall({invoker:'public'},guarded('initializeCatalog',async request=>{
 requireUser(request);if(!isAdminToken(request.auth.token))throw new HttpsError('permission-denied','Admin only.');
 for(const recipe of starterRecipes)await ensureStarterRecipe(recipe.id);
 return {count:starterRecipes.length};
}));
