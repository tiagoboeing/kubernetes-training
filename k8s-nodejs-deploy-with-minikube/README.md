# NodeJS deploy with Minikube (Kubernetes)

- [Install & configure Minikube](https://minikube.sigs.k8s.io/docs/start/) (all platforms); or if you don't want to use Minikube, alternatively:
  - **Windows/Mac**: use Docker Desktop and [enable Kubernetes](https://docs.docker.com/desktop/kubernetes/); or
  - **Linux/Windows/Mac**: [manually install Kubernetes](https://kubernetes.io/pt-br/docs/setup/)

## Docker

```docker

# Build
docker build -t tiagoboeing/nodejs-service-a .

# Create Docker tag
docker tag tiagoboeing/nodejs-service-a:latest localhost:5000/tiagoboeing/nodejs-service-a

# Up local registry
docker run -d -p 5000:5000 --name registry registry:2

# Send image to registry
docker push localhost:5000/tiagoboeing/nodejs-service-a
```

### Kubernetes

```bash
# Create port forward
kubectl port-forward nodejs-service-a-796dd77855-9d9hx 3000:3000 -n workshop-dev

# Rollout without downtime to the new ConfigMap
kubectl rollout restart deployments nodejs-service-a -n workshop-dev

```

## Useful commands

```bash
# Definir namespace preferido
kubectl config set-context --current --namespace=<insert-namespace-name-here>

# Visualizar eventos de um namespace no Kubernetes
kubectl get events -n workshop-dev

# Lista por data do evento
kubectl get events --sort-by=.metadata.creationTimestamp

# Visualizar logs de um node
kubectl logs -f nodejs-service-a-ddcf9746f-rgw2g

# Apagar deployment
kubectl delete deployment nodejs-service-a -n workshop-dev

# Visualizar recursos disponíveis
kubectl api-resources

# Listar ENVs do container
kubectl exec nodejs-service-a-5d45d78c46-7t62k env -n workshop-dev

# Watch mode
watch -n 1 kubectl get pods

# Scale para 0
kubectl scale deployment nodejs-service-a --replicas=0

# Anexar terminal em um pod
kubectl exec -i -t nodejs-service-a-6d5d4f79d9-9tk8g -- /bin/sh

# Exportar deployment do Kubernetes
kubectl get deployment nodejs-service-a -n workshop-dev -o yaml
```

### Up local Registry

[https://docs.docker.com/registry/](https://docs.docker.com/registry/)

```bash
docker run -d -p 5000:5000 --name registry registry:2
```

### Preparing Docker image

```bash
docker build -t tiagoboeing/nodejs-service-a .

docker tag tiagoboeing/nodejs-service-a:latest localhost:5000/tiagoboeing/nodejs-service-a

# Send image to local Registry
docker push localhost:5000/tiagoboeing/nodejs-service-a
```

### Creating imperative deployment on Kubernetes

```bash
# Create deployment searching on the local Registry
kubectl create deployment nodejs-service-a --image=localhost:5000/tiagoboeing/nodejs-service-a -n workshop-dev
```

### Exportando deployment do Kubernetes

```bash
kubectl get deployment nodejs-service-a -n workshop-dev -o yaml
```

### Creating declarative deployment

```bash
# k8s/deployment.yaml any file, can be exported usign:
# kubectl get deployment nodejs-service-a -n workshop-dev -o yaml
kubectl apply -f k8s/deployment.yaml -n workshop-dev

# Apply ConfigMap
k apply -f k8s/configmap.yaml -n workshop-dev
```

### ConfigMaps

```bash
# Listar
k get cm -n workshop-dev

# Aplicar ConfigMap
k apply -f k8s/configmap.yaml -n workshop-dev

# Rollout sem downtime após atualizar ConfigMap
kubectl rollout restart deployments nodejs-service-a -n workshop-dev
```

### PersistentVolume

Space created by the Cluster admin

```bash
# Apply
kubectl apply -f k8s/pv.yaml -n workshop-dev
```

### PersistentVolumeClaim

Application request more storage space:

**Status:**

- `bound`: link between PersistentVolumeClaim and PersistentVolume created.

```bash
# Apply
k apply -f k8s/pvc.yaml -n workshop-dev

# View details
kubectl get pvc -n workshop-dev

# View all
kubectl get pv -o wide
```

### Exposing deployment to external access

> Service: a gateway, like a bridge to access the pods.

```bash
kubectl expose deployment nodejs-service-a --type="NodePort" --port=3000 -n workshop-dev

# View services
kubectl get service -n workshop-dev

# Exporting to YAML
kubectl get service nodejs-service-a -n workshop-dev -o yaml > k8s/service.yaml

# Delete service
kubectl delete service nodejs-service-a -n workshop-dev

# Apply service
kubectl apply -f k8s/service.yaml -n workshop-dev

# Describe service
kubectl describe service nodejs-service-a -n workshop-dev
```
