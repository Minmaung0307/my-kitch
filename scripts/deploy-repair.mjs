import {spawnSync} from 'node:child_process';
// Callable transport is public; handlers enforce Firebase authentication and admin checks.
// No deletes, database replacement or bucket recreation.
const project='my-kitch';
const stages=[['Firestore rules',['deploy','--project',project,'--only','firestore:rules']],['Storage rules',['deploy','--project',project,'--only','storage']],...['submitRecipe','createCategory','reviewRequest','uploadRecipePhoto','initializeCatalog'].map(name=>[name,['deploy','--project',project,'--only',`functions:${name}`]]),['Hosting',['deploy','--project',project,'--only','hosting']]];
for(const [label,args] of stages){console.log(`\n>>> ${label}`);const result=spawnSync('firebase',args,{stdio:'inherit',shell:process.platform==='win32'});if(result.error){console.error('Firebase CLI မတွေ့ပါ။ npm install -g firebase-tools ဖြင့် ထည့်ပါ။');process.exit(1)}if(result.status!==0){console.error(`\n${label} အဆင့် မအောင်မြင်ပါ။ နောက်အဆင့်များ မတင်ရသေးပါ။ အထက်က error နှင့် Cloud Build log ကို သိမ်းထားပါ။`);process.exit(result.status||1)}}
console.log('\nအဆင့်အားလုံး deploy ပြီးပါပြီ။ Browser ကို refresh လုပ်ပြီး Google login ပြန်ဝင်ပါ။');
