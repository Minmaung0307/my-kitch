import {spawnSync} from 'node:child_process';
// Read-only, fixed project. No tokens or credentials printed.
const checks=[['Functions',['functions','list','--v2','--regions=us-central1','--project=my-kitch','--format=table(name,state)']],['Build 1',['builds','log','f0f4c1a1-50e9-488f-9eb1-4bc21a748244','--region=us-central1','--project=my-kitch']],['Build 2',['builds','log','09ad40ab-f594-4319-9e2c-d65546994f6e','--region=us-central1','--project=my-kitch']]];
for(const [label,args] of checks){console.log(`\n>>> ${label}`);const result=spawnSync('gcloud',args,{stdio:'inherit',shell:process.platform==='win32'});if(result.error){console.error('Google Cloud CLI (gcloud) လိုအပ်ပါသည်။ Cloud Console မှ log ကိုလည်း ကြည့်နိုင်ပါသည်။');break}}
