import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashCode, makeCode, sendLoginCode } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const s = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const p = s.safeParse(await req.json());
  if (!p.success) return NextResponse.json({ error: "邮箱格式错误" }, { status: 400 });

  const email = p.data.email.toLowerCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = Number(process.env.LOGIN_RATE_LIMIT_PER_MINUTE || 3);

  if (!(await rateLimit(`login:email:${email}`, limit))) {
    return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }
  if (!(await rateLimit(`login:ip:${ip}`, limit))) {
    return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  await db.emailCode.updateMany({
    where: { email, usedAt: null },
    data: { usedAt: new Date() },
  });

  const code = makeCode();
  await db.emailCode.create({
    data: {
      email,
      codeHash: hashCode(code),
      expiresAt: new Date(
        Date.now() + Number(process.env.EMAIL_CODE_TTL_SECONDS || 600) * 1000,
      ),
    },
  });
  await sendLoginCode(email, code);

  return NextResponse.json({ message: "验证码已发送" });
}
