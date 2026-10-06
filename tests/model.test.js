import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {normalizeName,duplicateOf,matchesRecipe,validateRecipe,safeUrl,videoPreview,namesOf} from '../functions/lib/model.js';
const recipe={name:'Tea Leaf Salad',nameMy:'လက်ဖက်သုပ်',description:'A family salad',ingredients:['2 tbsp tea leaves'],ingredientsMy:['လက်ဖက်'],steps:['Mix everything.'],category:'salad',tags:['vegetarian'],difficulty:'easy',cookTime:10,servings:2,author:'Daw May',region:'Shan'};
test('normalizes Unicode, case, whitespace and invisible formatting',()=>{assert.equal(normalizeName('  TEA\t LEAF  Salad\n'),'tea leaf salad');assert.equal(normalizeName('ＴＥＡ'),'tea');assert.equal(normalizeName('လက်\u200bဖက်သုပ်'),'လက်ဖက်သုပ်')});
test('exact duplicates use both language names but not partial matches',()=>{const data=[{...recipe,id:'one'}];assert.equal(duplicateOf(data,{name:' tea leaf   SALAD '}).id,'one');assert.equal(duplicateOf(data,{name:'လက်ဖက်သုပ်'}).id,'one');assert.equal(duplicateOf(data,{name:'Tea Leaf'}),undefined);assert.equal(duplicateOf(data,recipe,'one'),undefined)});
test('broad multi-term searches include Burmese, ingredients, tags and contributor',()=>{for(const q of ['daw salad','လက်ဖက်','vegetarian','2 tbsp','shan'])assert.ok(matchesRecipe(recipe,q));assert.ok(!matchesRecipe(recipe,'fish'))});
test('rejects unsafe URLs and forged YouTube hosts',()=>{for(const value of ['javascript:alert(1)','http://example.com','data:text/html,x','https://user:pass@host.com'])assert.equal(safeUrl(value),'');assert.equal(videoPreview('https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ').embed,null);assert.equal(videoPreview('https://youtu.be/dQw4w9WgXcQ').embed,'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');assert.equal(videoPreview('https://www.tiktok.com/@cook/video/123').host,'www.tiktok.com')});
test('validates full contributions and strips identity/status injection',()=>{const clean=validateRecipe({...recipe,status:'published',authorId:'admin',version:999});assert.equal(clean.authorId,undefined);assert.equal(clean.status,undefined);assert.equal(clean.version,undefined);assert.equal(clean.cookTime,10);for(const patch of [{name:' '},{ingredients:[]},{steps:[]},{cookTime:0},{servings:1.2},{category:'bad'},{photo:'javascript:x'},{videos:['http://x.com']}])assert.throws(()=>validateRecipe({...recipe,...patch}))});
test('migrated catalog has unique IDs and normalized bilingual names',()=>{const data=JSON.parse(readFileSync(new URL('../src/recipes.json',import.meta.url)));const ids=new Set(),names=new Set();for(const r of data){assert.ok(!ids.has(r.id));ids.add(r.id);for(const n of namesOf(r)){assert.ok(!names.has(n),`Duplicate ${n}`);names.add(n)}}assert.equal(data.length,24)});

import {isAdminToken} from '../functions/lib/admin.js';
test('only the two verified Google accounts are administrators',()=>{
 const token=email=>({email,email_verified:true,firebase:{sign_in_provider:'google.com'}});
 for(const email of ['minmaung0307@gmail.com','panna07@gmail.com'])assert.ok(isAdminToken(token(email)));
 assert.ok(!isAdminToken({...token('someone@gmail.com'),admin:true}));
 assert.ok(!isAdminToken({...token('minmaung0307@gmail.com'),email_verified:false}));
 assert.ok(!isAdminToken({...token('panna07@gmail.com'),firebase:{sign_in_provider:'password'}}));
 assert.ok(!isAdminToken({admin:true}));
});

test('regional variants share a searchable group without becoming exact-name duplicates',()=>{
 const rakhine=validateRecipe({...recipe,name:'Rakhine Mont Ti',nameMy:'ရခိုင်မုန့်တီ',recipeGroup:'  မုန့်တီ  ',region:'ရခိုင်'});
 const mandalay=validateRecipe({...recipe,name:'Mandalay Mont Ti',nameMy:'မန္တလေးမုန့်တီ',recipeGroup:'မုန့်တီ',region:'မန္တလေး'});
 rakhine.id='rakhine';mandalay.id='mandalay';assert.equal(rakhine.recipeGroup,'မုန့်တီ');
 assert.ok(matchesRecipe(rakhine,'မုန့်တီ ရခိုင်'));assert.ok(matchesRecipe(mandalay,'မုန့်တီ မန္တလေး'));
 assert.ok(!matchesRecipe(rakhine,'မန္တလေး'));assert.equal(duplicateOf([rakhine],mandalay),undefined);
 assert.equal(duplicateOf([rakhine],{...rakhine,recipeGroup:'Other'}),rakhine);
 assert.equal(validateRecipe(recipe).recipeGroup,'');assert.equal(validateRecipe({...recipe,recipeGroup:'a'.repeat(100)}).recipeGroup.length,80);
});
