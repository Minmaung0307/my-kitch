import {HttpsError} from 'firebase-functions/v2/https';
import {isAdminToken,canEditRecipe} from './admin.js';
import {namesOf} from './model.js';

export function createSubmitRecipe({db,now,nameRef,valid,starterRecipes,ensureStarterRecipe}){
 return async request=>{
  if(!request.auth)throw new HttpsError('unauthenticated','Please sign in.');
  const uid=request.auth.uid,recipe=await valid(request.data?.recipe),targetId=request.data?.targetId||null;
  if(targetId&&(typeof targetId!=='string'||!/^[\w-]{1,200}$/.test(targetId)))throw new HttpsError('invalid-argument','Invalid recipe.');
  const wanted=namesOf(recipe);
  for(const starter of starterRecipes)if(starter.id===targetId||namesOf(starter).some(n=>wanted.includes(n))){
   const existingId=await ensureStarterRecipe(starter.id);
   if(starter.id===targetId&&existingId!==targetId)throw new HttpsError('already-exists','မူလအမည်ကို အသုံးပြုထားသော ချက်နည်းကို ပြင်ပါ။',{recipeId:existingId});
  }
  const profile=await db.doc(`users/${uid}`).get();
  const author=String(profile.data()?.name||request.auth.token.name||'Home cook').slice(0,80);
  const audit=db.collection('requests').doc();
  return db.runTransaction(async tx=>{
   const ref=targetId?db.doc(`recipes/${targetId}`):null;
   const target=ref?await tx.get(ref):null,old=target?.data();
   if(target&&!target.exists)throw new HttpsError('not-found','ပြင်မည့်ချက်နည်း မတွေ့ပါ။ Refresh လုပ်ပြီး ပြန်ရွေးပါ။',{reason:'recipe-not-found'});
   const direct=target&&canEditRecipe(old,{uid,admin:isAdminToken(request.auth.token)});
   if(direct&&(!Number.isInteger(request.data?.baseVersion)||request.data.baseVersion!==(old.version||0)))throw new HttpsError('failed-precondition','ဒီချက်နည်းကို အခြားတစ်ယောက် ပြင်ထားပါသည်။ Refresh လုပ်ပြီး နောက်ဆုံးချက်နည်းမှ ပြန်ပြင်ပါ။',{reason:'stale-recipe'});
   for(const name of namesOf(recipe)){
    const existing=await tx.get(nameRef(name));
    if(existing.exists&&existing.data().recipeId!==targetId)throw new HttpsError('already-exists','ဒီအမည်နှင့် ချက်နည်းရှိပြီးသားပါ။',{recipeId:existing.data().recipeId});
   }
   if(direct){
    const newNames=namesOf(recipe);
    for(const name of namesOf(old))if(!newNames.includes(name))tx.delete(nameRef(name));
    for(const name of newNames)tx.set(nameRef(name),{recipeId:targetId,normalizedName:name});
    tx.set(ref,{...recipe,status:'published',author:old.author||'Home cook',authorId:old.authorId||'editorial',createdAt:old.createdAt||now(),updatedAt:now(),lastContributor:author,version:(old.version||0)+1});
    tx.create(audit,{type:'edit',targetId,recipeId:targetId,recipe,baseVersion:old.version||0,author,authorId:uid,status:'approved',reviewedBy:uid,reviewedAt:now(),createdAt:now(),note:String(request.data?.note||'').slice(0,2000)});
    return {id:audit.id,recipeId:targetId,status:'published'};
   }
   if(!targetId){
    for(const name of namesOf(recipe))tx.create(nameRef(name),{recipeId:audit.id,normalizedName:name});
    tx.create(db.doc(`recipes/${audit.id}`),{...recipe,status:'published',author,authorId:uid,version:1,createdAt:now(),updatedAt:now()});
    tx.create(audit,{type:'submission',targetId:null,recipe,authorId:uid,author,status:'approved',recipeId:audit.id,createdAt:now()});
    return {id:audit.id,recipeId:audit.id,status:'published'};
   }
   // Non-owners can suggest a change, but cannot change the published record.
   tx.create(audit,{type:'edit',targetId,baseVersion:old.version||0,recipe,authorId:uid,author,status:'pending',note:String(request.data?.note||'').trim().slice(0,2000),createdAt:now()});
   return {id:audit.id,status:'pending'};
  });
 };
}
