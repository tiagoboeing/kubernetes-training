# Maratona Kubernetes - Azure (Microsoft Brasil)

[Link da playlist](https://www.youtube.com/playlist?list=PLB1hpnUGshULerdlzMknMLrHI810xIBJv)

## Comandos úteis

### Azure

```bash
# Define subscription to use
az account set --subscription "NAME"

# Create resource group
az group create --name "kubernetes-training" --location eastus

# Create Container registry
# name - need to be unique
# will generate a unique URL, something like that: tiagoboeing.azurecr.io
az acr create --resource-group "kubernetes-training" --name "tiagoboeing" --sku Basic


```
