import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getFirestore,FieldValue} from 'firebase-admin/firestore';
import {namesOf} from './model.js';
export const starterRecipes=JSON.parse(readFileSync(new URL('../seed.json',import.meta.url)));
// Only trusted bundled originals can be imported. User changes still require review.
export async function ensureStarterRecipe(id){
 const recipe=starterRecipes.find(r=>r.id===id);if(!recipe)return null;
 const db=getFirestore(),ref=db.doc(`recipes/${id}`);
 return db.runTransaction(async tx=>{
  if((await tx.get(ref)).exists)return id;
  const names=namesOf(recipe).map(name=>({name,ref:db.doc('recipeNames/'+createHash('sha256').update(name).digest('hex'))}));
  for(const entry of names){const snap=await tx.get(entry.ref);if(snap.exists&&snap.data().recipeId!==id)return snap.data().recipeId;}
  tx.create(ref,{...recipe,createdAt:FieldValue.serverTimestamp()});
  for(const entry of names)tx.set(entry.ref,{normalizedName:entry.name,recipeId:id});
  return id;
 });
}
