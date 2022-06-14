# My CLI Browser

##### _Simple Rest API project to test websites behavior once called by a cloud provider_ 
---
### Current Version:
* It was required in work to test one costumer endpoint when called by a cloud provider to check its response
* To fullfil it properly, simpler way was to take a screenshot of the home screen

  **Possible new features**:

  * Next upgrades can bring more detail about response, but for first approach screenshot fulfilled our needs
  * Once it is already set for handling as brow

### GitHub Actions
* This simple API project became useful to test some simple CI workflows, mainly for study purpose
* Anyway, for this API specifically it was useful once we need lower-level dependencies (outside package.json), such as Chromium
* Any new feature in future, though, can take vantage of the fact that workflow is already set

### Tech Decisions:
* As it is a very simple project, Puppeteer and Amazon SDK (for S3 integration) as main logic provider, Express for WebServer and NGINX for reversed proxy on AWS EC2 side fulfilled the needs
--- 
## API Reference
  * **Routes**:

    ```
    GET /:url HTTP/1.1

    curl https://my-cli-browser.buzzybit.com/google.com
    ```
    * Response (*successful case*) :
      ```(json)
        {
          "updated": true,
          "img_url": "https://aws-serpro-tests-screenshots.s3.sa-east-1.amazonaws.com/image-sample-google-com.png"
        }
      ```
    * Response (*exception case*):
      ```
      {
        "updated": false,
        "reason": "[my-cli-browser] Error: Not able to go to url https://google.fake.com"
      }
      ```  