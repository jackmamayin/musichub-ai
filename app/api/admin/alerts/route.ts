import {NextResponse} from 'next/server'; import {requireAdmin} from '@/lib/admin'; import {db} from '@/lib/db';
export async function GET(){if(!(await requireAdmin())) return NextResponse.json({error:'Forbidden'},{status:403}); const alerts=await db.alert.findMany({where:{resolvedAt:null},orderBy:{createdAt:'desc'},take:100}); return NextResponse.json({alerts});}
