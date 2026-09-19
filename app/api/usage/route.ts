import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
export async function GET(){
 const u=await currentUser(); if(!u) return NextResponse.json({error:'Unauthorized'},{status:401});
 const [gens,ledger,sub]=await Promise.all([
  db.generation.findMany({where:{userId:u.id},orderBy:{createdAt:'desc'},take:50,select:{id: true,prompt:true,durationSec:true,status:true,creditsCharged:true,revenueUsd:true,createdAt:true,audioUrl:true}}),
  db.creditLedger.findMany({where:{userId:u.id},orderBy:{createdAt:'desc'},take:30}),
  db.subscription.findFirst({where:{userId:u.id},orderBy:{updatedAt:'desc'}})
 ]);
 return NextResponse.json({user:{email:u.email,plan:u.plan,credits:u.credits},subscription:sub,generations:gens,ledger});
}
