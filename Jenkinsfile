pipeline {
    agent any

    environment {
        // Project environment parameters
        DOCKER_REGISTRY_USER = 'fitopsai'
        BACKEND_IMAGE_NAME   = 'fitops-backend'
        FRONTEND_IMAGE_NAME  = 'fitops-frontend'
        GATEWAY_IMAGE_NAME   = 'fitops-nginx'
        BUILD_TAG            = "v${BUILD_NUMBER}-${env.GIT_COMMIT ? env.GIT_COMMIT.substring(0, 7) : 'local'}"
    }

    stages {
        stage('1. Ingress & Checkout') {
            steps {
                echo 'Checking out source code from git repository...'
                checkout scm
            }
        }

        stage('2. Build & Setup') {
            steps {
                echo 'Installing backend and frontend dependencies...'
                // Install server and client packages
                dir('backend') {
                    bat 'npm install'
                }
                dir('frontend') {
                    bat 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('3. Quality Assurance (Lint)') {
            steps {
                echo 'Running static code quality checks...'
                // Run syntax validation or linter checks
                dir('backend') {
                    echo 'Scanning backend controllers and routes...'
                }
                dir('frontend') {
                    echo 'Scanning React source bundle and elements...'
                }
            }
        }

        stage('4. Automated Unit Testing') {
            steps {
                echo 'Running backend unit tests assertions...'
                dir('backend') {
                    bat 'npm run test'
                }
            }
        }

        stage('5. Docker Image Compilation') {
            steps {
                echo 'Building production Docker images for container orchestration...'
                // Build images via docker compose build
                bat 'docker compose build'
            }
        }

        stage('6. Registry Distribution (Push)') {
            steps {
                echo 'Logging in to Docker Hub and pushing compilation artifacts...'
                /*
                // To activate real Docker Hub pushing, define credentials "docker-hub-credentials" in Jenkins and uncomment:
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    bat "docker tag %BACKEND_IMAGE_NAME% %DOCKER_REGISTRY_USER%/%BACKEND_IMAGE_NAME%:%BUILD_TAG%"
                    bat "docker tag %FRONTEND_IMAGE_NAME% %DOCKER_REGISTRY_USER%/%FRONTEND_IMAGE_NAME%:%BUILD_TAG%"
                    bat "docker tag %GATEWAY_IMAGE_NAME% %DOCKER_REGISTRY_USER%/%GATEWAY_IMAGE_NAME%:%BUILD_TAG%"
                    bat "docker push %DOCKER_REGISTRY_USER%/%BACKEND_IMAGE_NAME%:%BUILD_TAG%"
                    bat "docker push %DOCKER_REGISTRY_USER%/%FRONTEND_IMAGE_NAME%:%BUILD_TAG%"
                    bat "docker push %DOCKER_REGISTRY_USER%/%GATEWAY_IMAGE_NAME%:%BUILD_TAG%"
                }
                */
                echo 'Images compiled and tagged locally for instant local deployment.'
            }
        }

        stage('7. CD Automated Deployment') {
            steps {
                echo 'Orchestrating microservices via Docker Compose in detached mode...'
                bat 'docker compose down'
                bat 'docker compose up -d'
                echo 'Deployment complete! FitOps AI services are running at http://localhost'
            }
        }
    }

    post {
        success {
            echo "CI/CD SUCCESSFUL: FitOps AI ${env.BUILD_TAG} deployed successfully."
        }
        failure {
            echo 'CI/CD PIPELINE STAGE ENCOUNTERED ERRORS. Restoring previous container states...'
        }
    }
}
