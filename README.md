kul-b-e Homework
==================================

Getting Started
---------------

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

## Postman Link

[Api Test Link](https://www.getpostman.com/collections/908e0eb922717a681cb4) : Use this postman link to add edit pet to KUL-B-E

## GraphQL Link

[GraphQL Link](http://localhost:3000/api/v1/query) : use this link checkout GraphQL using GraphiQL

### Some of GraphQL
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
