export const categories=['rice','curry','noodle','salad','snack','dessert','drink','basic'];
export const normalizeName=value=>String(value||'').normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').trim().replace(/\s+/gu,' ').toLocaleLowerCase('en-US');
export const namesOf=r=>[...new Set([r.name,r.nameMy].map(normalizeName).filter(Boolean))];
export function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:''}catch{return ''}}
export function videoPreview(value){const safe=safeUrl(value);if(!safe)return null;const u=new URL(safe);let id='';if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)){id=u.pathname.startsWith('/shorts/')?u.pathname.split('/')[2]:u.searchParams.get('v')}else if(u.hostname==='youtu.be')id=u.pathname.slice(1);return {url:safe,host:u.hostname,embed:/^[\w-]{11}$/.test(id||'')?`https://www.youtube-nocookie.com/embed/${id}`:null}}
function text(v,max=200){return typeof v==='string'?v.trim().slice(0,max):''}
export function validateRecipe(input,extraCategories=[]){
 const r={name:text(input.name,160),nameMy:text(input.nameMy,160),description:text(input.description,2000),descriptionMy:text(input.descriptionMy,2000),category:text(input.category),difficulty:text(input.difficulty),cookTime:Number(input.cookTime),servings:Number(input.servings),recipeGroup:text(input.recipeGroup,80).replace(/\s+/gu,' '),region:text(input.region,100),photo:text(input.photo,2000),tags:Array.isArray(input.tags)?input.tags.map(x=>text(x,50)).filter(Boolean).slice(0,12):[],videos:Array.isArray(input.videos)?input.videos.map(x=>text(x,2000)).filter(Boolean).slice(0,5):[]};
 for(const k of ['ingredients','steps','ingredientsMy','stepsMy'])r[k]=Array.isArray(input[k])?input[k].map(x=>text(x,1000)).filter(Boolean).slice(0,60):[];
 if(!normalizeName(r.name)||!r.description||![...categories,...extraCategories].includes(r.category)||!['easy','medium','hard'].includes(r.difficulty)||!Number.isInteger(r.cookTime)||r.cookTime<1||r.cookTime>1440||!Number.isInteger(r.servings)||r.servings<1||r.servings>100||!r.ingredients.length||!r.steps.length)throw new Error('Add a name, description, ingredients, steps, valid category, cook time (1–1440) and servings (1–100).');
 if((r.photo&&!safeUrl(r.photo))||r.videos.some(x=>!safeUrl(x)))throw new Error('Photos and videos must use valid HTTPS URLs without embedded credentials.');
 return r;
}
export function matchesRecipe(r,query){const hay=normalizeName([r.name,r.nameMy,r.description,r.descriptionMy,r.category,r.recipeGroup,r.region,r.author,r.lastContributor,...r.tags,...r.ingredients,...r.ingredientsMy].join(' '));return normalizeName(query).split(' ').every(term=>hay.includes(term))}
export function duplicateOf(recipes,input,exceptId){const names=namesOf(input);return recipes.find(r=>r.id!==exceptId&&namesOf(r).some(n=>names.includes(n)))}
