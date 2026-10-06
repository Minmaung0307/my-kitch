import {normalizeName} from './model.js';
export const defaultCategories=[
 ['rice','Rice & everyday','ထမင်း'],['curry','Curries','ဟင်း'],['noodle','Noodles & soups','ခေါက်ဆွဲ'],['salad','Salads','အသုပ်'],['snack','Snacks','အဆာပြေ'],['dessert','Sweet treats','အချိုပွဲ'],['drink','Tea & drinks','အဖျော်ယမကာ'],['basic','Kitchen basics','အခြေခံ']
].map(([id,name,nameMy])=>({id,name,nameMy}));
export function validateCategory(data){
 const name=typeof data?.name==='string'?data.name.trim():'';
 const nameMy=typeof data?.nameMy==='string'?data.nameMy.trim():'';
 if(!normalizeName(name)||name.length>80||nameMy.length>80)throw new Error('Category အမည်ကို စာလုံး ၈၀ အတွင်း ထည့်ပေးပါ။');
 return {name,nameMy};
}
export const categoryNames=c=>[...new Set([c.name,c.nameMy].map(normalizeName).filter(Boolean))];
