import {cookies} from "next/headers";import {db} from "./db";
export async function currentUser(){const c=await cookies();const id=c.get("musichub_user")?.value;return id?db.user.findUnique({where:{id}}):null;}
export function sessionCookie(id:string){return {name:"musichub_user",value:id,httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/",maxAge:2592000};}
