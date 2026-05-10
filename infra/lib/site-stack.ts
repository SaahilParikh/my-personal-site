import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

const WWW_SUBDOMAIN_PREFIX = 'www.';
const ERROR_RESPONSE_TTL = cdk.Duration.minutes(5);
const NOT_FOUND_PAGE_PATH = '/404.html';
const SITE_BUCKET_SUFFIX = '-site';

export interface SiteStackProps extends cdk.StackProps {
  readonly domainName: string;
}

export class SiteStack extends cdk.Stack {
  public readonly bucketArn: string;
  public readonly distributionId: string;

  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    const { domainName } = props;
    const wwwDomain = `${WWW_SUBDOMAIN_PREFIX}${domainName}`;
    const siteDomains = [domainName, wwwDomain];

    const hostedZone = this.lookupHostedZone(domainName);
    const siteBucket = this.createSiteBucket(domainName);
    const certificate = this.issueCertificate(siteDomains, hostedZone);
    const distribution = this.createDistribution({
      siteBucket,
      certificate,
      siteDomains,
      siteName: domainName,
    });

    this.createAliasRecords(hostedZone, distribution, domainName, 'Apex');
    this.createAliasRecords(hostedZone, distribution, wwwDomain, 'Www');
    this.publishOutputs({ siteBucket, distribution, domainName });

    this.bucketArn = siteBucket.bucketArn;
    this.distributionId = distribution.distributionId;
  }

  private lookupHostedZone(domainName: string): route53.IHostedZone {
    return route53.HostedZone.fromLookup(this, 'HostedZone', { domainName });
  }

  private createSiteBucket(domainName: string): s3.Bucket {
    return new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${domainName}${SITE_BUCKET_SUFFIX}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }

  // ACM cert must be in us-east-1 for CloudFront. The stack itself is in
  // us-east-1, so a regional Certificate works without a cross-region stack.
  private issueCertificate(
    siteDomains: string[],
    hostedZone: route53.IHostedZone,
  ): acm.ICertificate {
    const [primaryDomain, ...alternateDomains] = siteDomains;
    return new acm.Certificate(this, 'SiteCertificate', {
      domainName: primaryDomain,
      subjectAlternativeNames: alternateDomains,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
  }

  private createDistribution(params: {
    siteBucket: s3.Bucket;
    certificate: acm.ICertificate;
    siteDomains: string[];
    siteName: string;
  }): cloudfront.Distribution {
    const { siteBucket, certificate, siteDomains, siteName } = params;

    return new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      domainNames: siteDomains,
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      },
      errorResponses: [
        this.notFoundErrorResponse(403),
        this.notFoundErrorResponse(404),
      ],
      comment: `${siteName} static site`,
    });
  }

  private notFoundErrorResponse(
    httpStatus: 403 | 404,
  ): cloudfront.ErrorResponse {
    return {
      httpStatus,
      responseHttpStatus: 404,
      responsePagePath: NOT_FOUND_PAGE_PATH,
      ttl: ERROR_RESPONSE_TTL,
    };
  }

  private createAliasRecords(
    zone: route53.IHostedZone,
    distribution: cloudfront.IDistribution,
    recordName: string,
    idSuffix: string,
  ): void {
    const aliasTarget = route53.RecordTarget.fromAlias(
      new targets.CloudFrontTarget(distribution),
    );

    new route53.ARecord(this, `Alias${idSuffix}A`, {
      zone,
      recordName,
      target: aliasTarget,
    });

    new route53.AaaaRecord(this, `Alias${idSuffix}Aaaa`, {
      zone,
      recordName,
      target: aliasTarget,
    });
  }

  private publishOutputs(params: {
    siteBucket: s3.Bucket;
    distribution: cloudfront.Distribution;
    domainName: string;
  }): void {
    const { siteBucket, distribution, domainName } = params;

    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
      description: 'S3 bucket holding the built site assets.',
      exportName: 'SaahilSite-BucketName',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID (used for cache invalidation).',
      exportName: 'SaahilSite-DistributionId',
    });

    new cdk.CfnOutput(this, 'DistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain (cf.* fallback URL).',
    });

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `https://${domainName}`,
      description: 'Primary site URL.',
    });
  }
}
