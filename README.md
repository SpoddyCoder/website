# SpoddyCoder Website

[![Deploy](https://github.com/SpoddyCoder/website/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/SpoddyCoder/website/actions/workflows/deploy.yml)

This was converted to a completely static site from a WordPress site.
It's markup is therefore a bit shite. But it works. And is fast. And never requires upgrading. And is cheap to host. And is un-hackable.

So not as shite as it was.

https://spoddycoder.com/

## Deployment

Pushes and merges to `main` deploy automatically via the [Deploy workflow](https://github.com/SpoddyCoder/website/actions/workflows/deploy.yml). The workflow syncs the repo root to S3 and invalidates the CloudFront cache.

For manual deploys (requires AWS credentials with the same permissions):

```bash
export AWS_REGION=eu-west-2
export AWS_S3_BUCKET_NAME=bucket-name
export AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC

aws s3 sync . "s3://${AWS_S3_BUCKET_NAME}" \
  --exclude ".cursor/*" \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude ".gitignore" \
  --exclude "README.md" \
  --delete

aws cloudfront create-invalidation \
  --distribution-id "${AWS_CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*"
```
