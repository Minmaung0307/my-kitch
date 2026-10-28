import {validateRecipe,namesOf} from '../functions/lib/model.js';
export const IMPORT_PREFIX='#import/v1/';
export const MAX_LINK_CHARS=16000;
export const MAX_DRAFT_BYTES=64000;

// The fragment stays in the browser. No AI API or import server is involved.
export async function decodeRecipeLink(hash){
 if(!hash.startsWith(IMPORT_PREFIX))throw new Error('ချက်နည်းလင့်ခ် ပုံစံမမှန်ပါ။');
 const encoded=hash.slice(IMPORT_PREFIX.length);
 if(!encoded||encoded.length>MAX_LINK_CHARS||!/^[A-Za-z0-9_-]+$/.test(encoded))throw new Error('ချက်နည်းလင့်ခ် ပျက်နေပါသည် သို့မဟုတ် ရှည်လွန်းပါသည်။');
 try{
  const raw=atob(encoded.replace(/-/g,'+').replace(/_/g,'/'));
  const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  let text;
  if(bytes[0]===0x1f&&bytes[1]===0x8b){
   const reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
   const chunks=[];let length=0;
   try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>MAX_DRAFT_BYTES)throw new Error('oversize');chunks.push(value)}}finally{await reader.cancel().catch(()=>{})}
   const result=new Uint8Array(length);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length}text=new TextDecoder('utf-8',{fatal:true}).decode(result);
  }else{if(bytes.length>MAX_DRAFT_BYTES)throw new Error('oversize');text=new TextDecoder('utf-8',{fatal:true}).decode(bytes)}
  const data=JSON.parse(text);
  if(!data||Array.isArray(data)||typeof data!=='object')throw new Error('shape');
  return validateRecipe(data);
 }catch{throw new Error('ချက်နည်းလင့်ခ်ကို ဖတ်မရပါ။ ChatGPT ကို လင့်ခ်အသစ် ပြန်ထုတ်ပေးရန် ပြောပါ။')}
}

export function recipeChatPrompt(dish=''){
 return `You are helping me save a single recipe to Myanmar Kitchen (https://kitchen.mmusa.org). Explain in Burmese, and prepare the saved recipe in BOTH English and Burmese. ${dish?'Please help me make: '+dish+'.':'Ask which dish or snack I want to make.'}
Explain a practical recipe with measured ingredients, servings, total prep/cook time, and ordered cooking steps. Do not invent missing details when converting an existing recipe: ask if necessary. When I say "Kitchen ထဲသိမ်းပေးပါ" or ask to save, generate a clickable import link for the current recipe. Do NOT tell me to copy recipe text, fill a form, or import a batch. The link opens a preview where I sign in and click to publish; do not claim it is already saved.
Link format: https://kitchen.mmusa.org/#import/v1/ followed by a URL-safe base64 encoding of gzip-compressed UTF-8 JSON, without trailing = padding. The JSON is a SINGLE object with keys: name (English name, <=160 chars), nameMy (Burmese name, <=160), description (English intro, <=2000), descriptionMy (Burmese intro, <=2000), category (one of rice,curry,noodle,salad,snack,dessert,drink,basic), difficulty (easy,medium,hard), cookTime (integer minutes 1..1440), servings (integer 1..100), ingredients (array of measured ingredient strings in ENGLISH), ingredientsMy (the matching BURMESE ingredients array), steps (array of ordered instructions in ENGLISH), stepsMy (the matching BURMESE steps array), tags (array, optional), region (optional), recipeGroup (optional). Do not send id, targetId, author, status, passwords or tokens. Always include both languages in all six text fields, not just an English title. Before encoding, check ingredients/steps/description are English and ingredientsMy/stepsMy/descriptionMy are Burmese. Match ingredient quantities and steps across languages. If updating a recipe already saved, keep the SAME names; an owner/admin can use the duplicate preview to update it instead of making another recipe.
If I choose photos I own or have permission to use, include photos (array of up to THREE real direct public HTTPS image URLs) and photo (the chosen cover URL from that array). Retain all chosen image URLs, not only the first. Do not invent URLs or treat a search result/page URL as an image URL. ChatGPT-generated images with sandbox:/, attachment-only, or private URLs cannot be fetched by Kitchen: clearly tell me to download those images and select up to three files via Kitchen's photo picker, then continue producing the text import link without claiming images are included. Do not turn private image links into fake public URLs. Omit videos unless I supplied public HTTPS URLs I may share.
Use your Python/code execution tool to generate the encoding exactly; do not guess a base64 string. Python: import json,gzip,base64; payload=json.dumps(recipe,ensure_ascii=False,separators=(',',':')).encode('utf-8'); token=base64.urlsafe_b64encode(gzip.compress(payload,mtime=0)).decode().rstrip('='); url='https://kitchen.mmusa.org/#import/v1/'+token. Check that decoding returns the exact recipe and token is <=16000 characters. Return [Kitchen ထဲသိမ်းရန်](URL) as a clickable Markdown link, not inside a code block. If code execution is unavailable, say so; do not fabricate a link. After generating, say to open the link and press "ချက်နည်းကို ထုတ်ဝေသိမ်းရန်". This uses my existing ChatGPT session and no paid OpenAI API.`;
}

// Propose distinct names for a new contributor's version; publication remains explicit.
export function importVariantRecipe(recipe,user,recipes){
 if(!user?.uid)throw new Error('Google ဖြင့် အရင်ဝင်ပါ။');
 const author=String(user.name||'Home cook').trim().replace(/\s+/g,' ').slice(0,40)||'Home cook';
 const reserved=new Set(recipes.flatMap(namesOf));
 const append=(base,suffix)=>String(base||'Recipe').slice(0,160-suffix.length).trim()+suffix;
 for(let index=1;index<=1000;index++){
  const count=index===1?'':` ${index}`;
  const candidate={...recipe,name:append(recipe.name,` — ${author}'s version${count}`),nameMy:append(recipe.nameMy||recipe.name,` — ${author} လက်ရာ${count}`)};
  if(namesOf(candidate).every(name=>!reserved.has(name)))return candidate;
 }
 throw new Error('အမည်အသစ် ရွေးပြီး ပြန်ကြိုးစားပါ။');
}
