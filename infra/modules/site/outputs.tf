output "storage_account_name" {
  value = azurerm_storage_account.web.name
}

output "storage_account_container" {
  value = azurerm_storage_container.container.name
}

output "cdn_profile_name" {
  value = azurerm_cdn_profile.web.name
}

output "cdn_endpoint_name" {
  value = azurerm_cdn_endpoint.web.name
}

output "resource_group" {
  value = azurerm_resource_group.rg.name
}
