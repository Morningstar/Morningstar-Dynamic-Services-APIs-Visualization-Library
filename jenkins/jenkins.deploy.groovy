pipeline {
    environment {
        gitUrl = "https://msstash.morningstar.com/scm/iwt/web-asset-library.git"
        branch = "develop"
        NON_PROD_PROFILE = "ecint-non-prod"
        NON_PROD_ASSUME_ROLE = "mstar-ecint-non-prod-deploy"
        NON_PROD_ACCOUNT_NUMBER = '856636874771'
        BUCKET_NAME_QA = '00946-qa-eu-west-1-web-ecint-hosting'
        BUCKET_NAME_STG = '00946-stg-eu-west-1-web-ecint-hosting' // Is this one being used?

        PROD_PROFILE = "ecint-prod"
        PROD_ASSUME_ROLE = "mstar-ecint-prod-deploy"
        PROD_ACCOUNT_NUMBER = '698280454319'
        BUCKET_NAME_UAT = '00946-uat-eu-west-1-web-ecint-hosting'
        BUCKET_NAME_PROD = '00946-prod-eu-west-1-web-ecint-hosting-primary'
    }

    // We set agent to none so we can run some stages (input or checkpoint) without an agent. This means those stages do not block an executor when they run.
    agent none
    stages {
        stage('Build storybook') {
            // redhat_linux&&!enjkslprdap6004
            agent {
                label  'redhat_linux'
            }
            steps {
                script {
                    sh "rm -rf web-asset-library"
                    sh "rm -rf ec-pipeline"
                    echo "checking out branch ${env.branch}"
                    sh "git clone --single-branch --branch ${env.branch} ${env.gitUrl}"
                    sh "git clone --single-branch --branch master https://msstash.morningstar.com/scm/ac/ec-pipeline.git"
                    
                    stash includes: 'ec-pipeline/deployscripts/*.py', name: 'deployscripts'
                    dir('ec-pipeline/mwc-deployscripts') {
                        docker.build('web-asset-library-components')
                    }

                    dir('web-asset-library') {
                        withDockerContainer(args: "-u jenkins -v ${HOME}:/data/jenkins", image: 'web-asset-library-components') {
                            sh 'yarn install --ignore-engines'
                            sh 'yarn test:unit'
                            sh 'yarn build-storybook'
                            sh "mv ./dist/storybook ./dist/build"
                        }
                        dir('dist') {
                            stash includes: "build/", name: 'deployFolder'
                        }
                    }
                    sleep: 5
                }
                deleteDir()
            }
        }
        stage('Sync folder to S3') {
            agent {
                label 'awsjenklinux'
            }
            steps {
                script {
                    unstash 'deployscripts'
                    sh "python3 ec-pipeline/deployscripts/awsjenkinsassumerole.py --profile ${env.NON_PROD_PROFILE} --account_id ${env.NON_PROD_ACCOUNT_NUMBER} --role_name ${env.NON_PROD_ASSUME_ROLE}"
                    unstash 'deployFolder'
                    sh "export AWS_SHARED_CREDENTIALS_FILE=.aws/credentials && aws s3 sync ./build/ s3://${env.BUCKET_NAME_QA}/web-asset-library/ --profile ${env.NON_PROD_PROFILE} --delete"

                }
                deleteDir()
            }
        }
    }

    post {
        success {
            emailext attachLog: true, body: "<p>${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p><br/><p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>", compressLog: true, recipientProviders: [upstreamDevelopers()], subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'", to: "arvind.waghmare@morningstar.com"
        }
        failure {
            emailext attachLog: true, body: "<p>${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p><br/><p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>", compressLog: true, recipientProviders: [upstreamDevelopers()], subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'", to: "arvind.waghmare@morningstar.com"
        }
    }
}