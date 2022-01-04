# Maratona Kubernetes - Azure (Microsoft Brasil)

[Link da playlist](https://www.youtube.com/playlist?list=PLB1hpnUGshULerdlzMknMLrHI810xIBJv)

## Useful commands

### Azure

1. Download & install & configure the [AZ CLI](https://docs.microsoft.com/pt-br/cli/azure/);
2. Set a subscription to send commands;
3. Create a resource group to separate the resources inside the Azure in different scopes;
4. Create a Container Registry (CR) to receive the Docker images;
5. Prepare the Docker image and send to Container Registry;

#### Authentication

```bash
# Login on account
az login

# Define subscription to use
az account set --subscription "NAME"
```

#### Resource groups

```bash
# Create resource group
az group create --name "kubernetes-training" --location eastus
```

#### Container registry

```bash
# Create Container registry
# name - need to be unique
# will generate a unique URL, something like that: tiagoboeing.azurecr.io
az acr create --resource-group "kubernetes-training" --name "tiagoboeing" --sku Basic

# Login on Container registry
az acr login --name "tiagoboeing"

# List
az acr list --resource-group kubernetes-training --output table
```

##### Docker image

Before sending to Container Registry, we need to create a tag to our Docker image containing the registry name.

> Registry name: **tiagoboeing.azurecr.io**

```bash
# Creating tag
docker tag tiagoboeing/nodejs-express:latest tiagoboeing.azurecr.io/nodejs-express:latest

# Search by image
docker image list | grep nodejs-http
```

Now, It's possible to push the image to CR, do a copy from tag created on the last step (`tiagoboeing.azurecr.io/nodejs-express:latest`):

```bash
# Send image to CR
docker push tiagoboeing.azurecr.io/nodejs-express:latest
```

![The process will start](docs/images/docker-push.png)

Looking at the Azure console you can see the image on "repositories" menu:

![](docs/images/azure-console-acr-repository.png)

##### Azure Container Service

In our example we've:

- ACR=**tiagoboeing**
- RESOURCE GROUP=**kubernetes-training**
- LOCATION=**eastus**

Let's create a Container Services for each service:

<details>
  <summary>mongo</summary>
  
```bash
az container create --resource-group kubernetes-training \
  --name mongodb \
  --cpu 0.5 --memory 0.5 \
  --image mongo:4.4.11 \
  --port 27017 \
  --ip-address public
```

> `--image mongo:4.4.11` = same from docker-compose

Verify the container logs to check if service is up.

```bash
az container logs --resource-group kubernetes-training --name mongodb
```

And get the container IP:

```bash
az container show --resource-group kubernetes-training --name mongodb --query ipAddress.ip
```

> In this example the IP is: `52.226.198.59`

</details>

<details>
  <summary>nodejs-express</summary>

For this service we need to authenticate to allow the image pull.

```bash
# Enable admin mode on CLI
az acr update -n tiagoboeing --admin-enabled true

# Get Container Registry password
az acr credential show -n tiagoboeing --query passwords
```

> Password in this example is: `4HKsNvJQ1Yf/OiYHJ3Rg4Xxk1X5fOA8e`

With the password we can configure the deploy:

```bash
az container create --resource-group kubernetes-training \
  --name nodejs-express \
  --cpu 0.5 --memory 0.5 \
  --image tiagoboeing.azurecr.io/nodejs-express:latest \
  --port 3000 \
  --environment-variables MESSAGE='Running on Azure' MONGO_URL=52.226.198.59 \
  --registry-username tiagoboeing \
  --registry-password 4HKsNvJQ1Yf/OiYHJ3Rg4Xxk1X5fOA8e \
  --ip-address public
```

> `image` use the same pushed to Container Registry.


```bash
# see logs (again)
az container logs --resource-group kubernetes-training --name nodejs-express

# get ip address (yes, again)
az container show --resource-group kubernetes-training --name nodejs-express --query ipAddress.ip
```

</details>
