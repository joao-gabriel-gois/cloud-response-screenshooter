require('dotenv').config();

module.exports = {
  apps : [
    {
      name: "my-cli-browser",
      script: "node ~/my-cli-browser/dist/main.js",
      watch: true,
      instance_var: "MY_CLI_BROWSER",
      env: {
        "PORT": process.env.PORT,
        "AWS_BUCKET": process.env.AWS_BUCKET,
        "AWS_BUCKET_REGION": process.env.AWS_BUCKET_REGITON,
        "AWS_BUCKET_URL": process.env.AWS_BUCKET_URL
      }
    }
  ]
}
