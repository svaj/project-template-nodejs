provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
  zone    = var.gcp_zone
  version = "~> 2.17"
}

resource "google_storage_bucket" "state-store" {
  name     = var.gcp_state_bucket_name
  location = var.gcp_state_bucket_location
}

resource "google_storage_bucket_acl" "state-store-acl" {
  bucket         = "${google_storage_bucket.state-store.name}"
  predefined_acl = "projectprivate"
}

resource "google_project" "project" {
  name            = var.gcp_project_name
  project_id      = var.gcp_project
  billing_account = var.gcp_billing_account
}

resource "google_app_engine_application" "app" {
  project     = "${google_project.project.project_id}"
  location_id = var.gae_location_id
}

terraform {
  backend "gcs" {
    bucket = var.gcp_state_bucket_name
    prefix = "tf/state"
  }
}