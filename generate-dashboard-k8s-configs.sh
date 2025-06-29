#!/bin/bash

# Script to generate Kubernetes deployment configurations for centralized-dashboard services

JAVA_SERVICES=(
    "centralized-core"
    "centralized-dashboard-production"
    "centralized-dashboard-shared"
    "centralized-dashboard-staging"
    "centralized-data-aggregation"
    "centralized-performance-metrics"
    "centralized-real-time-data"
    "centralized-reporting"
)

REACT_SERVICES=(
    "centralized-analytics-dashboard"
)

# Function to determine service port based on service name
get_service_port() {
    case $1 in
        "centralized-core") echo "8100" ;;
        "centralized-analytics-dashboard") echo "3000" ;;
        "centralized-dashboard-production") echo "8101" ;;
        "centralized-dashboard-shared") echo "8102" ;;
        "centralized-dashboard-staging") echo "8103" ;;
        "centralized-data-aggregation") echo "8104" ;;
        "centralized-performance-metrics") echo "8105" ;;
        "centralized-real-time-data") echo "8106" ;;
        "centralized-reporting") echo "8107" ;;
        *) echo "8080" ;;
    esac
}

# Function to create deployment.yaml for Java services
create_java_deployment_yaml() {
    local service=$1
    local service_path=$2
    local port=$(get_service_port $service)
    
    # Create k8s directory if it doesn't exist
    mkdir -p "$service_path/k8s"
    
    cat > "$service_path/k8s/deployment.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service}
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
    version: v1
    type: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ${service}
  template:
    metadata:
      labels:
        app: ${service}
        component: dashboard
        version: v1
        type: backend
    spec:
      serviceAccountName: ${service}-sa
      containers:
      - name: ${service}
        image: ghcr.io/exalt/${service}:latest
        imagePullPolicy: Always
        ports:
        - containerPort: ${port}
          name: http
          protocol: TCP
        - containerPort: 8081
          name: management
          protocol: TCP
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "kubernetes"
        - name: SERVER_PORT
          value: "${port}"
        - name: MANAGEMENT_SERVER_PORT
          value: "8081"
        - name: CONFIG_SERVER_URL
          value: "http://config-server:8166"
        - name: EUREKA_SERVER_URL
          value: "http://service-registry:8154/eureka"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ${service}-db-secret
              key: url
        - name: DATABASE_USERNAME
          valueFrom:
            secretKeyRef:
              name: ${service}-db-secret
              key: username
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: ${service}-db-secret
              key: password
        - name: REDIS_HOST
          value: "redis"
        - name: REDIS_PORT
          value: "6379"
        - name: KAFKA_BOOTSTRAP_SERVERS
          value: "kafka:9092"
        - name: JAVA_OPTS
          value: "-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=100"
        resources:
          requests:
            memory: "768Mi"
            cpu: "250m"
          limits:
            memory: "1.5Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: management
          initialDelaySeconds: 120
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: management
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        volumeMounts:
        - name: config
          mountPath: /app/config
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: config
        configMap:
          name: ${service}-config
      - name: logs
        emptyDir: {}
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - ${service}
              topologyKey: kubernetes.io/hostname
---
apiVersion: v1
kind: Service
metadata:
  name: ${service}
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
    type: backend
spec:
  type: ClusterIP
  ports:
  - port: ${port}
    targetPort: http
    protocol: TCP
    name: http
  - port: 8081
    targetPort: management
    protocol: TCP
    name: management
  selector:
    app: ${service}
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${service}-sa
  namespace: centralized-dashboard
  labels:
    app: ${service}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${service}-config
  namespace: centralized-dashboard
  labels:
    app: ${service}
data:
  application.yaml: |
    spring:
      application:
        name: ${service}
      cloud:
        kubernetes:
          reload:
            enabled: true
            mode: polling
            period: 5000
      datasource:
        url: \${DATABASE_URL}
        username: \${DATABASE_USERNAME}
        password: \${DATABASE_PASSWORD}
      redis:
        host: \${REDIS_HOST}
        port: \${REDIS_PORT}
    management:
      endpoints:
        web:
          exposure:
            include: health,info,metrics,prometheus
      metrics:
        export:
          prometheus:
            enabled: true
    logging:
      level:
        root: INFO
        com.exalt: DEBUG
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ${service}-pdb
  namespace: centralized-dashboard
  labels:
    app: ${service}
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: ${service}
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${service}-hpa
  namespace: centralized-dashboard
  labels:
    app: ${service}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${service}
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
      - type: Pods
        value: 2
        periodSeconds: 60
EOF
}

