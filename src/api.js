import seed from './recipes.json';
import {isAdminToken} from '../functions/lib/admin.js';
const env=import.meta.env;
let settings={};
export let configured=false;
export let dataWarning='';
let auth,db,fn,A,D,F;
export function supportUrl(key){return env['VITE_SUPPORT_'+key.toUpperCase()]||settings.support?.[key]||''}
export function authMessage(error){
 const messages={
 'auth/operation-not-allowed':'Firebase Console → Authentication → Sign-in method မှာ Google ကို Enable လုပ်ပေးရန် လိုအပ်ပါသည်။',
 'auth/unauthorized-domain':'ဒီဝဘ်ဆိုက် domain ကို Firebase Console → Authentication → Settings → Authorized domains မှာ ထည့်ပေးပါ။ Local run လျှင် localhost နှင့် 127.0.0.1 ကို ထည့်ပါ။',
 'auth/popup-blocked':'Browser က login window ကို ပိတ်ထားပါသည်။ ဒီဝဘ်ဆိုက်အတွက် pop-up ခွင့်ပြုပြီး ထပ်နှိပ်ပါ။',
 'auth/popup-closed-by-user':'Google login window ပိတ်သွားပါသည်။ ထပ်နှိပ်ပြီး Google account ရွေးပေးပါ။',
 'auth/cancelled-popup-request':'Google login window ဖွင့်ထားပြီးဖြစ်ပါသည်။ ထို window တွင် ဆက်လုပ်ပါ။',
 'auth/invalid-api-key':'Firebase web configuration မှ API key ကို ပြန်စစ်ပေးပါ။',
 'auth/network-request-failed':'Google သို့ ချိတ်ဆက်မရပါ။ အင်တာနက်ကို စစ်ပြီး ထပ်ကြိုးစားပါ။'
 };return messages[error.code]||`Google login မအောင်မြင်ပါ။ ${error.code||error.message||'ထပ်ကြိုးစားပါ။'}`;
}
export async function start(onUser){
 try{const response=await fetch('/app-config.json',{cache:'no-store'});if(response.ok)settings=await response.json()}catch{settings={}}
 const config=env.VITE_FIREBASE_API_KEY?{apiKey:env.VITE_FIREBASE_API_KEY,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN,projectId:env.VITE_FIREBASE_PROJECT_ID,appId:env.VITE_FIREBASE_APP_ID,messagingSenderId:env.VITE_FIREBASE_MESSAGING_SENDER_ID}:settings.firebase;
 configured=Boolean(config?.apiKey&&config?.projectId&&config?.authDomain&&config?.appId);
 if(!configured){onUser(null);return}
 const [{initializeApp},a,d,f]=await Promise.all([import('firebase/app'),import('firebase/auth'),import('firebase/firestore'),import('firebase/functions')]);A=a;D=d;F=f;
 const app=initializeApp(config);auth=a.getAuth(app);db=d.getFirestore(app);fn=f.getFunctions(app,env.VITE_FUNCTIONS_REGION||settings.functionsRegion||'us-central1');
 if(env.VITE_USE_EMULATORS==='true'){a.connectAuthEmulator(auth,'http://127.0.0.1:9099');d.connectFirestoreEmulator(db,'127.0.0.1',8080);f.connectFunctionsEmulator(fn,'127.0.0.1',5001)}
 a.onAuthStateChanged(auth,async user=>{
  if(!user){onUser(null);return}
  try{const token=await user.getIdTokenResult();let profile={};
   try{profile=(await Promise.race([d.getDoc(d.doc(db,'users',user.uid)),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Profile load timed out')),5000))])).data()||{}}catch{ /* Google authentication remains valid before Firestore setup. */ }
   if(auth.currentUser?.uid!==user.uid)return;
   onUser({uid:user.uid,name:profile.name||user.displayName||'Home cook',bio:profile.bio||'',email:user.email,admin:isAdminToken(token.claims)});
  }catch(error){onUser(null,error)}
 });
}
export async function login(){if(!auth)throw new Error('public/app-config.json ထဲတွင် Firebase configuration ထည့်ပြီး စာမျက်နှာကို ပြန်ဖွင့်ပါ။');await A.signInWithPopup(auth,new A.GoogleAuthProvider())}
export const logout=()=>A.signOut(auth);
export async function recipes(){
 dataWarning='';if(!configured)return seed;
 try{const snap=await D.getDocs(D.collection(db,'recipes'));if(!snap.empty)return snap.docs.map(d=>({...d.data(),id:d.id}));dataWarning='မူလဟင်းချက်နည်းများကို ပြထားပါသည်။ Community database ထဲသို့ recipe များ import လုပ်ရန် လိုအပ်ပါသည်။';return seed}
 catch{dataWarning='မူလဟင်းချက်နည်းများကို ပြထားပါသည်။ Community database ချိတ်ဆက်မရသေးပါ။ အင်တာနက် သို့မဟုတ် Firebase setup ကို စစ်ဆေးပါ။';return seed}
}
export async function favorites(uid){const snap=await D.getDocs(D.collection(db,'users',uid,'favorites'));return new Set(snap.docs.map(d=>d.id))}
export async function favorite(uid,id,on){const ref=D.doc(db,'users',uid,'favorites',id);return on?D.setDoc(ref,{createdAt:D.serverTimestamp()}):D.deleteDoc(ref)}
export async function profile(uid,name,bio){return D.setDoc(D.doc(db,'users',uid),{name,bio,updatedAt:D.serverTimestamp()},{merge:true})}
async function refreshedRead(action){try{return await action()}catch(error){if(error.code!=='permission-denied'||!auth.currentUser)throw error;await auth.currentUser.getIdToken(true);return action()}}
export async function requests(user){const col=D.collection(db,'requests');const q=user.admin?col:D.query(col,D.where('authorId','==',user.uid));const snap=await refreshedRead(()=>D.getDocs(q));return snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))}
export async function call(name,data){try{return (await F.httpsCallable(fn,name)(data)).data}catch(error){error.operation=name;throw error}}

export async function getCategories(){if(!configured)return [];const snap=await D.getDocs(D.collection(db,'categories'));return snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>a.name.localeCompare(b.name))}

export function errorMessage(error,context=''){
 const code=String(error.code||'');const operation=error.operation||error.details?.operation||context;
 let message=error.message||'မအောင်မြင်ပါ။ ထပ်ကြိုးစားပါ။';
 if(code==='permission-denied')message='Firestore ဝင်ခွင့် မရပါ။ Project မှန်ကြောင်းနှင့် rules အသစ် deploy ပြီးကြောင်း စစ်ပါ။ Admin ဆိုလျှင် သတ်မှတ်ထားသော Gmail နှစ်ခုမှ Google ဖြင့် ပြန်ဝင်ပါ။ App admin ဖြစ်ခြင်းက Cloud project owner ခွင့်ကို မပေးပါ။';
 else if(code==='functions/internal')message='Server လုပ်ဆောင်ချက် မအောင်မြင်ပါ။ Function deploy အခြေအနေနှင့် Cloud log ကို စစ်ရန် လိုပါသည်။ Form ထဲကစာများ မပျောက်ပါ။';
 else if(code==='functions/not-found'&&error.details?.reason==='recipe-not-found')message=error.message;
 else if(code==='functions/unavailable'||(code==='functions/not-found'&&/^(not[_ -]?found|404)$/i.test(error.message||'')))message='လိုအပ်သည့် function မရရှိသေးပါ။ Function deployment ကို အပြီးသတ်ပြီး ထပ်ကြိုးစားပါ။';
 else if(code==='functions/unauthenticated')message='Login သက်တမ်းကုန်သွားနိုင်ပါသည်။ Google ဖြင့် ပြန်ဝင်ပြီး ကြိုးစားပါ။';
 const reference=error.details?.reference;
 return message+(operation?' ['+operation+']':'')+(reference?' · Ref: '+reference:'');
}
