pipeline {
    agent any

    environment {
        NODE_HOME = "/opt/homebrew/opt/node@20/bin"
        PATH = "${NODE_HOME}:${PATH}"

        EC2_USER = "ec2-user"
        EC2_HOST = "18.132.211.164"
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
                sh 'npm run build || echo "No build step configured"'
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', 
                    keyFileVariable: 'SSH_KEY')]) {

                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} 'mkdir -p ${EC2_PATH} && sudo chown -R ${EC2_USER}:${EC2_USER} ${EC2_PATH}'
                    """

                    sh """
                        scp -o StrictHostKeyChecking=no -r ./* ${EC2_USER}@${EC2_HOST}:${EC2_PATH}
                    """

                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd ${EC2_PATH} &&
                            npm install --production &&
                            pm2 restart all || pm2 start server.js --name userapp
                        '
                    """
                }
            }
        }
    }

    // post {
    //     success {
    //         mail to: 'tiwarisaurabh706@gmail.com',
    //              subject: "Jenkins Job SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
    //              body: "The build completed successfully.\n\nLogs: ${env.BUILD_URL}"
    //     }

    //     failure {
    //         mail to: 'tiwarisaurabh706@gmail.com',
    //              subject: "Jenkins Job FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
    //              body: "The build has FAILED.\n\nLogs: ${env.BUILD_URL}"
    //     }
    // }
}
