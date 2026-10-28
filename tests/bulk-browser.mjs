import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();
await page.route('**/src/api.js',route=>route.fulfill({contentType:'application/javascript',body:`
import seed from '/src/recipes.json';
export const configured=true,dataWarning='';let data=[...seed];
export const supportUrl=()=>'';
export async function start(cb){cb({uid:'test-admin',name:'Test owner',admin:false,email:'owner@example.test'})}
export async function recipes(){return data}
export async function favorites(){return new Set()}
export async function getCategories(){return []}
export async function requests(){return []}
export function errorMessage(e){return e.message}
export async function call(name,input){if(name==='submitRecipe'){data.push({...input.recipe,id:'new-'+data.length});return {status:'published'}}return {}}
`}));
await page.goto('http://127.0.0.1:5193');await page.locator('.recipe-card').first().waitFor();
await page.locator('#account').click();await page.locator('#account-bulk').click();await page.locator('#bulk-sample').click();await page.getByText('ထည့်ရန် 6 မျိုး အသင့်ဖြစ်ပါပြီ။',{exact:true}).waitFor();
assert.equal(await page.locator('#bulk-preview p').count(),6);
await page.locator('#bulk-publish').click();await page.getByText('6 မျိုး ပြီးပါပြီ။ 0 မျိုး ကျန်ပါသည်။',{exact:false}).waitFor();
await page.keyboard.press('Escape');assert.equal(await page.locator('.recipe-card').count(),30);
await page.locator('#account').click();await page.locator('#account-bulk').click();await page.locator('#bulk-sample').click();assert.equal(await page.locator('#bulk-publish').isDisabled(),true);
await page.keyboard.press('Escape');await page.locator('#share').click();
await page.locator('[data-sample-photo="laphet-ai-sample.png"]').click();assert.ok((await page.locator('[name=photo]').inputValue()).endsWith('/images/laphet-ai-sample.png'));
assert.equal(await page.locator('#photo-preview img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
for(const width of [390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`signed-in overflow at ${width}`)}
console.log('PASS: batch preview, publish, duplicate skip, six prepared recipes, sample image selection (mock backend).');await browser.close();
