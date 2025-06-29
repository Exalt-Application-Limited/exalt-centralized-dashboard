#!/bin/bash

# Generate workflows specifically for centralized-core

SERVICE="centralized-core"
SERVICE_PATH="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${SERVICE}"

# Function to create build.yml
create_build_yml() {
    cat > "$SERVICE_PATH/.github/workflows/build.yml" << 'EOF'
name: Build centralized-core Service

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  JAVA_VERSION: '17'
  MAVEN_VERSION: '3.9.6'
  SERVICE_NAME: centralized-core
  DOCKER_REGISTRY: ghcr.io
  DOCKER_IMAGE: ghcr.io/${{ github.repository_owner }}/centralized-core

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2
        
    - name: Build with Maven
      run: mvn clean compile
      working-directory: centralized-dashboard/centralized-core
      
    - name: Package application
      run: mvn package -DskipTests
      working-directory: centralized-dashboard/centralized-core
      
    - name: Build Docker image
      run: |
        docker build -t ${{ env.DOCKER_IMAGE }}:${{ github.sha }} .
        docker tag ${{ env.DOCKER_IMAGE }}:${{ github.sha }} ${{ env.DOCKER_IMAGE }}:latest
      working-directory: centralized-dashboard/centralized-core
        
    - name: Log in to Docker Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v3
      with:
        registry: ${{ env.DOCKER_REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Push Docker image
      if: github.event_name != 'pull_request'
      run: |
        docker push ${{ env.DOCKER_IMAGE }}:${{ github.sha }}
        docker push ${{ env.DOCKER_IMAGE }}:latest
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: centralized-dashboard/centralized-core/target/
        retention-days: 7
EOF
}

# Function to create test.yml
create_test_yml() {
    cat > "$SERVICE_PATH/.github/workflows/test.yml" << 'EOF'
name: Test centralized-core Service

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  JAVA_VERSION: '17'
  SERVICE_NAME: centralized-core

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
      
    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2
        
    - name: Run unit tests
      run: mvn test -Dtest="**/unit/**"
      working-directory: centralized-dashboard/centralized-core
      env:
        SPRING_PROFILES_ACTIVE: test
        
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Unit Test Results
        path: centralized-dashboard/centralized-core/target/surefire-reports/*.xml
        reporter: java-junit
EOF
}

# Function to create code-quality.yml
create_code_quality_yml() {
    cat > "$SERVICE_PATH/.github/workflows/code-quality.yml" << 'EOF'
name: Code Quality Check - centralized-core

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  JAVA_VERSION: '17'
  SERVICE_NAME: centralized-core

jobs:
  code-quality:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Set up JDK ${{ env.JAVA_VERSION }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ env.JAVA_VERSION }}
        distribution: 'temurin'
        
    - name: Cache SonarCloud packages
      uses: actions/cache@v3
      with:
        path: ~/.sonar/cache
        key: ${{ runner.os }}-sonar
        restore-keys: ${{ runner.os }}-sonar
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2
        
    - name: Run SpotBugs
      run: mvn spotbugs:check
      working-directory: centralized-dashboard/centralized-core
      
    - name: Run Checkstyle
      run: mvn checkstyle:check
      working-directory: centralized-dashboard/centralized-core
      
    - name: Run PMD
      run: mvn pmd:check
      working-directory: centralized-dashboard/centralized-core
      
    - name: Analyze with SonarCloud
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      run: mvn verify sonar:sonar -Dsonar.projectKey=exalt_centralized-core
      working-directory: centralized-dashboard/centralized-core
      
    - name: Check code coverage
      run: |
        mvn jacoco:report
        echo "Code coverage report generated"
      working-directory: centralized-dashboard/centralized-core
      
    - name: Upload code coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: centralized-dashboard/centralized-core/target/site/jacoco/jacoco.xml
        flags: unittests
        name: codecov-centralized-core
EOF
}

# Function to create security-scan.yml
create_security_scan_yml() {
    cat > "$SERVICE_PATH/.github/workflows/security-scan.yml" << 'EOF'
name: Security Scan - centralized-core

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan on Sundays

env:
  SERVICE_NAME: centralized-core

jobs:
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
      working-directory: centralized-dashboard/centralized-core
      
    - name: Upload dependency check results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: dependency-check-report
        path: centralized-dashboard/centralized-core/target/dependency-check-report.html
        
  container-scan:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Build Docker image
      run: docker build -t centralized-core:scan .
      working-directory: centralized-dashboard/centralized-core
      
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'centralized-core:scan'
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
        languages: java
        
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
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
EOF
}

# Function to create deploy-development.yml
create_deploy_development_yml() {
    cat > "$SERVICE_PATH/.github/workflows/deploy-development.yml" << 'EOF'
name: Deploy to Development - centralized-core

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
  SERVICE_NAME: centralized-core
  DOCKER_REGISTRY: ghcr.io
  DOCKER_IMAGE: ghcr.io/${{ github.repository_owner }}/centralized-core
  KUBE_NAMESPACE: centralized-dashboard-dev
  DEPLOYMENT_NAME: centralized-core-deployment

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
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ secrets.AWS_DEFAULT_REGION }}
        
    - name: Configure kubectl
      uses: aws-actions/amazon-eks-update-kubeconfig@v1
      with:
        cluster-name: ${{ secrets.EKS_CLUSTER_NAME }}
        
    - name: Determine deployment version
      id: version
      run: |
        if [ "${{ github.event.inputs.version }}" == "latest" ] || [ -z "${{ github.event.inputs.version }}" ]; then
          echo "version=${{ github.sha }}" >> $GITHUB_OUTPUT
        else
          echo "version=${{ github.event.inputs.version }}" >> $GITHUB_OUTPUT
        fi
        
    - name: Update Kubernetes deployment
      run: |
        kubectl set image deployment/${{ env.DEPLOYMENT_NAME }} \
          centralized-core=${{ env.DOCKER_IMAGE }}:${{ steps.version.outputs.version }} \
          -n ${{ env.KUBE_NAMESPACE }}
          
    - name: Wait for rollout to complete
      run: |
        kubectl rollout status deployment/${{ env.DEPLOYMENT_NAME }} \
          -n ${{ env.KUBE_NAMESPACE }} \
          --timeout=600s
          
    - name: Verify deployment
      run: |
        kubectl get pods -l app=centralized-core -n ${{ env.KUBE_NAMESPACE }}
        kubectl get services -l app=centralized-core -n ${{ env.KUBE_NAMESPACE }}
        
    - name: Run smoke tests
      run: |
        SERVICE_URL=$(kubectl get service centralized-core-service -n ${{ env.KUBE_NAMESPACE }} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
        echo "Service URL: $SERVICE_URL"
        
        # Basic health check
        curl -f -s -o /dev/null -w "%{http_code}" http://$SERVICE_URL/actuator/health || exit 1
        
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
            target_url: `https://${process.env.SERVICE_URL}`,
            description: 'Deployment completed successfully'
          });
          
    - name: Send notification
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: |
          Deployment ${{ job.status }} for centralized-core
          Version: ${{ steps.version.outputs.version }}
          Environment: Development
          Actor: ${{ github.actor }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
EOF
}

echo "Generating workflows for centralized-core..."
create_build_yml
create_test_yml
create_code_quality_yml
create_security_scan_yml
create_deploy_development_yml
echo "✅ Generated workflows for centralized-core"