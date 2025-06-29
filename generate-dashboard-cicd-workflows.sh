#!/bin/bash

# Script to generate CI/CD workflow files for all centralized-dashboard services

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

# Function to create build.yml for Java services
create_java_build_yml() {
    local service=$1
    local service_path=$2
    cat > "$service_path/.github/workflows/build.yml" << EOF
name: Build ${service} Service

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  JAVA_VERSION: '17'
  MAVEN_VERSION: '3.9.6'
  SERVICE_NAME: ${service}
  DOCKER_REGISTRY: ghcr.io
  DOCKER_IMAGE: ghcr.io/\${{ github.repository_owner }}/${service}

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up JDK \${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: \${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
        restore-keys: \${{ runner.os }}-m2
        
    - name: Build with Maven
      run: mvn clean compile
      working-directory: centralized-dashboard/${service}
      
    - name: Package application
      run: mvn package -DskipTests
      working-directory: centralized-dashboard/${service}
      
    - name: Build Docker image
      run: |
        docker build -t \${{ env.DOCKER_IMAGE }}:\${{ github.sha }} .
        docker tag \${{ env.DOCKER_IMAGE }}:\${{ github.sha }} \${{ env.DOCKER_IMAGE }}:latest
      working-directory: centralized-dashboard/${service}
        
    - name: Log in to Docker Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v3
      with:
        registry: \${{ env.DOCKER_REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
        
    - name: Push Docker image
      if: github.event_name != 'pull_request'
      run: |
        docker push \${{ env.DOCKER_IMAGE }}:\${{ github.sha }}
        docker push \${{ env.DOCKER_IMAGE }}:latest
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: centralized-dashboard/${service}/target/
        retention-days: 7
EOF
}

# Function to create build.yml for React services
create_react_build_yml() {
    local service=$1
    local service_path=$2
    cat > "$service_path/.github/workflows/build.yml" << EOF
name: Build ${service} Frontend

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  SERVICE_NAME: ${service}
  DOCKER_REGISTRY: ghcr.io
  DOCKER_IMAGE: ghcr.io/\${{ github.repository_owner }}/${service}

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Node.js \${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: centralized-dashboard/${service}/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: centralized-dashboard/${service}
      
    - name: Lint code
      run: npm run lint
      working-directory: centralized-dashboard/${service}
      
    - name: Type check
      run: npm run type-check
      working-directory: centralized-dashboard/${service}
      
    - name: Build application
      run: npm run build
      working-directory: centralized-dashboard/${service}
      
    - name: Build Docker image
      run: |
        docker build -t \${{ env.DOCKER_IMAGE }}:\${{ github.sha }} .
        docker tag \${{ env.DOCKER_IMAGE }}:\${{ github.sha }} \${{ env.DOCKER_IMAGE }}:latest
      working-directory: centralized-dashboard/${service}
        
    - name: Log in to Docker Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v3
      with:
        registry: \${{ env.DOCKER_REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
        
    - name: Push Docker image
      if: github.event_name != 'pull_request'
      run: |
        docker push \${{ env.DOCKER_IMAGE }}:\${{ github.sha }}
        docker push \${{ env.DOCKER_IMAGE }}:latest
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: centralized-dashboard/${service}/build/
        retention-days: 7
EOF
}

# Function to create test.yml for Java services
create_java_test_yml() {
    local service=$1
    local service_path=$2
    cat > "$service_path/.github/workflows/test.yml" << EOF
name: Test ${service} Service

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  JAVA_VERSION: '17'
  SERVICE_NAME: ${service}

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up JDK \${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: \${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
        restore-keys: \${{ runner.os }}-m2
        
    - name: Run unit tests
      run: mvn test -Dtest="**/unit/**"
      working-directory: centralized-dashboard/${service}
      env:
        SPRING_PROFILES_ACTIVE: test
        
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Unit Test Results
        path: centralized-dashboard/${service}/target/surefire-reports/*.xml
        reporter: java-junit
        
  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up JDK \${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: \${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
        restore-keys: \${{ runner.os }}-m2
        
    - name: Run integration tests
      run: mvn test -Dtest="**/integration/**"
      working-directory: centralized-dashboard/${service}
      env:
        SPRING_PROFILES_ACTIVE: integration-test
        
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Integration Test Results
        path: centralized-dashboard/${service}/target/surefire-reports/*.xml
        reporter: java-junit
        
  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up JDK \${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: \${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Build application
      run: mvn package -DskipTests
      working-directory: centralized-dashboard/${service}
      
    - name: Start application
      run: |
        docker-compose up -d
        sleep 30
      working-directory: centralized-dashboard/${service}
      
    - name: Run E2E tests
      run: mvn test -Dtest="**/e2e/**"
      working-directory: centralized-dashboard/${service}
      
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: E2E Test Results
        path: centralized-dashboard/${service}/target/surefire-reports/*.xml
        reporter: java-junit
        
    - name: Stop application
      if: always()
      run: docker-compose down
      working-directory: centralized-dashboard/${service}
EOF
}

# Function to create test.yml for React services
create_react_test_yml() {
    local service=$1
    local service_path=$2
    cat > "$service_path/.github/workflows/test.yml" << EOF
name: Test ${service} Frontend

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  SERVICE_NAME: ${service}

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Node.js \${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: centralized-dashboard/${service}/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: centralized-dashboard/${service}
        
    - name: Run unit tests
      run: npm run test:unit -- --coverage --watchAll=false
      working-directory: centralized-dashboard/${service}
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: centralized-dashboard/${service}/coverage/lcov.info
        flags: unittests
        name: codecov-${service}
        
  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Node.js \${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: centralized-dashboard/${service}/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: centralized-dashboard/${service}
      
    - name: Run integration tests
      run: npm run test:integration
      working-directory: centralized-dashboard/${service}
      
  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Node.js \${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: centralized-dashboard/${service}/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: centralized-dashboard/${service}
      
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
      working-directory: centralized-dashboard/${service}
      
    - name: Build application
      run: npm run build
      working-directory: centralized-dashboard/${service}
      
    - name: Start application
      run: |
        npm run start:prod &
        sleep 10
      working-directory: centralized-dashboard/${service}
      
    - name: Run E2E tests
      run: npm run test:e2e
      working-directory: centralized-dashboard/${service}
      
    - name: Upload E2E results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: e2e-results
        path: centralized-dashboard/${service}/e2e-results/
        retention-days: 30
EOF
}

# Function to create code-quality.yml (common for both)
create_code_quality_yml() {
    local service=$1
    local service_path=$2
    local tech_type=$3
    
    if [ "$tech_type" == "react" ]; then
        cat > "$service_path/.github/workflows/code-quality.yml" << EOF
name: Code Quality Check - ${service}

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  SERVICE_NAME: ${service}

jobs:
  code-quality:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Set up Node.js \${{ env.NODE_VERSION }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: centralized-dashboard/${service}/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: centralized-dashboard/${service}
        
    - name: Run ESLint
      run: npm run lint:check
      working-directory: centralized-dashboard/${service}
      
    - name: Run Prettier
      run: npm run format:check
      working-directory: centralized-dashboard/${service}
      
    - name: Type check
      run: npm run type-check
      working-directory: centralized-dashboard/${service}
      
    - name: Check bundle size
      run: npm run analyze
      working-directory: centralized-dashboard/${service}
      
    - name: Run tests with coverage
      run: npm run test:coverage
      working-directory: centralized-dashboard/${service}
      
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
      with:
        projectBaseDir: centralized-dashboard/${service}
        
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: centralized-dashboard/${service}/coverage/lcov.info
        flags: unittests
        name: codecov-${service}
        
    - name: Comment PR with quality metrics
      uses: actions/github-script@v7
      if: github.event_name == 'pull_request'
      with:
        script: |
          const fs = require('fs');
          const coverage = 'Check the build logs for detailed code quality metrics';
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: '## Code Quality Report - ${service}\\n' + coverage
          });
EOF
    else
        cat > "$service_path/.github/workflows/code-quality.yml" << EOF
name: Code Quality Check - ${service}

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  JAVA_VERSION: '17'
  SERVICE_NAME: ${service}

jobs:
  code-quality:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Set up JDK \${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: \${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache SonarCloud packages
      uses: actions/cache@v3
      with:
        path: ~/.sonar/cache
        key: \${{ runner.os }}-sonar
        restore-keys: \${{ runner.os }}-sonar
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
        restore-keys: \${{ runner.os }}-m2
        
    - name: Run SpotBugs
      run: mvn spotbugs:check
      working-directory: centralized-dashboard/${service}
      
    - name: Run Checkstyle
      run: mvn checkstyle:check
      working-directory: centralized-dashboard/${service}
      
    - name: Run PMD
      run: mvn pmd:check
      working-directory: centralized-dashboard/${service}
      
    - name: Analyze with SonarCloud
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
      run: mvn verify sonar:sonar -Dsonar.projectKey=exalt_${service}
      working-directory: centralized-dashboard/${service}
      
    - name: Check code coverage
      run: |
        mvn jacoco:report
        echo "Code coverage report generated"
      working-directory: centralized-dashboard/${service}
      
    - name: Upload code coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: centralized-dashboard/${service}/target/site/jacoco/jacoco.xml
        flags: unittests
        name: codecov-${service}
EOF
    fi
}

# Function to create security-scan.yml (common for both with variations)
create_security_scan_yml() {
    local service=$1
    local service_path=$2
    local tech_type=$3
    
    cat > "$service_path/.github/workflows/security-scan.yml" << EOF
name: Security Scan - ${service}

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan on Sundays

env:
  SERVICE_NAME: ${service}

jobs:
EOF

    if [ "$tech_type" == "react" ]; then
        cat >> "$service_path/.github/workflows/security-scan.yml" << EOF
  dependency-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Node.js 18
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: centralized-dashboard/${service}/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: centralized-dashboard/${service}
      
    - name: Run npm audit
      run: npm audit --audit-level moderate
      working-directory: centralized-dashboard/${service}
      
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
      with:
        args: --file=centralized-dashboard/${service}/package.json
EOF
    else
        cat >> "$service_path/.github/workflows/security-scan.yml" << EOF
  dependency-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Run OWASP Dependency Check
      run: mvn org.owasp:dependency-check-maven:check
      working-directory: centralized-dashboard/${service}
      
    - name: Upload dependency check results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: dependency-check-report
        path: centralized-dashboard/${service}/target/dependency-check-report.html
EOF
    fi

    cat >> "$service_path/.github/workflows/security-scan.yml" << EOF
        
  container-scan:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Build Docker image
      run: docker build -t ${service}:scan .
      working-directory: centralized-dashboard/${service}
      
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: '${service}:scan'
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL,HIGH,MEDIUM'
        
    - name: Upload Trivy scan results to GitHub Security
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: 'trivy-results.sarif'
        
  code-scan:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: javascript,java
        
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
      
  secrets-scan:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run GitLeaks
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
EOF
}

# Function to create deploy-development.yml
create_deploy_development_yml() {
    local service=$1
    local service_path=$2
    cat > "$service_path/.github/workflows/deploy-development.yml" << EOF
name: Deploy to Development - ${service}

on:
  push:
    branches: [ develop ]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy (leave empty for latest)'
        required: false
        default: 'latest'

env:
  SERVICE_NAME: ${service}
  DOCKER_REGISTRY: ghcr.io
  DOCKER_IMAGE: ghcr.io/\${{ github.repository_owner }}/${service}
  KUBE_NAMESPACE: centralized-dashboard-dev
  DEPLOYMENT_NAME: ${service}-deployment

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: development
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: \${{ secrets.AWS_DEFAULT_REGION }}
        
    - name: Configure kubectl
      uses: aws-actions/amazon-eks-update-kubeconfig@v1
      with:
        cluster-name: \${{ secrets.EKS_CLUSTER_NAME }}
        
    - name: Determine deployment version
      id: version
      run: |
        if [ "\${{ github.event.inputs.version }}" == "latest" ] || [ -z "\${{ github.event.inputs.version }}" ]; then
          echo "version=\${{ github.sha }}" >> \$GITHUB_OUTPUT
        else
          echo "version=\${{ github.event.inputs.version }}" >> \$GITHUB_OUTPUT
        fi
        
    - name: Update Kubernetes deployment
      run: |
        kubectl set image deployment/\${{ env.DEPLOYMENT_NAME }} \\
          ${service}=\${{ env.DOCKER_IMAGE }}:\${{ steps.version.outputs.version }} \\
          -n \${{ env.KUBE_NAMESPACE }}
          
    - name: Wait for rollout to complete
      run: |
        kubectl rollout status deployment/\${{ env.DEPLOYMENT_NAME }} \\
          -n \${{ env.KUBE_NAMESPACE }} \\
          --timeout=600s
          
    - name: Verify deployment
      run: |
        kubectl get pods -l app=${service} -n \${{ env.KUBE_NAMESPACE }}
        kubectl get services -l app=${service} -n \${{ env.KUBE_NAMESPACE }}
        
    - name: Run smoke tests
      run: |
        SERVICE_URL=\$(kubectl get service ${service}-service -n \${{ env.KUBE_NAMESPACE }} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
        echo "Service URL: \$SERVICE_URL"
        
        # Basic health check
        curl -f -s -o /dev/null -w "%{http_code}" http://\$SERVICE_URL/actuator/health || exit 1
        
    - name: Update deployment tracking
      uses: actions/github-script@v7
      with:
        script: |
          const deployment = await github.rest.repos.createDeployment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: context.sha,
            task: 'deploy',
            auto_merge: false,
            required_contexts: [],
            environment: 'development',
            description: 'Deployment to development environment'
          });
          
          await github.rest.repos.createDeploymentStatus({
            owner: context.repo.owner,
            repo: context.repo.repo,
            deployment_id: deployment.data.id,
            state: 'success',
            target_url: \`https://\${process.env.SERVICE_URL}\`,
            description: 'Deployment completed successfully'
          });
          
    - name: Send notification
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: \${{ job.status }}
        text: |
          Deployment \${{ job.status }} for ${service}
          Version: \${{ steps.version.outputs.version }}
          Environment: Development
          Actor: \${{ github.actor }}
        webhook_url: \${{ secrets.SLACK_WEBHOOK }}
EOF
}

# Main execution
echo "Generating CI/CD workflows for all centralized-dashboard services..."

# Process Java services
for service in "${JAVA_SERVICES[@]}"; do
    echo "Processing Java service: ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    if [ -d "${service_path}/.github/workflows" ]; then
        create_java_build_yml "${service}" "${service_path}"
        create_java_test_yml "${service}" "${service_path}"
        create_code_quality_yml "${service}" "${service_path}" "java"
        create_security_scan_yml "${service}" "${service_path}" "java"
        create_deploy_development_yml "${service}" "${service_path}"
        echo "✅ Generated Java workflows for ${service}"
    else
        echo "❌ Workflow directory not found for ${service}"
    fi
done

# Process React services
for service in "${REACT_SERVICES[@]}"; do
    echo "Processing React service: ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    # Create .github/workflows directory if it doesn't exist
    mkdir -p "${service_path}/.github/workflows"
    
    create_react_build_yml "${service}" "${service_path}"
    create_react_test_yml "${service}" "${service_path}"
    create_code_quality_yml "${service}" "${service_path}" "react"
    create_security_scan_yml "${service}" "${service_path}" "react"
    create_deploy_development_yml "${service}" "${service_path}"
    echo "✅ Generated React workflows for ${service}"
done

echo "CI/CD workflow generation complete!"