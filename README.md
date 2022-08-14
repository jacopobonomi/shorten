# SHORTEN

Simple shortener service with DynamoDB, Express and nanoid.

Features:

- DynamoDB with AWS SDK as database provider (no configuration)
- Create (same api for update) short URL
- Delete short URL
- Swagger documentation
- Clustering mode (for high traffic)
- Redirects
- Caching for redirects on memory with custom TTL
- Rate limit on apis
- Error handling
- Compression response with gzip
- nanoID generator

## Start

```bash
git clone <repo>
cd <repo>
yarn install
yarn start
```

## Development

```bash
git clone <repo>
cd <repo>
yarn install
yarn start:dev
```

## Cluster start

```bash
git clone <repo>
cd <repo>
yarn install
yarn start:cluster
```

TODO:

- Authentication with API Key for POST/DELETE/PUT
- Add readble slug for short URL optional parameter
- Add domain on model, to manage multiple domains
- Manage wrapper to run on Lambda AWS
- Add analytics for short URL
- Add auto exctract short slug from redirect url
- Add another provider for database (Redis, MongoDB, Firebase(?))>
