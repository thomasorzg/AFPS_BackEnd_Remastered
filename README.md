# Getting started 

# v16.14.2
# Use latest version(recommended)

## Project setup

## Navigate inside the Server Directory
`````
cd Server
`````

`````
npm install
`````

## Set your sensitive information in your .env file (use the .env.example as an example);
`````
PORT=8080
HOST_URL=http://localhost:8080/
APP_TITLE=AFPS

#postgresql database config - Required
DB_HOST=
DB_USER=
DB_PASS=
DB_DATABASE=

#Sendgrid details for sending email - Optional
SENDGRID_API_KEY=
SENDGRID_SENDER=

#Google details for google login - Optional
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

#Twilio details for sending OTP in phone - Optional
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SENDER=

#Optional
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
`````

## Run
`````
npm start
`````

## Usage
`````
Open http://localhost:8080/
`````
