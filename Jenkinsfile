pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        EC2_USER = "ec2-user"
        EC2_IP = "18.169.105.246"
        EC2_PATH = "/var/www/userapp"
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
                sh 'node install node'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy to EC2') {
            when {
                expression { currentBuild.currentResult == "SUCCESS" }
            }
            steps {
                script {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "mkdir -p ${EC2_PATH}"

                        scp -o StrictHostKeyChecking=no -r * ${EC2_USER}@${EC2_IP}:${EC2_PATH}

                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "
                            cd ${EC2_PATH} &&
                            npm install &&
                            pm2 stop userapp || true &&
                            pm2 start server.js --name userapp
                        "
                    """
                }
            }
        }
    }

    post {
        success {
            emailext (
                subject: "SUCCESS: Node.js CI/CD Pipeline Passed",
                body: "Build + Tests + Deployment succeeded.",
                to: "tiwarisaurabh706@gmail.com"
            )
        }

        failure {
            emailext (
                subject: "FAILED: Node.js CI/CD Pipeline Failed",
                body: "Build or deployment error. Check Jenkins logs.",
                to: "tiwarisaurabh706@gmail.com"
            )
        }
    }
}
