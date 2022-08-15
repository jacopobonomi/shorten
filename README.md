[![](https://i.ibb.co/XC8sJYY/1.png)](https://i.ibb.co/XC8sJYY/1.png)

#### **Simple self hosted, open source**, shorten link service written in Node(Typescript) using DynamoDB (build folder 36kb)

## Features

- [x] DynamoDB with AWS SDK as database provider (no configuration) ✅
- [x] Create (same api for update) short URL ✅
- [x] Delete short URL ✅
- [x] Swagger documentation (/links/docs) ✅
- [x] Clustering mode (for high traffic) ✅
- [x] Redirects ✅
- [x] Loggin with morgan ✅
- [x] Caching for redirects on memory with custom TTL ✅
- [x] Rate limit on apis ✅
- [x] Error handling ✅
- [x] Compression response with gzip ✅
- [x] nanoID generator ✅

## Configuration

```bash
cp .env.example .env
```

Edit .env with yours following variables:

```
PORT - port to listen on
BASE_URL - base url for shortener service
AWS_REGION - AWS region
LINKS_TABLE_NAME - DynamoDB table name for links
CACHE_TTL - cache TTL for redirects in seconds (default: 60)
```

To use DynamoDB on you machine you need to install AWS SDK and configure it:

```bash
npm install -g aws-sdk
aws configure
```

and set your region and credentials.

### Start

```bash
git clone https://github.com/jacopobonomi/shorten
cd shorten
yarn install
yarn start
```

### Development

```bash
git clone https://github.com/jacopobonomi/shorten
cd shorten
yarn install
yarn start:dev
```

### Cluster start

```bash
git clone https://github.com/jacopobonomi/shorten
cd shorten
yarn install
yarn start:cluster
```

## Server

Use Nginx to manage reverse proxy, certficate and custom domain.
And use pm2 to start cluster mode.

```bash
pm2 start -1 <NODES_NUMBER> yarn start:
```

## Todo

- [x] Authentication with API Key for POST/DELETE/PUT
- [x] Add readble slug for short URL optional parameter
- [ ] Add domain on model, to manage multiple domains
- [ ] Manage wrapper to run on Lambda AWS
- [ ] Add analytics for short URL
- [ ] Add auto exctract short slug from redirect url
- [ ] Add another provider for database (Redis, MongoDB, Firebase(?))>
- [ ] GUI (SolidJS)?
