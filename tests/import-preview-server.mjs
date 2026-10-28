// Local-only browser test harness: replaces Firebase with an in-memory mock.
// Not included in the production build and never writes to a cloud project.
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const mock=`
import seed from '/src/recipes.json';
export const configured=true,dataWarning='';let data=[...seed],callback,attempt=0;
const signed=()=>new URLSearchParams(location.search).has('signed');
const user={uid:'local-test-cook',name:'Local Test Cook',email:'test@example.test',admin:new URLSearchParams(location.search).has('admin')};
const fixture={id:'owner-pudding',name:'Test Caramel Pudding',nameMy:'စမ်းသပ်ကြက်ဥပူတင်း',description:'A smooth steamed egg pudding.',descriptionMy:'နူးညံ့သော ကြက်ဥပူတင်း။',category:'dessert',difficulty:'easy',cookTime:55,servings:4,ingredients:['4 eggs','300 ml milk'],ingredientsMy:['ကြက်ဥ ၄ လုံး','နို့ ၃၀၀ မီလီလီတာ'],steps:['Whisk the eggs with milk.','Steam until set.'],stepsMy:['ကြက်ဥနှင့်နို့ ခလောက်ပါ။','ကျက်သည်အထိ ပေါင်းပါ။'],tags:[],videos:[],photo:'https://kitchen.mmusa.org/images/laphet-ai-sample.png',photos:['https://kitchen.mmusa.org/images/laphet-ai-sample.png','https://kitchen.mmusa.org/images/mont-lone-ai-sample.png','https://kitchen.mmusa.org/images/fried-rice-illustration.png'],version:3,author:'Local Test Cook',authorId:'local-test-cook'};data.push(fixture,{...fixture,id:'other-pudding',name:'Other Pudding',nameMy:'အခြားသူ၏ပူတင်း',authorId:'other-cook',author:'Other Cook'});let uploads=0;
export const supportUrl=()=>'';
export async function start(cb){callback=cb;await cb(signed()?user:null)}
export async function login(){setTimeout(()=>callback(user),100)}
export async function logout(){await callback(null)}
export async function recipes(){return data}
export async function getCategories(){return []}
export async function favorites(){return new Set()}
export async function requests(){return []}
export function authMessage(e){return e.message}
export function errorMessage(e){return e.message}
export async function call(name,input){
 if(name==='uploadRecipePhoto')return {url:'https://kitchen.mmusa.org/images/'+['laphet-ai-sample.png','mont-lone-ai-sample.png','fried-rice-illustration.png'][uploads++%3]};
 if(name!=='submitRecipe')throw Error('Only recipe publication is supported in this local test.');
 if(input.targetId){const old=data.find(x=>x.id===input.targetId);if(!old)throw Error('Missing recipe');if(old.authorId!==user.uid&&!user.admin)return {status:'pending'};if(input.baseVersion!==old.version)throw Error('Stale recipe');Object.assign(old,input.recipe,{version:old.version+1});return {status:'published',recipeId:old.id};}
 if(new URLSearchParams(location.search).has('fail')&&attempt++===0)throw Error('Test network interruption — retry is safe.');
 const id='local-import-'+data.length;data.push({...input.recipe,id,author:'Local Test Cook'});return {status:'published',recipeId:id};
}`;
const server=await createServer({root,configFile:false,plugins:[{name:'test-only-api',enforce:'pre',load(id){if(id===root+'src/api.js')return mock}}],server:{host:'127.0.0.1',port:5194,strictPort:true}});
await server.listen();server.printUrls();
