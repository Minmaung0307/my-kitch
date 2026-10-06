# Version 2.4 — ချက်နည်းအုပ်စုနှင့် ဒေသ / စတိုင်

ချက်နည်းတင်ခြင်း သို့မဟုတ် ပြင်ခြင်း form တွင်:
- ချက်နည်းအမည်: ရခိုင်မုန့်တီ
- ချက်နည်းအုပ်စု: မုန့်တီ
- ဒေသ / စတိုင်: ရခိုင်
- Tags: အရည်၊ ငါး စသဖြင့် သက်ဆိုင်ရာအချက်များကို comma ဖြင့် ခွဲပါ။

မန္တလေးမုန့်တီအတွက်လည်း အုပ်စုကို မုန့်တီဟု တူညီစွာရွေးပါ။ နာမည်ကွဲသော မျိုးကွဲများကို သီးခြား recipe အဖြစ် ထည့်နိုင်သည်။ နာမည်အတိအကျတူခြင်းကိုတော့ ယခင်အတိုင်း ပိတ်ထားသည်။

အတည်ပြုပြီးသော အုပ်စုများကို form မှ အကြံပြုရွေးချယ်နိုင်သည်။ အုပ်စုအသစ်ကို user က အကြံပြုနိုင်ပြီး recipe ကို admin အတည်ပြုမှ filter စာရင်းတွင် ပေါ်မည်။ Admin သည် proposal အတွင်း recipeGroup နှင့် region ကို စစ်ဆေးပါ။ မှားနေပါက အကြောင်းပြချက်နှင့် ပယ်ချပြီး ပြန်တင်ရန် တောင်းနိုင်သည်။

ပင်မစာမျက်နှာတွင် အုပ်စုနှင့် ဒေသ filter နှစ်ခုကို တွဲသုံးနိုင်သည်။ Card သို့မဟုတ် အသေးစိတ်စာမျက်နှာမှ အုပ်စု/ဒေသ badge ကို နှိပ်လည်း တူညီသောချက်နည်းများကို ကြည့်နိုင်သည်။ မူလချက်နည်းများကို အလိုအလျောက် အုပ်စုသတ်မှတ်မထားပါ။ လိုအပ်သောချက်နည်းကို ပြင်ဆင်တင်ပြီး အတည်ပြုပေးပါ။

အောက်တွင် v2.3 အသုံးပြုနည်းနှင့် deployment မှတ်တမ်းပါရှိသည်။

# Version 2.3 — User တင်၊ Admin စစ်၊ အတည်ပြုထုတ်ဝေ

## ပြင်ထားသော အမှား

မူလချက်နည်းကို browser တွင် ပြထားသော်လည်း Firestore ထဲ မရှိသေးချိန် edit request ပို့လျှင် recipe-not-found ဖြစ်နိုင်သည်။ အရင် error စာသားက ထိုအခြေအနေကို function မရှိသေးခြင်းဟု ရောထွေးပြခဲ့သည်။ ယခု server က လိုအပ်သော မူလချက်နည်းကို trusted seed မှ ချိတ်ဆက်သိမ်းပေးပြီး **user ပြင်ထားသည့်အချက်များကို pending request အဖြစ်သာ** သိမ်းသည်။ Admin အတည်ပြုမှ အများမြင်နိုင်သည့် recipe ပြောင်းမည်။ ရှိပြီးသား recipe ကို မူလစာသားဖြင့် ပြန်မဖုံးပါ။

## User လုပ်ရန်

1. Google login ဝင်ပါ။
2. Header / ဖုန်းအောက်ဘားက Share ကို နှိပ်ပြီး Recipe အသစ် ဖြည့်ပါ။
3. `Send for review` နှိပ်ပါ။ အောင်မြင်သော confirmation ပေါ်မှ ပို့ပြီးဖြစ်သည်။
4. `တင်ထားသောစာရင်း ကြည့်ရန်` သို့မဟုတ် Profile → My contributions မှ pending/approved/rejected ကြည့်ပါ။
5. ရှိပြီးသား recipe ကို ပြင်လိုလျှင် Suggest an edit → ပြင်ဆင်ချက်နှင့် အကြောင်းပြချက်ဖြည့် → Send edit request ကို သုံးပါ။

