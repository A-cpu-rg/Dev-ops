# AWS Setup Guide for DevOps Pipeline

## 📋 Prerequisites

1. AWS Account with IAM permissions
2. GitHub Repository with Secrets access
3. AWS CLI installed locally (optional but recommended)

---

## 🔑 Step 1: Create AWS IAM User

### Via AWS Console:

1. Go to **AWS Console → IAM → Users → Create User**
2. User name: `devops-github-actions`
3. Click "Next"
4. Select "Attach policies directly"
5. Add these policies:
   - `AmazonEC2FullAccess`
   - `AmazonECS_FullAccess`
   - `AmazonECRFullAccess`
   - `AmazonS3FullAccess`
   - `CloudWatchLogsFullAccess`
   - `IAMFullAccess`
   - `VPCFullAccess`
6. Click "Create user"

### Create Access Key:

1. In the IAM user details, go to **Security credentials → Access keys**
2. Click "Create access key"
3. Select "Application running outside AWS"
4. Copy these values:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

## �� Step 2: Add GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these 4 secrets:

| Secret Name | Value |
|------------|-------|
| `AWS_ACCESS_KEY_ID` | Your IAM Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | Your IAM Secret Access Key |
| `AWS_SESSION_TOKEN` | Leave empty (unless using temporary credentials) |
| `AWS_REGION` | `ap-south-1` (or your preferred region) |

---

## 📦 Step 3: Initialize Terraform State (First Time Only)

Before running the pipeline, you need to create an S3 bucket for Terraform state:

```bash
# 1. Create S3 bucket for Terraform state
aws s3 mb s3://devops-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --region ap-south-1

# 2. Enable versioning on the bucket
aws s3api put-bucket-versioning \
  --bucket devops-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --versioning-configuration Status=Enabled \
  --region ap-south-1

# 3. Enable encryption
aws s3api put-bucket-encryption \
  --bucket devops-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }' \
  --region ap-south-1

# 4. Block public access
aws s3api put-public-access-block \
  --bucket devops-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --region ap-south-1
```

---

## 🚀 Step 4: Verify AWS Credentials

```bash
# Test your credentials
aws sts get-caller-identity

# Output should show:
# {
#     "UserId": "...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/devops-github-actions"
# }
```

---

## 🔄 Step 5: Run the Pipeline

Once everything is set up:

1. Commit and push to `main` branch
2. GitHub Actions will automatically trigger
3. Check **Actions tab** to see the 4-phase pipeline:
   - Phase 1: Testing (Unit, Integration, E2E)
   - Phase 2: Terraform (Infrastructure provisioning)
   - Phase 3: Docker Build & Push to ECR
   - Phase 4: Deploy to ECS Fargate

---

## 📊 Monitoring the Pipeline

### View logs in GitHub Actions:
```
GitHub Repo → Actions → Latest Workflow Run
```

### View AWS resources created:
```bash
# List ECR repositories
aws ecr describe-repositories --region ap-south-1

# List ECS clusters
aws ecs list-clusters --region ap-south-1

# List ALB endpoints
aws elbv2 describe-load-balancers --region ap-south-1

# View CloudWatch logs
aws logs tail /ecs/devops-app --follow --region ap-south-1
```

### Access your deployed application:
```bash
# Get ALB DNS name
aws elbv2 describe-load-balancers \
  --region ap-south-1 \
  --query 'LoadBalancers[?LoadBalancerName==`devops-alb`].DNSName' \
  --output text

# Test the endpoint
curl http://YOUR_ALB_DNS_NAME/health
```

---

## 🛑 Troubleshooting

### "Access Denied" Error:
- Verify AWS credentials are correct in GitHub Secrets
- Check IAM user has required permissions
- Ensure `AWS_REGION` is set correctly

### "Terraform Apply Failed":
- Check CloudWatch logs: `aws logs tail /ecs/devops-app`
- Verify S3 bucket exists for Terraform state
- Check AWS API rate limits

### "ECR Push Failed":
- Verify ECR repository was created by Terraform
- Check Docker credentials: `aws ecr get-login-password`

### "ECS Service Unhealthy":
- Check container logs: `aws logs tail /ecs/devops-app`
- Verify `/health` endpoint returns 200
- Check Security Group allows port 5001

---

## 🧹 Cleanup (When Done)

To avoid AWS charges, destroy all resources:

```bash
# Delete ECS service
aws ecs update-service \
  --cluster devops-cluster \
  --service devops-service \
  --desired-count 0 \
  --region ap-south-1

# Destroy Terraform resources
cd terraform
terraform destroy -auto-approve

# Delete S3 buckets
aws s3 rm s3://devops-terraform-state-$(aws sts get-caller-identity --query Account --output text) --recursive
aws s3 rm s3://devops-app-bucket-$(aws sts get-caller-identity --query Account --output text) --recursive
```

---

## 📝 Notes

- All resources are tagged with `Name=devops-*` for easy identification
- Terraform state is encrypted and versioned in S3
- S3 buckets have public access blocked
- ALB has health check configured for `/health` endpoint
- ECS tasks use 2 replicas for high availability
