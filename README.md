# node-todo-list



## Start locally

1. Install node packages
``` sh
npm install
```

2. Set env variable `MONGO_URI` with the connection string to MongoDB.

3. Run the server locally
``` sh
npm start
```

4. Server should be started and be available on [localhost:3000](http://localhost:3000)

### Available endpoints:
  - /POST `/api/todo`.  (creates a new todo item)
  - /GET `/api/todo`. (returns list of todo items)
  query params:
    * `done`  - filter out by done status. By default returns all items regardless of done status.
    * `limit` - limits results. by default return first 100 items
    * `page`  - returns data set for specific page
  - /PATCH `/api/todo/:id`. *marks specific item as DONE*
  - /DELETE `/api/todo/:id`. *deletes the item. (NOTE: used as a soft deletion, item marks as deleted)* 
  
## Tests
To run tests:
``` sh
npm test
```

## Protobuf support
Available protobuf shemas: [here](proto/todo.proto)

To GET any data as protobuf decoded you can use of next ways:
 - add `proto` query string to any link, e.g. `api/todo?proto`
 - add *Content-Type* `application/protobuf`
 
To POST data use Content-Type with specific message type. `application/protobuf; messageType=MESSAGE_TYPE`. Where *MESSAGE_TYPE* is a specific type from proto schema
