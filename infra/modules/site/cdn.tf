resource "azurerm_cdn_profile" "web" {
  name                = "cdn-${var.prefix}-${var.site_id}-web"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "web" {
  name                = "cdn-ep-${var.prefix}-${var.site_id}-web"
  profile_name        = azurerm_cdn_profile.web.name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  origin_host_header = azurerm_storage_account.web.primary_blob_host
  origin {
    name      = "web"
    host_name = azurerm_storage_account.web.primary_blob_host
  }

  delivery_rule {
    name  = "httptohttps"
    order = 1

    request_scheme_condition {
      match_values = ["HTTP"]
    }

    url_redirect_action {
      redirect_type = "Found"
      protocol      = "Https"
    }
  }

  delivery_rule {
    name  = "SpaRedirect"
    order = 2
    url_file_extension_condition {
      operator     = "LessThan"
      match_values = ["1"]
    }

    url_rewrite_action {
      source_pattern          = "/"
      destination             = "/web/index.html"
      preserve_unmatched_path = false
    }
  }

  delivery_rule {
    name  = "AssetRedirect"
    order = 3
    url_file_extension_condition {
      operator     = "GreaterThanOrEqual"
      match_values = ["1"]
    }

    url_rewrite_action {
      source_pattern = "/"
      destination    = "/web/"
    }
  }

}

resource "azurerm_cdn_endpoint_custom_domain" "custom_domains" {
  for_each = {
    for index, cd in var.custom_domains :
    index => cd
  }
  name            = replace(each.value.domain, ".", "-")
  cdn_endpoint_id = azurerm_cdn_endpoint.web.id
  host_name       = each.value.domain

  dynamic "cdn_managed_https" {
    for_each = each.value.enable_ssl ? [1] : []
    content {
      certificate_type = "Dedicated"
      protocol_type    = "ServerNameIndication"
      tls_version      = "TLS12"
    }
  }
}

# resource "null_resource" "cdn_ssl" {
#   provisioner "local-exec" {
#     command = "az cdn custom-domain enable-https -g ${azurerm_resource_group.rg.name} --profile-name ${azurerm_cdn_profile.web.name} --endpoint-name ${azurerm_cdn_endpoint.web.name} -n web-domain"
#   }
# }
