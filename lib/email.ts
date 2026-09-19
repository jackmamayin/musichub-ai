import crypto from "crypto";
export function hashCode(c:string){return crypto.createHash("sha256").update(c).digest("hex")}
export function makeCode(){return String(Math.floor(100000+Math.random()*900000))}
export async function sendLoginCode(email:string,code:string){
 const key=process.env.RESEND_API_KEY;
 if(!key){console.log(`[DEV EMAIL] ${email}: ${code}`);return true}
 const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.EMAIL_FROM||"MusicHub AI <no-reply@example.com>",to:[email],subject:"MusicHub AI 登录验证码",html:`<p>你的登录验证码：</p><h2>${code}</h2><p>10分钟内有效。</p>`})});
 if(!r.ok)throw new Error("Email provider failed");
 return true;
}