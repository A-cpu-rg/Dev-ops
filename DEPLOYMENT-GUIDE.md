# Complete DevOps Deployment Guide

## 🎯 Project Overview

This is a **Complete DevOps Pipeline** with 4 automated phases:

```
Code Push
    ↓
Phase 1: Testing (Unit, Integration, E2E)
    ↓
Phase 2: Terraform (Infrastructure Provisioning)
    ↓
Phase 3: Docker Build & Push to ECR
    ↓
Phase 4: Deploy to ECS Fargate
    ↓
Live Application ✅
```

---

## 📋 What's Included

### **Phase 1 - Testing** ✅
- Jest unit tests for backend
- Integration tests (multi-version Node: 18, 20, 22)
- Playwright E2E tests
- ESLint & Prettier linting

### **Phase 2 - Terraform Infrastructure** 
- S3 bucket with versioning & encryption
- VPC with public subnets in 2 AZs
- Security groups with proper ingress/egress
- ECR repository for Docker images
- ECS cluster with container insights
- CloudWatch log group
- IAM roles for ECS tasks
- Application Load Balancer (ALB)
- Target group with health checks

### **Phase 3 - Docker Build**
- Multi-stage build (builder + production)
- Non-root user (nodejs:1001)
- Alpine Linux for lightweight image (~150MB)
- Healthcheck configured
- Layer caching optimization

### **Phase 4 - ECS Deployment**
- Fargate launch type (serverless containers)
- 2 replicas for high availability
- Auto-scaling ready
- Load balancer integration
- CloudWatch logging
- Health checks enabled

---

## 🔧 Quick Start

### Step 1: Configure AWS Credentials

```bash
# Go to GitHub Repo → Settings → Secrets and variables → Actions
# Add these 4 secrets:

AWS_ACCESS_KEY_ID = your_access_key
AWS_SECRET_ACCESS_KEY = your_secret_key
AWS_SESSION_TOKEN = (leave blank if not using temporary credentials)
AWS_REGION = ap-south-1
```

See **AWS-SETUP.md** for detailed instructions on creating IAM user and access keys.

### Step 2: Initialize Terraform State

```bash
# Run these AWS CLI commands once
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create S3 bucket for Terraform state
aws s3 mb s3://devops-terraform-state-${ACCOUNT_ID} --region ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket devops-terraform-state-${ACCOUNT_ID} \
  --versioning-configuration Status=Enabled \
  --region ap-south-1

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket devops-terraform-state-${ACCOUNT_ID} \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }' \
  --region ap-south-1

# Block public access
aws s3api put-public-access-block \
  --bucket devops-terraform-state-${ACCOUNT_ID} \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --region ap-south-1
```

### Step 3: Push to Main Branch

```bash
git add .
git commit -m "deploy: activate complete DevOps pipeline"
git push origin main
```

### Step 4: Monitor Pipeline Execution

1. Go to **GitHub Repo → Actions tab**
2. Click on latest workflow run: **"Complete DevOps Pipeline"**
3. Watch all 4 phases execute:
   - ✅ Phase 1 - Testing (5-10 min)
   - ✅ Phase 2 - Terraform (5-10 min)
   - ✅ Phase 3 - Build Docker (3-5 min)
   - ✅ Phase 4 - Deploy ECS (5-10 min)

---

## 📊 Verify Deployment

### Check Infrastructure in AWS Console:

```bash
# List ECR repositories
aws ecr describe-repositories --region ap-south-1

# List ECS clusters
aws ecs list-clusters --region ap-south-1

# List ALB endpoints
aws elbv2 describe-load-balancers --region ap-south-1

# View ECS services
aws ecs list-services --cluster devops-cluster --region ap-south-1

# Check ECS tasks running
aws ecs list-tasks --cluster devops-cluster --region ap-south-1

# View CloudWatch logs
aws logs tail /ecs/devops-app --follow --region ap-south-1
```

### Test Application Endpoint:

```bash
# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --region ap-south-1 \
  --query 'LoadBalancers[?LoadBalancerName==`devops-alb`].DNSName' \
  --output text)

echo "Application URL: http://$ALB_DNS"

# Test health endpoint
curl http://$ALB_DNS/health

# Test API endpoint
curl http://$ALB_DNS/api/health
```

---

## 🐳 Docker Image Details

### Image Specifications:
- **Base**: node:18-alpine (lightweight)
- **Size**: ~200MB (optimized with multi-stage build)
- **User**: nodejs (UID 1001, non-root)
- **Port**: 5001
- **Healthcheck**: GET /health every 30s

### Build Process:
1. Stage 1 - Build: Install all dependencies
2. Stage 2 - Production: Copy only essentials from builder
3. Security: Create non-root user, set proper permissions
4. Runtime: Start Node.js server on port 5001

