###############
## Variables ##
###############

variable "project_name" {
  type = string
  default = "ch-test-strapi"
}

variable "location" {
  type = string
  default = "asia-southeast1"
}

variable "db_name" {
  type = string
  default = "strapi"
}

variable "db_instance_name" {
  type = string
  default = "strapi-db-instance"
}

variable "app_bucket_name" {
  type = string
  default = "ch-test-strapi-app-bucket"
  # default = "ch-test-strapi.appspot.com"
}

variable "db_username" {
  type = string
  sensitive = true
}

variable "db_password" {
  type = string
  sensitive = true
}

######################
## Project Settings ##
######################

data "google_billing_account" "account" {
  display_name = "My Billing Account"
  open = true
}

resource "google_project" "project" {
  name = var.project_name
  project_id = var.project_name
  org_id = "257845927637" # better.sg
  billing_account = data.google_billing_account.account.id
}

// Enable Cloud SQL Admin API to connect to database
resource "google_project_service" "sql_admin_api" {
  project = google_project.project.project_id
  service = "sqladmin.googleapis.com"
}

#############
## Storage ##
#############

resource "google_storage_bucket" "app_bucket" {
  name = var.app_bucket_name
  location = var.location
  project = google_project.project.project_id
  force_destroy = true
  versioning {
    enabled = true
  }
}

resource "random_id" "terraform_state_bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "terraform_state" {
  name = "terraform-state-bucket-${random_id.terraform_state_bucket_prefix.hex}"
  location = var.location
  project = google_project.project.project_id
  force_destroy = false
  versioning {
    enabled = true
  }
}

################
## App Engine ##
################

resource "google_app_engine_application" "app" {
  project = google_project.project.project_id
  location_id = var.location
}

##############
## Database ##
##############

resource "google_sql_database_instance" "strapi_db_instance" {
  name = var.db_instance_name
  database_version = "POSTGRES_14"
  project = google_project.project.project_id
  region = var.location
  deletion_protection = false
  settings {
    tier = "db-f1-micro" # TODO: upgrade db tier for production
    maintenance_window { # TODO: change db maintenance window?
      day = 7
      hour = 20 # Sunday 8pm (UTC) = Monday 4am (UTC+8)
    }
  }
}

resource "google_sql_database" "strapi_db" {
  name = var.db_name
  instance = google_sql_database_instance.strapi_db_instance.name
  project = google_project.project.project_id
}

resource "google_sql_user" "user" {
  name = var.db_username
  password = var.db_password
  instance = google_sql_database_instance.strapi_db_instance.name
  project = google_project.project.project_id
}
