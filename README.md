kul-b-e Homework
==================================

Getting Started
---------------

Run using npm
```sh
# clone it
git clone git@github.com:fahadbillah/kul-b-e.git
cd kul-b-e

# Install dependencies
npm install

# Start development live-reload server
PORT=3000 npm run dev

# Start production server:
PORT=3000 npm start
```

Run using docker
------
```sh
git clone git@github.com:fahadbillah/kul-b-e.git
cd kul-b-e

# Build your docker
docker build -t kulbe .

# run your docker
docker run -p 3000:3000 kulbe

```

## Postman Link

Instead of using mocha/chai I used postman to test api.

[Api Test Link](https://www.getpostman.com/collections/908e0eb922717a681cb4) : Use this postman link to add/edit pet to KUL-B-E

## GraphQL Link

go to `http://localhost:3000/api/v1/query` route to check GraphQL using GraphiQL

### Some GraphQL Queries
```
{
  owner (_id: String) {
    _id
    name
    email
    address
    phone
    pets (start: int, end: int) {
      info
    }
  }
}

{
  owners (start: int, end: int) {
    _id
    name
    email
    address
    phone
    pets (start: int, end: int) {
      info
    }
  }
}

{
  pet (_id: String) {
    _id
    name
    color
    breed
    owner
    info
    age
  }
}

{
  pets (start: int, end: int) {
    _id
    name
    color
    breed
    owner
    info
    age
  }
}


```
