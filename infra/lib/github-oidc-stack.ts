import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

const GITHUB_OIDC_ISSUER_URL = 'https://token.actions.githubusercontent.com';
const GITHUB_OIDC_AUDIENCE = 'sts.amazonaws.com';
const MAX_DEPLOY_SESSION_DURATION = cdk.Duration.hours(1);

export interface GithubOidcStackProps extends cdk.StackProps {
  readonly githubOwner: string;
  readonly githubRepo: string;
  readonly siteBucketArn: string;
  readonly distributionId: string;
}

export class GithubOidcStack extends cdk.Stack {
  public readonly deployRoleArn: string;

  constructor(scope: Construct, id: string, props: GithubOidcStackProps) {
    super(scope, id, props);

    const provider = this.createOidcProvider();
    const trustPrincipal = this.buildTrustPrincipal(
      provider,
      props.githubOwner,
      props.githubRepo,
    );
    const deployRole = this.createDeployRole(trustPrincipal, props);

    this.attachSiteBucketPermissions(deployRole, props.siteBucketArn);
    this.attachCloudFrontInvalidationPermission(
      deployRole,
      props.distributionId,
    );

    this.deployRoleArn = deployRole.roleArn;
    this.publishOutputs(deployRole);
  }

  private createOidcProvider(): iam.OpenIdConnectProvider {
    return new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
      url: GITHUB_OIDC_ISSUER_URL,
      clientIds: [GITHUB_OIDC_AUDIENCE],
    });
  }

  // Trust scope: any ref in the configured repo. Tighten the StringLike sub
  // pattern to e.g. `repo:owner/repo:ref:refs/heads/main` to restrict deploys
  // to a single branch once the workflow is stable.
  private buildTrustPrincipal(
    provider: iam.IOpenIdConnectProvider,
    githubOwner: string,
    githubRepo: string,
  ): iam.IPrincipal {
    const repoSubjectPattern = `repo:${githubOwner}/${githubRepo}:*`;
    return new iam.OpenIdConnectPrincipal(provider).withConditions({
      StringEquals: {
        'token.actions.githubusercontent.com:aud': GITHUB_OIDC_AUDIENCE,
      },
      StringLike: {
        'token.actions.githubusercontent.com:sub': repoSubjectPattern,
      },
    });
  }

  private createDeployRole(
    principal: iam.IPrincipal,
    props: GithubOidcStackProps,
  ): iam.Role {
    return new iam.Role(this, 'GithubDeployRole', {
      roleName: `${props.githubRepo}-github-deploy`,
      assumedBy: principal,
      description: `GitHub Actions deploy role for ${props.githubOwner}/${props.githubRepo}.`,
      maxSessionDuration: MAX_DEPLOY_SESSION_DURATION,
    });
  }

  private attachSiteBucketPermissions(
    role: iam.Role,
    bucketArn: string,
  ): void {
    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'SiteBucketReadWrite',
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket', 's3:GetBucketLocation'],
        resources: [bucketArn],
      }),
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'SiteBucketObjects',
        effect: iam.Effect.ALLOW,
        actions: [
          's3:PutObject',
          's3:PutObjectAcl',
          's3:GetObject',
          's3:DeleteObject',
        ],
        resources: [`${bucketArn}/*`],
      }),
    );
  }

  private attachCloudFrontInvalidationPermission(
    role: iam.Role,
    distributionId: string,
  ): void {
    const distributionArn = `arn:aws:cloudfront::${this.account}:distribution/${distributionId}`;

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudFrontInvalidate',
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudfront:CreateInvalidation',
          'cloudfront:GetInvalidation',
          'cloudfront:ListInvalidations',
        ],
        resources: [distributionArn],
      }),
    );
  }

  private publishOutputs(deployRole: iam.Role): void {
    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: deployRole.roleArn,
      description:
        'IAM role ARN for GitHub Actions to assume via OIDC. Set as AWS_DEPLOY_ROLE_ARN repo variable.',
      exportName: 'SaahilSite-DeployRoleArn',
    });
  }
}
