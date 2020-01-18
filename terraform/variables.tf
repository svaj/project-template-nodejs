
variable "gcp_project" {
  type    = string
  default = "your-gcp-project"
}
variable "gcp_project_name" {
  type    = string
  default = "your-gcp-project-name"
}

variable "gcp_region" {
  type    = string
  default = "us-central-1"
}

variable "gcp_zone" {
  type    = string
  default = "us-central-1a"
}

variable "gae_service" {
  type    = string
  default = "your-gae-service"
}

variable "gae_location_id" {
  type    = string
  default = "us-central"
}


variable "gcp_billing_account" {
  type    = string
  default = "your-gcp-billing-account"
}
variable "gcp_state_bucket_name" {
  type    = string
  default = "your-gcp-bucket-name"
}
variable "gcp_state_bucket_location" {
  type    = string
  default = "your-gcp-bucket-location"
}