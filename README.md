# How to Run the Project

### 1. Install the required node_modules

```bash
  npm i
```

### 2. Create Supabase account

For authentication we are using "Supabase", make sure to follow this [doc](https://breezy-homegrown-077.notion.site/Supabase-Account-Creation-and-Google-OAuth-Setup-1906736d8221808ca7abf555b44951c8) to setup Supabase properly.

- We are primarily using this to store passwords and for social-signups.

### 3. Add `.env` file at the root level with below contents

```bash
# Database Configuration
DB_PATH=[mongo uri]
BACKUP_PATH=[db backup path for cron]
LOCAL_DB_FILE=[backup file]

# Server Configuration
NODE_ENV=[development/staging/production]
PORT=8000
CRON_PORT=8001
HOST=localhost:8000
FRONTEND_HOST="localhost:3000"
FRONTEND_INVITE_URL="http://localhost:3000/signup"
JWT_SECRET=xxxxx

# Request time-out (in milliseconds)
REQUEST_TIMEOUT=[required if you want to cancel http requests if they cross certain amount of time]

# Number of test data
NUM_TEST_DATA=[required if you want to run tests]

# Stripe Keys
STRIPE_SECRET_KEY=[required only if you want to use stripe service]
STRIPE_ACCOUNT_ID=[required only if you want to use stripe service]
# local/Staging environment
STRIPE_WEBHOOK_SECRET=[required only if you want to use stripe service]
STRIPE_CONNECT_WEBHOOK_SECRET=[required only if you want to use stripe service]
STRIPE_PAYMENT_WEBHOOK_SECRET=[required only if you want to use stripe service]

# Sendgrid Keys
SENDGRID_API_KEY=[required only if you want to send emails]
SENDGRID_USER_EMAIL=[required only if you want to send emails]
SENDGRID_TEST_EMAIL=[developer email for development environment]

# Amazon S3 Keys
S3_BUCKET_REGION=[s3 bucket region]
S3_BUCKET_NAME=[s3 bucket name]
S3_USER_KEY=[s3 user key]
S3_USER_SECRET=[s3 user secret]
AWS_LOG_GROUP_NAME=[aws log grop name eg. production]

# Apple Client Keys
APPLE_CLIENT_ID=[apple cliend id web]
APPLE_CLIENT_ID_IOS=[apple client id ios]

# Twilio Keys
TWILIO_NUMBER=[twilio number]
TWILIO_ACCOUNTSID=[twilio account sid]
TWILIO_AUTHTOKEN=[twilio auth token]

# Slack Webhook
SLACK_WEBHOOK_FOR_LOGS=[follow the steps mentioned in slack incoming webhook url section to get the webhook url]

# Get stream keys
GET_STREAM_MESSAGING_KEY=xxxxx
GET_STREAM_MESSAGING_SECRET=xxxxx

# Supabase keys
SUPABASE_URL=[follow the steps mentioned in supabase section to get the url]
SUPABASE_SERVICE_KEY=[follow the steps mentioned in supabase section to get the service key]
```

### 4. Compile project

Start the project: Local

```bash
 npm run dev
```

Build and start the project: Production

```bash
 npm run build
 npm run start
```

### 5. Running Test Cases

```bash
npm run test
```

### 6. Create slack incoming webhook url

Head over to slack and to go to apps section.

Now serch for 'Incoming webhook'.

Click 'Add', this will take you to slack store.
![add incoming webhook to app](https://res.cloudinary.com/dhdv5nqpb/image/upload/v1645159501/Project%20generator%20documentation%20assets/c3ngun4mpfl7yc1jc0qj.png)

Click 'Add to slack'
![add to slack](https://res.cloudinary.com/dhdv5nqpb/image/upload/v1645159644/Project%20generator%20documentation%20assets/pxctu2aermhzijinwpwv.png)

Select the channel where you want to receive the messages.
![select channel](https://res.cloudinary.com/dhdv5nqpb/image/upload/v1645159839/Project%20generator%20documentation%20assets/nomoftabritwm4xdlxsl.png)

You will now get the webhook url, copy and paste it in your .env.
![webhook url](https://res.cloudinary.com/dhdv5nqpb/image/upload/v1645160169/Project%20generator%20documentation%20assets/gvh3ljw6ubzr0m5cvacn.png)

You can also change the webhook settings from that page itself if required.
