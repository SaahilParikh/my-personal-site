#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SiteStack } from '../lib/site-stack';
import { GithubOidcStack } from '../lib/github-oidc-stack';

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT ?? process.env.AWS_ACCOUNT_ID;
const region = process.env.CDK_DEFAULT_REGION ?? 'us-east-1';

if (!account) {
  throw new Error(
    'AWS account not resolved. Set CDK_DEFAULT_ACCOUNT or AWS_ACCOUNT_ID before running cdk commands.',
  );
}

const env: cdk.Environment = { account, region };

const domainName = app.node.tryGetContext('domainName') as string;
const githubOwner = app.node.tryGetContext('githubOwner') as string;
const githubRepo = app.node.tryGetContext('githubRepo') as string;

if (!domainName || !githubOwner || !githubRepo) {
  throw new Error(
    'Missing context. Expected domainName, githubOwner, githubRepo in cdk.json.',
  );
}

const siteStack = new SiteStack(app, 'SaahilSiteStack', {
  env,
  domainName,
  description: `Static site for ${domainName} (S3 + CloudFront + Route53).`,
});

new GithubOidcStack(app, 'SaahilGithubOidcStack', {
  env,
  githubOwner,
  githubRepo,
  siteBucketArn: siteStack.bucketArn,
  distributionId: siteStack.distributionId,
  description: `GitHub Actions OIDC role for ${githubOwner}/${githubRepo}.`,
});

app.synth();
