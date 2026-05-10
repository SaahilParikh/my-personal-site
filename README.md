# my-personal-site

Hey, it's me — [saahil.io](https://saahil.io).

A small personal site. Static Next.js 15 build, hosted on AWS (S3 + CloudFront + Route53), provisioned with CDK, deployed by GitHub Actions via OIDC.

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

## First-time AWS setup

You only do this once.

1. **Pre-reqs**: AWS CLI configured (`aws sts get-caller-identity` works), Node 20+, the Route53 hosted zone for `saahil.io` already exists in the target account.

2. **Bootstrap CDK** in the target account/region (one-time per account+region):

   ```bash
   cd infra
   npm install
   export AWS_ACCOUNT_ID=123456789012        # your 12-digit account
   export AWS_REGION=us-east-1
   npx cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION
   ```

3. **Deploy infra**:

   ```bash
   # First the site stack (S3, CloudFront, ACM, Route53):
   npm run deploy -- SaahilSiteStack

   # Then the OIDC stack (depends on the site stack outputs):
   npm run deploy -- SaahilGithubOidcStack
   ```

   ACM cert validation can take a few minutes the first time — that's normal.

4. **Capture the stack outputs.** You'll need three values from the deploy logs (or `aws cloudformation describe-stacks`):

   | Output | From stack | GitHub variable name |
   |---|---|---|
   | `BucketName` | `SaahilSiteStack` | `SITE_BUCKET_NAME` |
   | `DistributionId` | `SaahilSiteStack` | `CLOUDFRONT_DISTRIBUTION_ID` |
   | `DeployRoleArn` | `SaahilGithubOidcStack` | `AWS_DEPLOY_ROLE_ARN` |

5. **Add GitHub repository variables** (Settings → Secrets and variables → Actions → *Variables* tab — these are not secrets):

   - `SITE_BUCKET_NAME`
   - `CLOUDFRONT_DISTRIBUTION_ID`
   - `AWS_DEPLOY_ROLE_ARN`

That's it. `git push` to `main` deploys.

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

Personal-site traffic on this stack runs ~$0.50–$1.50/month: ~$0.50 Route53 hosted zone, pennies of S3 + CloudFront request/transfer. ACM cert is free.

## Operational notes

- `infra/cdk.context.json` is committed on purpose. CDK caches lookups (e.g. `HostedZone.fromLookup`) into it so `cdk synth` is deterministic across machines and works in CI without making live AWS calls. Don't gitignore it.
- The S3 bucket has `removalPolicy: RETAIN`. `cdk destroy` will not delete site contents — flip to `DESTROY` + `autoDeleteObjects` if you really want a clean teardown.
- The OIDC trust policy currently accepts any ref from `SaahilParikh/my-personal-site`. To harden, change `repo:OWNER/REPO:*` → `repo:OWNER/REPO:ref:refs/heads/main` in `infra/lib/github-oidc-stack.ts`.
- CloudFront uses `PRICE_CLASS_100` (US/EU edges only) for cost. Bump if you want global edges.
