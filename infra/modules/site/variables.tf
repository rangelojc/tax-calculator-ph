variable "prefix" {
  type        = string
  description = "prefix for the resources"
}

variable "site_id" {
  type        = string
  description = "id of the website"
}

variable "custom_domains" {
  type = list(object({
    domain     = string
    enable_ssl = bool
  }))
  description = "customs domains of the website"
}


variable "location" {
  type        = string
  default     = "southeastasia"
  description = "location of the website"
}

