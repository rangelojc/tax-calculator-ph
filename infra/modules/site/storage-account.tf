resource "azurerm_storage_account" "web" {
  name                     = "st${var.prefix}${var.site_id}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  access_tier              = "Hot"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  allow_blob_public_access = true
  tags = {
    prefix = "${var.prefix}"
  }
}

resource "azurerm_storage_container" "container" {
  name                  = "web"
  storage_account_name  = azurerm_storage_account.web.name
  container_access_type = "container"
}