# Function to create deployment.yaml for React services
create_react_deployment_yaml() {
    local service=$1
    local service_path=$2
    local port=$(get_service_port $service)
    
    # Create k8s directory if it doesn't exist
    mkdir -p "$service_path/k8s"
    
    cat > "$service_path/k8s/deployment.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service}
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
    version: v1
    type: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${service}
  template:
    metadata:
      labels:
        app: ${service}
        component: dashboard
        version: v1
        type: frontend
    spec:
      serviceAccountName: ${service}-sa
      containers:
      - name: ${service}
        image: ghcr.io/exalt/${service}:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: REACT_APP_API_BASE_URL
          value: "http://centralized-core:8100/api"
        - name: REACT_APP_WS_BASE_URL
          value: "ws://centralized-core:8100/ws"
        - name: REACT_APP_ENV
          value: "kubernetes"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d/default.conf
          subPath: default.conf
      volumes:
      - name: nginx-config
        configMap:
          name: ${service}-nginx-config
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - ${service}
              topologyKey: kubernetes.io/hostname
---
apiVersion: v1
kind: Service
metadata:
  name: ${service}
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
    type: frontend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: ${service}
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${service}-sa
  namespace: centralized-dashboard
  labels:
    app: ${service}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${service}-nginx-config
  namespace: centralized-dashboard
  labels:
    app: ${service}
data:
  default.conf: |
    server {
        listen 80;
        server_name localhost;
        
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
            try_files \$uri \$uri/ /index.html;
        }
        
        location /api/ {
            proxy_pass http://centralized-core:8100/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        location /ws/ {
            proxy_pass http://centralized-core:8100/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ${service}-pdb
  namespace: centralized-dashboard
  labels:
    app: ${service}
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: ${service}
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${service}-hpa
  namespace: centralized-dashboard
  labels:
    app: ${service}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${service}
  minReplicas: 3
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 33
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
      - type: Pods
        value: 3
        periodSeconds: 60
EOF
}

# Function to create ingress.yaml (common for all services)
create_ingress_yaml() {
    local service=$1
    local service_path=$2
    local port=$(get_service_port $service)
    local target_port="80"
    
    # Use appropriate target port based on service type
    if [[ " ${JAVA_SERVICES[@]} " =~ " ${service} " ]]; then
        target_port="$port"
    fi
    
    cat > "$service_path/k8s/ingress.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${service}
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - ${service}.dashboard.exalt.com
    secretName: ${service}-tls
  rules:
  - host: ${service}.dashboard.exalt.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${service}
            port:
              number: ${target_port}
EOF
}

# Function to create secrets.yaml template
create_secrets_yaml() {
    local service=$1
    local service_path=$2
    
    cat > "$service_path/k8s/secrets.yaml" << EOF
# This is a template for secrets. In production, use sealed secrets or external secret management
apiVersion: v1
kind: Secret
metadata:
  name: ${service}-db-secret
  namespace: centralized-dashboard
  labels:
    app: ${service}
type: Opaque
stringData:
  url: "jdbc:postgresql://postgres:5432/${service//-/_}_db"
  username: "${service//-/_}_user"
  password: "CHANGE_ME_IN_PRODUCTION"
---
apiVersion: v1
kind: Secret
metadata:
  name: ${service}-app-secret
  namespace: centralized-dashboard
  labels:
    app: ${service}
type: Opaque
stringData:
  jwt-secret: "CHANGE_ME_IN_PRODUCTION"
  api-key: "CHANGE_ME_IN_PRODUCTION"
  encryption-key: "CHANGE_ME_IN_PRODUCTION"
  oauth-client-secret: "CHANGE_ME_IN_PRODUCTION"
EOF
}

# Function to create namespace.yaml
create_namespace_yaml() {
    local service_path=$1
    
    cat > "$service_path/k8s/namespace.yaml" << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: centralized-dashboard
  labels:
    name: centralized-dashboard
    component: dashboard
    environment: production
---
apiVersion: v1
kind: LimitRange
metadata:
  name: dashboard-limits
  namespace: centralized-dashboard
spec:
  limits:
  - default:
      memory: "1Gi"
      cpu: "500m"
    defaultRequest:
      memory: "256Mi"
      cpu: "100m"
    type: Container
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dashboard-quota
  namespace: centralized-dashboard
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "10"
    pods: "50"
    services: "20"
EOF
}

# Function to create monitoring.yaml (for Java services)
create_monitoring_yaml() {
    local service=$1
    local service_path=$2
    
    cat > "$service_path/k8s/monitoring.yaml" << EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: ${service}
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
spec:
  selector:
    matchLabels:
      app: ${service}
  endpoints:
  - port: management
    path: /actuator/prometheus
    interval: 30s
---
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: ${service}-alerts
  namespace: centralized-dashboard
  labels:
    app: ${service}
    component: dashboard
spec:
  groups:
  - name: ${service}.rules
    rules:
    - alert: ${service}Down
      expr: up{job="${service}"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "${service} is down"
        description: "${service} has been down for more than 1 minute."
    
    - alert: ${service}HighMemoryUsage
      expr: (container_memory_usage_bytes{pod=~"${service}-.*"} / container_spec_memory_limit_bytes) > 0.9
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "${service} high memory usage"
        description: "${service} memory usage is above 90% for more than 5 minutes."
    
    - alert: ${service}HighCPUUsage
      expr: (rate(container_cpu_usage_seconds_total{pod=~"${service}-.*"}[5m]) / container_spec_cpu_quota) > 0.9
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "${service} high CPU usage"
        description: "${service} CPU usage is above 90% for more than 5 minutes."
EOF
}

# Main execution
echo "Generating Kubernetes configurations for all centralized-dashboard services..."

# Process Java services
for service in "${JAVA_SERVICES[@]}"; do
    echo "Processing Java service: ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    if [ -d "${service_path}" ]; then
        create_java_deployment_yaml "${service}" "${service_path}"
        create_ingress_yaml "${service}" "${service_path}"
        create_secrets_yaml "${service}" "${service_path}"
        create_monitoring_yaml "${service}" "${service_path}"
        
        # Create namespace only for the first service
        if [ "$service" == "centralized-core" ]; then
            create_namespace_yaml "${service_path}"
        fi
        
        echo "✅ Generated Java K8s configs for ${service}"
    else
        echo "❌ Service directory not found for ${service}"
    fi
done

# Process React services
for service in "${REACT_SERVICES[@]}"; do
    echo "Processing React service: ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    if [ -d "${service_path}" ]; then
        create_react_deployment_yaml "${service}" "${service_path}"
        create_ingress_yaml "${service}" "${service_path}"
        create_secrets_yaml "${service}" "${service_path}"
        echo "✅ Generated React K8s configs for ${service}"
    else
        echo "❌ Service directory not found for ${service}"
    fi
done

echo "Kubernetes configuration generation complete!"