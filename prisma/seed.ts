import {PrismaClient} from "@prisma/client";
const db=new PrismaClient();
async function main(){
 const adminUpdate=await db.user.updateMany({where:{email:process.env.ADMIN_EMAIL||"admin@example.com"},data:{role:"ADMIN"}});
 const p=await db.provider.upsert({where:{id:"elevenlabs"},update:{enabled:true,costPerMinute:Number(process.env.ELEVENLABS_COST_PER_MINUTE||.15)},create:{id:"elevenlabs",name:"Eleven Music",enabled:true,costPerMinute:Number(process.env.ELEVENLABS_COST_PER_MINUTE||.15),qualityScore:.95,successRate:.99,latencyScore:.9}});
 await db.model.upsert({where:{id:"elevenlabs-music-v2"},update:{enabled:true},create:{id:"elevenlabs-music-v2",name:"music_v2",providerId:p.id,quality:.96,speed:.9}});
 await db.promoCode.upsert({where:{code:"WELCOME200"},update:{},create:{code:"WELCOME200",credits:200,active:true}});
}
main().finally(()=>db.$disconnect());
