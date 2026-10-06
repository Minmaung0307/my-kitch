import {test} from 'node:test';import assert from 'node:assert/strict';
import {createRequire} from 'node:module';const sharp=createRequire(new URL('../functions/package.json',import.meta.url))('sharp');
import {sanitizePhoto} from '../functions/lib/photos.js';
import {validateCategory} from '../functions/lib/categories.js';
import {validateRecipe} from '../functions/lib/model.js';
test('server converts valid photos to bounded WebP without metadata',async()=>{
 const input=await sharp({create:{width:2400,height:1700,channels:3,background:'#689459'}}).jpeg().withMetadata({exif:{IFD0:{Artist:'Private metadata'}}}).toBuffer();
 const out=await sanitizePhoto(input.toString('base64'));const meta=await sharp(out).metadata();assert.equal(meta.format,'webp');assert.equal(meta.width,1600);assert.ok(meta.height<=1600);assert.equal(meta.exif,undefined);assert.ok(out.length<=700*1024);
});
test('server rejects forged image content, SVG and oversize input',async()=>{for(const s of ['not an image',Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>').toString('base64'),'A'.repeat(1000000)])await assert.rejects(sanitizePhoto(s))});
test('category names validated and only explicitly registered extra categories accepted',()=>{
 assert.throws(()=>validateCategory({name:'  '}));assert.throws(()=>validateCategory({name:'x'.repeat(81)}));assert.equal(validateCategory({name:' Soup ',nameMy:'ဟင်းချို'}).name,'Soup');
 const r={name:'Soup',description:'Hello',category:'cat-123',difficulty:'easy',cookTime:10,servings:1,ingredients:['1 cup water'],steps:['Boil.']};assert.throws(()=>validateRecipe(r));assert.equal(validateRecipe(r,['cat-123']).category,'cat-123');
});

import {guarded} from '../functions/lib/errors.js';
import {HttpsError} from '../functions/node_modules/firebase-functions/lib/v2/providers/https.js';
test('backend errors preserve actionable distinctions and diagnostic references',async()=>{
 const denied=Object.assign(new Error('runtime permission'),{code:7});await assert.rejects(guarded('submitRecipe',async()=>{throw denied})({}),e=>e.code==='failed-precondition'&&e.details.reason==='backend-permission'&&Boolean(e.details.reference));
 const expected=new HttpsError('already-exists','Duplicate');await assert.rejects(guarded('createCategory',async()=>{throw expected})({}),e=>e===expected);
});
