#####################
## Terraform state ##
#####################

terraform {
  backend "gcs" {
    bucket = "terraform-state-bucket-2aca9c86c89b2221" # replace with name of created bucket from resource google_storage_bucket.terraform_state
    prefix = "terraform/state"
  }
}
