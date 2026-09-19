import type {MusicProvider} from "../provider";
export class ElevenMusicProvider implements MusicProvider{
 id="elevenlabs";
 async generate(x:{prompt:string;durationSec:number}){
 const key=process.env.ELEVENLABS_API_KEY;if(!key)throw new Error("ELEVENLABS_API_KEY missing");
 const r=await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192",{method:"POST",headers:{"Content-Type":"application/json","xi-api-key":key},body:JSON.stringify({model_id:process.env.ELEVENLABS_MODEL||"music_v2",prompt:x.prompt,music_length_ms:x.durationSec*1000})});
 if(!r.ok)throw new Error(`Eleven Music ${r.status}: ${(await r.text()).slice(0,500)}`);
 return{audio:new Uint8Array(await r.arrayBuffer()),mimeType:"audio/mpeg",estimatedCost:x.durationSec/60*Number(process.env.ELEVENLABS_COST_PER_MINUTE||.15)};}}
