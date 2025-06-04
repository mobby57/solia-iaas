/*
  Terraform main configuration for Azure infrastructure deployment
  Components:
  - Virtual Network (VNet) and Subnet
  - Azure Kubernetes Service (AKS) cluster
  - Cosmos DB with MongoDB API
  - Azure Blob Storage
  - Key Vault for secrets management
  - Application Gateway with SSL for ingress
  - Azure Container Registry (ACR)
  - Azure OpenAI and Cognitive Services (optional)
*/

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "solia-rg"
  location = "East US"
}

resource "azurerm_virtual_network" "main" {
  name                = "solia-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "solia-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "soliaaks"

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_DS2_v2"
    vnet_subnet_id = azurerm_subnet.aks.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
  }
}

resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "soliacosmosdb"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "MongoDB"
  enable_automatic_failover = true

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }
}

resource "azurerm_storage_account" "blob" {
  name                     = "soliabstorage"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  allow_blob_public_access = false
}

resource "azurerm_key_vault" "kv" {
  name                        = "soliakv"
  location                    = azurerm_resource_group.main.location
  resource_group_name         = azurerm_resource_group.main.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_enabled         = true
  purge_protection_enabled    = false
}

resource "azurerm_container_registry" "acr" {
  name                = "soliaacr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Optional: Azure OpenAI and Cognitive Services resources can be added here if enabled

data "azurerm_client_config" "current" {}

# Outputs
output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "cosmosdb_account_endpoint" {
  value = azurerm_cosmosdb_account.cosmos.endpoint
}

output "storage_account_name" {
  value = azurerm_storage_account.blob.name
}

output "key_vault_name" {
  value = azurerm_key_vault.kv.name
}

output "container_registry_name" {
  value = azurerm_container_registry.acr.name
}
