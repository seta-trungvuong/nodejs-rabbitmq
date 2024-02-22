## Run Rabbit MQ docker container
```
docker compose up
```

## Start NodeJs App

```
npm i

node index.js
```

## Send Message to Rabbit MQ

```
curl -X POST -H "Content-Type: application/json" -d '{"message": "Hello, RabbitMQ!"}' http://localhost:3000/send
```

## Get Message Received from Rabbit MQ

```
curl http://localhost:3000/receive
```