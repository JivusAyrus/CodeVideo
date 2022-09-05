# CodeVideo
CodeVideo is a product that helps you to make code explanation videos. It's quick and easy, so  anybody can create beautiful code videos without any hassle at all. It also lets you capture beautiful code images.

## Local Development Environment

1. Clone this [`Color Code Repository`](https://github.com/JivusAyrus/color-code) and `cd` into it.
2. Install dependencies by running, Compile typescript and run the web server  `npm install`.
    ```shell
    npm install
    npm run compile
    node color_codes.js
    ```
3. Clone this repository and `cd` into it.
4. Add .env in the root folder and the format of the env is shown below
    ```shell
    NODE_ENV='development'
    GOOGLE_CLIENT_ID=''
    GOOGLE_CLIENT_SECRET=''
    ```
    Google client id and client secret are auth credentials
5. Install the dependencies, setup the database and minio(object storage) and then run the project.


    ```shell
    npm install 
    npm run database
    npm run minio
    npm start
    ```
## Requirements
- Node version 16
- Docker/Docker Desktop