## Admin လုပ်ရန်

Footer → Admin မှ:

- **Recipe အသစ်တင်ရန်** — admin ကိုယ်တိုင်လည်း တင်နိုင်သည်။
- **အသစ်တင်ထားသည်** — user အသစ်တင်ထားသော pending recipes။
- **ပြင်ဆင်ချက်** — pending edit requests။
- **အတည်ပြုပြီး / ပယ်ချပြီး** — ဆုံးဖြတ်ပြီးမှတ်တမ်းများ။
- **ရှိပြီးသား Recipe များ ပြင်ရန်** — recipe ရွေး၍ ပြင်ဆင်ချက်တင်ပါ။
- **မူလချက်နည်းများ ချိတ်ဆက်ရန်** — trusted starter catalog အားလုံးကို Firestore တွင် ထည့်ပါ။ ရှိပြီးသားအချက်အလက်ကို မဖုံးပါ။
- **Category များ စီမံရန်** — category အသစ်ထည့်ပါ။

Request တစ်ခုကို ရွေးဖွင့်ပြီး proposal ကို စစ်ပါ။ `Approve & publish` မှ အတည်ပြုထုတ်ဝေပါ။ `Reject` မှ အကြောင်းပြချက်နှင့် ပယ်ချနိုင်သည်။ Admin Gmail နှစ်ခုသာ ဆုံးဖြတ်ခွင့်ရှိပြီး user က တိုက်ရိုက် publish လုပ်၍ မရပါ။

## အသစ် deploy လုပ်ရန်

```sh
npm ci
npm ci --prefix functions
cp functions/.env.example functions/.env.my-kitch
firebase login --reauth
npm run deploy:repair
```

ဒီ script မှာ `initializeCatalog` function အသစ်ပါ ထည့်ထားသည်။ ပြီးလျှင် page refresh / Google login ပြန်ဝင်ပါ။


## Live deployment — 6 October 2026

https://my-kitch.web.app တွင် v2.3 ကို တင်ပြီးပါပြီ။ Function ငါးခု၊ Firestore/Storage rules နှင့် hosting အောင်မြင်သည်။ reviewRequest / uploadRecipePhoto တွင် ပျောက်နေသော Cloud Run invoker permission ကို ပြင်ပြီးပါပြီ။ Google login မရှိသော request သည် function ငါးခုလုံးတွင် 401 UNAUTHENTICATED ဖြင့် ပယ်ချသည်။ Approval ခွင့်ကို admin Gmail နှစ်ခုအတွက်သာ ထိန်းထားသည်။

မူလချက်နည်း ၂၄ ခုနှင့် exact-name registry ကို live database တွင် ချိတ်ထားသည်။ ရှိပြီးသား recipe ကို ဖုံးရေးခြင်းမရှိပါ။ Browser ကို Cmd+Shift+R ဖြင့် refresh လုပ်ပြီး Google login ဝင်ပါ။

Local emulator တွင် user တင် → pending → admin approve/reject → publish၊ ပုံတင်ခြင်း၊ category၊ duplicate နှင့် access rules စမ်းသပ်မှုများ အောင်မြင်သည်။ Live endpoint/login gate နှင့် mobile page load ကို စစ်ထားသည်။ အသုံးပြုသူ၏ တကယ့် Google session ဖြင့် live submission/approval ကို အစားထိုးလုပ်ဆောင်ထားခြင်း မရှိပါ။

နောက်ပိုင်း callable တစ်ခု 403 HTML ပြန်လျှင် Cloud Run service ၏ roles/run.invoker ကို စစ်ပါ။ Firebase callable authentication နှင့် Cloud Run transport authentication သည် သီးခြားဖြစ်သည်။ Reference: https://firebase.google.com/docs/functions/callable
