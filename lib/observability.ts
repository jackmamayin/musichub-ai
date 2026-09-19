import { db } from './db';

export async function trackEvent(event:string, userId?:string, value=1, metadata?:Record<string,unknown>) {
  try {
    await db.usageEvent.create({data:{event,userId,value,metadata:metadata as any}});
  } catch {}
  try {
    const ctx = await import('@opennextjs/cloudflare').then(m=>m.getCloudflareContext());
    const analytics = (ctx.env as any).MUSICHUB_ANALYTICS;
    analytics?.writeDataPoint?.({blobs:[event,userId||'anonymous'],doubles:[value],indexes:[event]});
  } catch {}
}