---

## ☸️ Kubernetes Alternative (Bonus)

If you prefer Kubernetes/EKS instead of ECS:

```bash
# Prerequisites:
# 1. EKS cluster running
# 2. kubectl configured
# 3. ECR image pushed (Phase 3)

# Apply Kubernetes manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Verify deployment
kubectl get deployments -n devops-app
kubectl get services -n devops-app
kubectl get pods -n devops-app

# Port forward for testing
kubectl port-forward -n devops-app svc/devops-app-service 8080:80

# Access at http://localhost:8080/health
```

### Kubernetes Features:
- 2 replicas for high availability
- Resource limits: 500m CPU, 512Mi memory
- Liveness probe: checks every 20s
- Readiness probe: checks every 10s
- Non-default namespace: devops-app
- Security context: non-root user

---

## �� Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Src Code │  │ Tests    │  │Terraform │  │Dockerfile│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  GitHub Actions Trigger
                            ↓
        ┌───────────────────────────────────────┐
        │    Phase 1: Testing & Validation      │
        │  ✓ ESLint, Jest, Integration, E2E   │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │ Phase 2: Terraform Infrastructure    │
        │  ✓ VPC, ECR, ECS, ALB, S3, IAM      │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │  Phase 3: Docker Build & Push ECR    │
        │  ✓ Multi-stage build, Push to ECR   │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │   Phase 4: Deploy to ECS Fargate      │
        │  ✓ Update task definition, Deploy   │
        └───────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     AWS Infrastructure                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Application Load Balancer (ALB)                    │   │
│  │  DNS: devops-alb-1234567890.ap-south-1.elb...     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────┐      │
│  │  ECS Cluster (Fargate)                           │      │
│  │  ┌──────────────┐  ┌──────────────┐             │      │
│  │  │ Task 1       │  │ Task 2       │             │      │
│  │  │ Port 5001    │  │ Port 5001    │             │      │
│  │  └──────────────┘  └──────────────┘             │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ CloudWatch Logs: /ecs/devops-app                │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ S3 Bucket: devops-app-bucket-* (Versioned)     │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## �� Troubleshooting

### Workflow fails on Phase 2 (Terraform):
```bash
# Check S3 bucket exists
aws s3 ls | grep devops-terraform-state

# Verify AWS credentials
aws sts get-caller-identity

# Check Terraform logs in GitHub Actions
# GitHub Repo → Actions → Latest Run → Phase 2
```

### Workflow fails on Phase 3 (Docker):
```bash
# Verify ECR repository created
aws ecr describe-repositories --region ap-south-1

# Check Docker credentials
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
```

### Workflow fails on Phase 4 (ECS):
```bash
# Check ECS service status
aws ecs describe-services \
  --cluster devops-cluster \
  --services devops-service \
  --region ap-south-1

# View container logs
aws logs tail /ecs/devops-app --follow --region ap-south-1

# Check if /health endpoint is working
curl http://<ALB_DNS>/health
```

---

## 🧹 Cleanup

To avoid AWS charges, destroy everything:

```bash
# Option 1: Using GitHub Actions (recommended)
# Push to a new branch that triggers destroy workflow
git checkout -b destroy
echo "# Cleanup" >> README.md
git push origin destroy

# Option 2: Manual cleanup
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Delete ECS service
aws ecs update-service \
  --cluster devops-cluster \
  --service devops-service \
  --desired-count 0 \
  --region ap-south-1

# Destroy Terraform
cd terraform
terraform destroy -auto-approve

# Delete S3 buckets
aws s3 rm s3://devops-terraform-state-${ACCOUNT_ID} --recursive
aws s3 rm s3://devops-app-bucket-${ACCOUNT_ID} --recursive

# Delete ECR repository
aws ecr delete-repository --repository-name devops-app --force --region ap-south-1
```

---

## ✅ Evaluation Checklist

- [x] Phase 1 - Testing (Unit, Integration, E2E)
- [x] Phase 2 - Terraform (Infrastructure as Code)
- [x] Phase 3 - Docker (Multi-stage, non-root, healthcheck)
- [x] Phase 4 - ECS Deployment (Fargate, ALB, logging)
- [x] GitHub Workflows (Automated pipeline)
- [x] Kubernetes Manifests (Bonus)
- [x] AWS Integration (Secrets, credentials)
- [x] Idempotent Scripts (Safe re-runs)
- [x] Documentation (This guide)

---

## 📞 Support

For issues or questions:
1. Check GitHub Actions logs
2. Review AWS CloudWatch logs
3. Verify AWS credentials in GitHub Secrets
4. Check Terraform state in S3
5. Review this deployment guide

Good luck with your evaluation! 🚀
