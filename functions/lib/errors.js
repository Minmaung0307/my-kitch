import {HttpsError} from 'firebase-functions/v2/https';
import {randomUUID} from 'node:crypto';
// Preserve expected errors; classify infrastructure failures without exposing tokens/data.
export function guarded(operation,handler){return async request=>{try{return await handler(request)}catch(error){
 if(error instanceof HttpsError)throw error;
 const reference=randomUUID();console.error('KITCHEN_BACKEND_ERROR',{operation,reference,code:error.code,message:error.message});
 const details={operation,reference};
 if([7,'PERMISSION_DENIED','permission-denied',403].includes(error.code))throw new HttpsError('failed-precondition','Server service account တွင် database/storage အသုံးပြုခွင့် မလုံလောက်ပါ။ Cloud project owner မှ runtime IAM နှင့် function log ကို စစ်ပေးရန် လိုပါသည်။',{...details,reason:'backend-permission'});
 if([5,'NOT_FOUND',404].includes(error.code))throw new HttpsError('failed-precondition','Server လိုအပ်သည့် database သို့မဟုတ် resource ကို မတွေ့ပါ။ Firestore (default) database နှင့် Storage setup ကို စစ်ပေးပါ။',{...details,reason:'backend-resource-missing'});
 throw new HttpsError('internal','Server တွင် အမှားဖြစ်ပါသည်။ အောက်ပါ reference ဖြင့် function log ကို စစ်ပေးပါ။',details);
}}}
