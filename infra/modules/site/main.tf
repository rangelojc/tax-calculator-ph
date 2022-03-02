resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.prefix}-${var.site_id}"
  location = var.location
}
