---
name: devops
description: "CI/CD pipeline design, IaC generation, container and Kubernetes configuration, cloud operations, and infrastructure debugging. Invoke when the user needs to set up or fix deployments, pipelines, Dockerfiles, Terraform configs, Kubernetes manifests, or monitoring. Trigger keywords: 'deploy', 'CI/CD', 'pipeline', 'Dockerfile', 'kubernetes', 'terraform', 'infrastructure', 'monitoring', 'helm chart', 'GitHub Actions'."
---

# devops

Automation-first infrastructure. Nothing untracked, nothing manual.

## Usage

```
@ZeroClaw devops --pipeline github-actions --lang rust
@ZeroClaw devops --dockerfile --app node --port 3000 --multi-stage
@ZeroClaw devops --k8s deployment --app my-api --replicas 3 --autoscale
@ZeroClaw devops --terraform aws --resources "vpc,eks,rds"
@ZeroClaw devops --deploy staging --stack docker-compose
@ZeroClaw devops --monitor --stack prometheus-grafana --app my-api
@ZeroClaw devops --debug --logs "OOMKilled" --namespace production
```

## Options

| Flag | Description |
|------|-------------|
| `--pipeline` | Generate a CI/CD pipeline (`github-actions`, `gitlab`, `circleci`) |
| `--lang` | Application language/stack (informs caching, build steps) |
| `--dockerfile` | Generate a Dockerfile |
| `--app` | Application type: `node`, `rust`, `python`, `go`, `static` |
| `--port` | Port to expose |
| `--multi-stage` | Use multi-stage Docker build (recommended) |
| `--k8s` | Generate Kubernetes manifest: `deployment`, `service`, `ingress`, `hpa` |
| `--replicas` | Number of pod replicas |
| `--autoscale` | Add HPA (CPU + memory-based) |
| `--terraform` | Generate Terraform config for a cloud provider |
| `--resources` | Comma-separated AWS/GCP/Azure resources to provision |
| `--deploy` | Deploy to an environment (`staging`, `production`) |
| `--stack` | Deployment stack: `docker-compose`, `k8s`, `ecs`, `fly` |
| `--monitor` | Set up observability stack |
| `--debug` | Help debug a running issue |
| `--logs` | Log snippet or error pattern to diagnose |

## Generated Artefacts

### CI/CD Pipeline (GitHub Actions — Rust example)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2
      - run: cargo test --all-features
      - run: cargo clippy -- -D warnings
      - run: cargo fmt --check

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cargo install cargo-audit && cargo audit

  deploy:
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### Multi-stage Dockerfile (Node example)

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Runtime stage — minimal image
FROM node:22-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-api
  template:
    spec:
      containers:
        - name: my-api
          image: ghcr.io/org/my-api:latest
          ports:
            - containerPort: 3000
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "512Mi" }
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
          readinessProbe:
            httpGet: { path: /ready, port: 3000 }
```

## Deployment Strategies

| Strategy | When to Use |
|----------|-------------|
| Rolling (default) | Zero-downtime, low risk |
| Blue/Green | Instant rollback, higher resource cost |
| Canary (5→25→50→100%) | High-traffic, gradual validation |
| Feature flags | Decouple deploy from release |

## Philosophy

Every infrastructure change goes through code. Manual clicks in the AWS console
are undocumented technical debt. If you can't deploy it from a clean machine with
one command, it's not production-ready.
