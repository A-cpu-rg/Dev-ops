variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "devops-app"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
