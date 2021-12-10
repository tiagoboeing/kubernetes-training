## Docker

```docker

# Build
docker build -t tiagoboeing/nodejs-service-a .

# Criar tag
docker tag tiagoboeing/nodejs-service-a:latest localhost:5000/tiagoboeing/nodejs-service-a

# Subir registry local
docker run -d -p 5000:5000 --name registry registry:2

# Enviar image para registry
docker push localhost:5000/tiagoboeing/nodejs-service-a
```

### Kubernetes

```
# Cria redirecionamento de porta
kubectl port-forward nodejs-service-a-796dd77855-9d9hx 3000:3000 -n workshop-dev

# Rollout sem downtime para novo ConfigMap
kubectl rollout restart deployments nodejs-service-a -n workshop-dev

```
