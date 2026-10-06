// Run from functions/ with Application Default Credentials. Never bundle service account keys.
import {initializeApp,applicationDefault} from 'firebase-admin/app';
import {getFirestore,FieldValue} from 'firebase-admin/firestore';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {namesOf} from './lib/model.js';
const [command]=process.argv.slice(2);if(command!=='seed')throw new Error('Usage: node manage.js seed. Admin access is restricted to the two verified Google emails in lib/admin.js and firestore.rules.');
initializeApp({credential:applicationDefault()});const db=getFirestore();
{const seed=JSON.parse(readFileSync(new URL('./seed.json',import.meta.url)));for(const recipe of seed){await db.runTransaction(async tx=>{const ref=db.doc(`recipes/${recipe.id}`),current=await tx.get(ref);if(current.exists)return;const names=namesOf(recipe).map(n=>({n,ref:db.doc(`recipeNames/${createHash('sha256').update(n).digest('hex')}`)}));for(const {ref:nref} of names){const n=await tx.get(nref);if(n.exists&&n.data().recipeId!==recipe.id)throw new Error(`Duplicate seed name for ${recipe.id}`)}tx.create(ref,{...recipe,createdAt:FieldValue.serverTimestamp()});for(const {n,ref:nref} of names)tx.set(nref,{normalizedName:n,recipeId:recipe.id})});}console.log('Seed import complete; existing recipes preserved.');}
