### CDK script to deploy Symphony Infrastructure on AWS

### Environment Variables
Add these env variables:
- `AWS_ACCOUNT`: aws account id
- `AWS_REGION` : region to deploy
- `DOMAIN` : domain

### Initial Requirement
Requires a hosted zone for your domain: `DOMAIN`
  - create a hosted zone
  - point domain name servers to hosted zone name servers

### Install cdk
`npm install -g aws-cdk`


### Deploy 
run `cdk deploy`

Stack deploys the following resources:
  - ACM certificate
  - Route53 Record
    - certificate attached
  - VPC - Following resources deployed in the VPC
    - 2 availability zones: 2 subnets
    - Application Load Balancer
      - unsecure listener - redirects to HTTPS
      - certificate attached to secure listener
    - DynamoDb Table
    - RDS Database Instance
    - S3 Bucket
    - Elasticache Redis Cluster
    - Websocket Servers
      - cluster
      - task: 1 container
      - service
    - Dashboard Api Servers
      - cluster
      - task: 2 containers
      - service
    - Custom AWS Resource to initialize RDS schema
      - task: only run once during cdk deployment 


To remove all infrastructure: `cdk destroy`

    