const MAX_INPUT=25*1024*1024,MAX_OUTPUT=600*1024;
const encode=(canvas,quality)=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('ဓာတ်ပုံပြောင်းမရပါ။')),'image/webp',quality));
async function decode(blob){const url=URL.createObjectURL(blob);try{const image=new Image();image.src=url;await image.decode();return image}finally{URL.revokeObjectURL(url)}}
export async function compressPhoto(file){
 if(!file||file.size>MAX_INPUT)throw new Error('25 MB အောက်ရှိ ပုံကို ရွေးပေးပါ။');
 if(!/\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name)&&!/^image\/(jpeg|png|webp|gif|avif|heic|heif)$/.test(file.type))throw new Error('JPG၊ PNG၊ WebP၊ GIF၊ AVIF၊ HEIC/HEIF ပုံကို ရွေးပေးပါ။');
 let image;try{image=await decode(file)}catch{
  if(!/\.(heic|heif)$/i.test(file.name)&&!/heic|heif/.test(file.type))throw new Error('ဒီပုံကို ဖတ်မရပါ။ JPG သို့မဟုတ် PNG အဖြစ် ပြန်ရွေးပါ။');
  try{const {heicTo}=await import('heic-to/csp');image=await decode(await heicTo({blob:file,type:'image/jpeg',quality:.85}))}catch{throw new Error('ဒီ HEIC ပုံကို ပြောင်းမရပါ။ ဖုန်း/Photos app မှ JPG အဖြစ် export လုပ်ပြီး ပြန်ရွေးပါ။')}
 }
 if(image.naturalWidth*image.naturalHeight>60000000)throw new Error('ပုံအရွယ်အစား အလွန်ကြီးနေပါသည်။ ပုံကို လျှော့ပြီး ပြန်ရွေးပါ။');
 const canvas=document.createElement('canvas');let edge=1600,blob;
 for(let attempt=0;attempt<5;attempt++){
  const scale=Math.min(1,edge/image.naturalWidth,edge/image.naturalHeight);canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
  blob=await encode(canvas,.82-attempt*.09);if(blob.size<=MAX_OUTPUT)break;edge=Math.round(edge*.8);
 }
 if(blob.size>MAX_OUTPUT)throw new Error('ဒီပုံကို လုံလောက်အောင် မချုံ့နိုင်ပါ။ ပိုသေးသောပုံကို ရွေးပါ။');
 return {blob,width:canvas.width,height:canvas.height,originalBytes:file.size};
}
export const base64Of=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob)});
