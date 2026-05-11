# Saahil.io

Hey, it's me. This is my personal site. — [saahil.io](https://saahil.io).

Built with Static Next.js 15, hosted on AWS (S3 + CloudFront + Route53), provisioned with CDK, deployed by GitHub Actions via OIDC. 

## Layout

```
web/      Next.js 15 app (App Router, static export)
infra/    AWS CDK v2 (TypeScript) — SiteStack + GithubOidcStack
.github/  GitHub Actions deploy pipeline
```

`web/` and `infra/` are independent npm projects. No workspace setup; each has its own `package.json` and `node_modules`.

## Local development

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm run build        # writes static site to web/out/
```

`npm run typecheck` for a no-emit TS check.

## Continuous deployment

`.github/workflows/deploy.yml` triggers on push to `main` when `web/**` or the workflow itself changes.

Pipeline:

1. `npm ci` + typecheck + `next build` (static export to `web/out/`)
2. Assume deploy role via OIDC (no long-lived AWS keys)
3. `aws s3 sync` with two passes:
   - Hashed Next assets (`_next/static/*`) → `Cache-Control: public, max-age=31536000, immutable`
   - Everything else → `Cache-Control: public, max-age=60, must-revalidate`
4. CloudFront invalidation on `/*`

## Updating projects

Edit [`web/data/projects.ts`](./web/data/projects.ts). Push. Done.

## Cost expectation

Personal-site traffic on this stack runs ~$0.50–$1.50/month: ~$0.50 Route53 hosted zone, pennies of S3 + CloudFront request/transfer. ACM cert is free. I was considering Linode, but all my domains are on 53, so didn't want to deal with the operational lift and shift.
