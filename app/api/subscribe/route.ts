import{NextResponse}from"next/server";import Stripe from"stripe";import{currentUser}from"@/lib/auth";
const prices:any={basic:process.env.STRIPE_SUB_BASIC,pro:process.env.STRIPE_SUB_PRO,business:process.env.STRIPE_SUB_BUSINESS};
export async function POST(req:Request){
 const u=await currentUser();if(!u)return NextResponse.json({error:"请登录"},{status:401});
 const {plan}=await req.json();const price=prices[plan];if(!price)return NextResponse.json({error:"订阅价格未配置"},{status:503});
 const s=new Stripe(process.env.STRIPE_SECRET_KEY!);
 const x=await s.checkout.sessions.create({mode:"subscription",line_items:[{price,quantity:1}],success_url:`${process.env.NEXT_PUBLIC_APP_URL}/?sub=1`,cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/?cancelled=1`,metadata:{userId:u.id,plan}});
 return NextResponse.json({url:x.url});
}