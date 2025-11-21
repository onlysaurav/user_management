pipeline {
    agent any

    tools {
        nodejs "Node_18"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/onlysaurav/user_management.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo "No build step required for Node.js API"
            }
        }

        stage('Deploy to Staging') {
            when {
                expression { currentBuild.currentResult == "SUCCESS" }
            }
            steps {
                sh '''
                    echo "Deploying application..."
                    pm2 stop userapp || true
                    pm2 start server.js --name userapp
                '''
            }
        }
    }

    post {
        success {
            emailext (
                subject: "SUCCESS: Jenkins Pipeline Passed",
                body: "The Jenkins pipeline completed successfully.",
                to: "tiwarisaurabh706@gmail.com"
            )
        }
        failure {
            emailext (
                subject: "FAILED: Jenkins Pipeline Failed",
                body: "The Jenkins pipeline has failed. Check Jenkins logs.",
                to: "tiwarisaurabh706@gmail.com"
            )
        }
    }
}
