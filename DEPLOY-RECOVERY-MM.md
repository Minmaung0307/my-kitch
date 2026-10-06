> Historical v2.2.1 troubleshooting notes. For the current deployed v2.3 workflow and fixes, read WORKFLOW-MM.md.

# Version 2.2.1 — မညီညာမှုနှင့် deployment ပြန်ပြင်ရန်

## ပြင်ထားပြီးသောအချက်များ

- English/မြန်မာ label များ font အမြင့်ကွာသော်လည်း input အကွက်များကို အောက်ခြေတစ်တန်းတည်း၊ အမြင့်တူအောင် ပြင်ထားသည်။
- Duplicate warning မရှိချိန်တွင် အလွတ်နေရာပိုကို ဖျောက်ထားသည်။
- Inbox permission error ဖြစ်လျှင် token ကို တစ်ကြိမ် refresh လုပ်ပြီး ပြန်စမ်းသည်။ ထပ်မရလျှင် Firestore rules/account စစ်ရန် မြန်မာလို ဖော်ပြသည်။ Access rules ကို အများပြည်သူဖွင့်ပေးထားခြင်း မရှိပါ။
- Function error မှာ operation အမည်၊ server diagnostic reference ပါလာသည်။ Server permission/resource error ကို တခြား error မှ ခွဲပြသည်။
- Photo native library ကို photo function ခေါ်ချိန်မှ load လုပ်သည်။ ယခု build failure ၏ အကြောင်းရင်းဖြစ်ကြောင်း အတည်ပြုထားခြင်း မဟုတ်ပါ။

## ပေးထားသည့် log မှ အတည်ပြုနိုင်သောအချက်

`submitRecipe` နှင့် `createCategory` နောက်ပိုင်း create အောင်မြင်သည်။ `reviewRequest` နှင့် `uploadRecipePhoto` deployment မအောင်မြင်သေးသည်။ အစပိုင်း source-bucket 409 error တစ်ခုတည်းကြောင့် ကျန်နှစ်ခု ပျက်သည်ဟု မသတ်မှတ်နိုင်ပါ။ Cloud Build အတွင်းက log လိုပါသည်။

Inbox ၏ Missing or insufficient permissions သည် Firestore request ကို ပိတ်ထားခြင်းဖြစ်သည်။ Rules မတင်ပြီးခြင်း၊ project/account မကိုက်ခြင်း သို့မဟုတ် token အခြေအနေကို စစ်ရန်လိုသည်။ App admin Gmail နှစ်ခုဖြစ်ခြင်းက Google Cloud/Firebase Console owner ခွင့်ကို အလိုအလျောက် မပေးပါ။

## အဆင့်လိုက် ပြန်တင်ရန်

ZIP အသစ်ကို folder အသစ်ထဲ ဖြည်ပြီး `myanmar-kitchen` folder မှ:

```sh
npm ci
npm ci --prefix functions
firebase login --reauth
npm run deploy:repair
```

Firebase login တွင် **my-kitch project ကို deploy ခွင့်ရှိသော account** ကိုရွေးပါ။ Script သည် rules ကို အရင်တင်ပြီး function ငါးခုကို တစ်ခုချင်းစီတင်ကာ နောက်ဆုံး hosting တင်သည်။ အမှားရှိသည့်အဆင့်မှာ ရပ်ပြီး ဘယ်အဆင့်မအောင်မြင်ကြောင်း ပြသည်။ Bucket/database မဖျက်ပါ။ Callable transport ကို public သတ်မှတ်ပြီး function အတွင်း Google login/admin ခွင့်ကို စစ်သည်။

Storage မဖွင့်ရသေးလျှင် Firebase Console → my-kitch → Storage ကို အရင် setup လုပ်ပါ။ အသေးစိတ်ကို `စတင်အသုံးပြုရန်.md` တွင်ကြည့်ပါ။

အားလုံးတင်ပြီးလျှင် browser refresh လုပ်ပြီး sign out / Google sign in ပြန်လုပ်ပါ။ `http://localhost:5173` ကို သုံးပါ။

## ဆက်မရပါက မူလ build log ရယူရန်

Google Cloud CLI ရှိပါက project ကြည့်ခွင့်ရှိသော account နဲ့ ပြန်ဝင်ပါ။ ဤ session တွင် panna07 account က project log ဖတ်ခွင့်မရှိခဲ့ပြီး minmaung account ၏ credential သက်တမ်းကုန်နေသည်။

```sh
gcloud auth login minmaung0307@gmail.com
npm run diagnose:cloud
```

ဤ account တွင် project ခွင့်မရှိပါက project owner ခွင့်ရှိသော account ကို သုံးပါ။ Diagnostic script သည် read-only ဖြစ်ပြီး function status နှင့် ပေးထားသော build နှစ်ခု၏ log ကို ဖတ်သည်။ Cloud Console မှ တိုက်ရိုက်လည်း ဖတ်နိုင်သည်:

- https://console.cloud.google.com/cloud-build/builds;region=us-central1/f0f4c1a1-50e9-488f-9eb1-4bc21a748244?project=91210543742
- https://console.cloud.google.com/cloud-build/builds;region=us-central1/09ad40ab-f594-4319-9e2c-d65546994f6e?project=91210543742

Terminal deploy summary မဟုတ်ဘဲ **Build logs tab ထဲက failing step ၏ ERROR စာကြောင်းများ** ကို ရယူပါ။ Build log က မည်သည့် service account၊ resource သို့ permission ပျောက်နေကြောင်း ပြသမှ သက်ဆိုင်ရာခွင့်ကို တိတိကျကျ ပြင်သင့်သည်။ Source bucket ကို အလွယ်တကူ ဖျက်ပြီး အသစ်ပြန်မဖန်တီးပါနှင့်။

Cloud troubleshoot documentation: https://docs.cloud.google.com/functions/docs/troubleshooting

ဤ version ၏ local tests အောင်မြင်ခြင်းက live deployment ပြီးစီးခြင်း မဟုတ်ပါ။ ဒီ session တွင် live deployment/IAM မပြောင်းထားပါ။
