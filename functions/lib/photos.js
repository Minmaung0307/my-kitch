import sharp from 'sharp';
export const MAX_PHOTO_BYTES=700*1024;
export async function sanitizePhoto(base64){
 if(typeof base64!=='string'||base64.length>Math.ceil(MAX_PHOTO_BYTES/3)*4||!base64.length||!/^[A-Za-z0-9+/]+={0,2}$/.test(base64))throw new Error('ပုံဖိုင်အရွယ်အစား သို့မဟုတ် format မမှန်ပါ။');
 const input=Buffer.from(base64,'base64');if(input.length>MAX_PHOTO_BYTES)throw new Error('ပုံသည် 700 KB ထက်ကြီးနေပါသည်။');
 const options={limitInputPixels:20000000,failOn:'error'};
 const meta=await sharp(input,options).metadata();if(!['jpeg','png','webp','gif','avif'].includes(meta.format))throw new Error('ပုံ format ကို လက်မခံနိုင်ပါ။');
 const buffer=await sharp(input,options).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:78}).toBuffer();
 if(buffer.length>MAX_PHOTO_BYTES)throw new Error('ပုံဖိုင်ကို ထပ်မံချုံ့ရန် လိုပါသည်။');
 return buffer;
}
