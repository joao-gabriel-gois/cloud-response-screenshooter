# Cloud-Response Screenshooter

##### _Simple Rest API project to test websites behavior once called by a cloud provider_ 
---
### Current Version:
* It was required in work to test one costumer endpoint when called by a cloud provider to check its response.
* I personally was challenged to proove to non-tech folks that customer's endpoint was returning 403 (Forbidden).
* To fullfil it properly, simpler way was to take a screenshot of the home screen, like bellow:

  <img style="width:100%" src="https://suporte.hostgator.com.br/hc/article_attachments/30815023887507"></img>

### GitHub Actions
* This simple API project became useful to test some simple CI workflows, mainly for study purpose
* Anyway, for this API specifically it was useful once we need lower-level dependencies (outside package.json), such as Chromium for puppeteer
* Any new feature in future, though, can take vantage of the fact that workflow is already set
* <u>This CI flow is ready and working already, but there is a few previous steps before running it on ec2 instances</u>. <strong>Check build topic bellow</strong>

### Building
* To run this CI flow, first is necessary to set env variables in github actions, like: `SSH_HOST`, `SSH_USER`, `SSH_PORT` and `SSH_KEY`
* Make sure you have correctly set the private key on github actions and added the .pub version of it in authorized_keys file in ec2 instance
* Set up reverse proxy with NGINX to redirect requests coming to 80/443 ports to the port your docker service is running
* After that, copy your vesion of .env file (of node project, check `.example.env` file to create a proper .env one) in `/root/.my_env/` with the following commands:
  ```(bash)
  scp -i <aws-cert-file>.pem ~/<path/to>/.env <user>@<ec2-ip-or-domain>:.env
  ssh -i <aws-cert-file>.pem <user>@<ec2-ip-or-domain>
  # once logged in, do the following:
  sudo mkdir /root/.my_env
  sudo mv ~/.env /root/.my_env
  exit
  ```
* Now you can finally push your branch to main and the CI flow will work as expected.

### Tech Decisions:
* As it is a very simple project, Puppeteer and Amazon SDK (for S3 integration) as main logic 3r party providers, Express for WebServer, docker and NGINX for reversed proxy on AWS EC2 side fulfilled the needs
--- 
## API Reference
  * **Routes**:

    ```
    GET /:url HTTP/1.1

    curl https://<base-URL>/google.com
    ```
    * Response (*successful case*) :
      ```(json)
        {
          "updated": true,
          "img_url": "https://<bucket-name>.s3.sa-east-1.amazonaws.com/image-sample-google-com.png"
        }
      ```
    * Response (*exception case*):
      ```
      {
        "updated": false,
        "reason": "Error: Not able to go to url https://google.fake.com"
      }
      ```  
