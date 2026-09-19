[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=YOUR_PUBLIC_GITHUB_REPO_URL)

# MusicHub AI v0.4

商业化升级：邮箱验证码登录框架、Credits、Stripe、优惠码、邀请返佣、R2、Provider健康/熔断、管理员利润与定价接口、Redis防刷、失败退款。

启动：
```bash
docker compose up -d
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
另开终端：
```bash
npm run worker
```

正式上线前：
1. 将 `lib/email.ts` 的开发验证码输出替换为真实邮件服务。
2. 配置 Stripe Price ID 和 webhook。
3. 配置 R2 私有 bucket。
4. 使用真实 Provider 成本同步更新数据库。
5. 增加内容安全/版权风控。
6. 第二家供应商只接官方商业 API，不抓取消费者音乐平台。


## v0.5 新增
- Stripe recurring subscriptions + Billing Portal
- 订阅生命周期 webhook
- Resend 邮箱验证码（未配置时开发环境打印验证码）
- SEO metadata endpoints: robots.txt / sitemap.xml
- 独立 Pricing 页面
- Admin Profit Center
- Promo / Referral / Credits 继续保留
- R2 private audio + presigned URL
- Provider circuit breaker + fallback
- Redis rate limiting
- Dockerfile
- `scripts/smoke.mjs` 基础冒烟检查

### Stripe
创建一次性 Price 与 recurring Price。订阅 Checkout 使用 `mode=subscription`，并通过 webhook 同步订阅状态。Stripe 官方文档也支持 Checkout + Billing Portal 这套模式。

### 正式上线必做
- 配置 HTTPS
- 配置 Resend API Key 和已验证发件域名
- 配置 Stripe live keys、webhook、Price IDs
- 配置 Cloudflare R2
- 使用真实 Provider 成本做每日利润校准
- 加入版权/内容安全审核与投诉流程
- 为数据库、Redis、R2 做备份和监控


## V0.6 Launch / Production
- Stripe webhook aligned with newer subscription billing-period structure; plan resolves from Price ID.
- Monthly subscription credits provisioned idempotently from `invoice.paid`.
- Login email/IP rate limiting and verification attempt limits.
- DB role + admin helper, admin users/providers/audit endpoints.
- Usage API and authenticated audio download endpoint.
- Referral codes instead of raw user IDs.
- Legal pages: Terms, Privacy, Copyright/complaints.
- Metadata/SEO upgraded.
- Cleanup script for expired login codes.
- 50% hard margin floor remains enforced in price calculation.

### Important
Stripe's newer API versions can move billing-period fields from the Subscription object to Subscription Items; V0.6 reads the item-level period end rather than assuming the legacy top-level field. citeturn0search21
Subscription access should be provisioned from verified webhook events, especially `invoice.paid` and subscription status changes. citeturn0search1turn0search12
Eleven Music API is available to paid subscribers and its commercial-use terms/pricing can vary by plan and use case, so keep the provider cost and license assumptions configurable rather than hard-coded. citeturn0search14turn0search18

## V0.7 Cloudflare Edition
- Cloudflare Workers deployment config
- OpenNext adapter
- Wrangler config
- R2 audio/cache bindings
- Cloudflare deployment scripts
- Cloudflare secrets guide
- Cloudflare preflight script
- Keeps PostgreSQL + Redis/BullMQ generation worker for compatibility

### Deploy
```bash
npm install
npm run cf:build
npm run cf:deploy
```
See `CLOUDFLARE_DEPLOY.md` for production setup.


## v0.8 Cloudflare Native

v0.8 uses Cloudflare Queues for generation jobs, native R2 bindings for audio storage, and Workers KV for rate limiting. See `CLOUDFLARE_V08.md`.

## v1.0 Cloudflare Native deployment

v1.0 adds Cloudflare Hyperdrive for runtime PostgreSQL access through Prisma's `@prisma/adapter-pg`. The Worker prefers `env.HYPERDRIVE.connectionString`; local Node commands continue to use `DATABASE_URL`.

See `CLOUDFLARE_V09.md` for the production checklist and `scripts/cf-bootstrap.sh` for the bootstrap helper.


## v1.0
- User Dashboard and usage history
- Durable usage analytics + optional Analytics Engine
- Subscription credit grant model for idempotent entitlement accounting
- Provider cost history and operational alerts
- Daily maintenance cron
- GitHub Actions automatic deployment
- Production observability
See `V1.0_RELEASE_NOTES.md` and `V1.0_DEPLOY.md`.
