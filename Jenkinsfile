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

        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install jest'
        //     }
        // }

        // stage('Run Tests') {
        //     steps {
        //         sh 'npm test'
        //     }
        // }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step configured"'
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key',
                    keyFileVariable: 'SSH_KEY')]) {

                    // echo "🔐 Using SSH key located at: $SSH_KEY"
                    // Clean workspace before copying
                    sh 'rm -rf node_modules'

                    sh """
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} \
                        'mkdir -p ${EC2_PATH} &&
                         sudo chown -R ${EC2_USER}:${EC2_USER} ${EC2_PATH}'
                    """

                    sh """
                        scp -i $SSH_KEY -o StrictHostKeyChecking=no -r ./* \
                        ${EC2_USER}@${EC2_HOST}:${EC2_PATH}
                    """

                    sh """
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            
                            cd ${EC2_PATH} || { echo "❌ Failed to CD into ${EC2_PATH}"; exit 1; }

                            echo "📦 Installing dependencies..."
                            npm install --production || { echo "❌ NPM install failed"; exit 1; }

                            echo "🚀 Restarting PM2 app..."
                            if pm2 list | grep -q userapp; then
                                pm2 restart userapp;
                            else
                                pm2 start server.js --name userapp;
                            fi
                        '
                    """
                }
            }
        }
    }
    // post {
    //     success {
    //         mail to: 'tiwarisaurabh706@gmail.com',
    //              subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
    //              body: "Deployment completed successfully.\n\nBuild logs: ${env.BUILD_URL}"
    //     }

    //     failure {
    //         mail to: 'tiwarisaurabh706@gmail.com',
    //              subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
    //              body: "Build or Deployment failed.\n\nCheck logs: ${env.BUILD_URL}"
    //     }
    // }
}
