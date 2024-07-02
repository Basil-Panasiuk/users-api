## Users API server

[LINK](https://users-api-production-1231.up.railway.app/)

## Exposed endpoints

- Creating of new user with full validation for requested body
  - name: 2-60 characters
  - email: RFC2822 format
  - phone: start with code of Ukraine +380 and has right length
  - position id: valid id from existed '/positions' route
  - photo: jpg/jpeg image, with resolution at least 70x70px and size must not exceed 5MB
  - require 'Token' request header which is exposed by '/token' route
- Paginated list of users with query params validation (page, count)
- Particular user's info by id route parameter
- List of positions available for users
- Token that is required to register a new user
  - JWT with Ttl = 40 minutes
  - valid for one user creation only

## Technical specifications

- Nest.js
- PostgreSQL
- Redis
- TypeORM
- Sharp, Tinypng
