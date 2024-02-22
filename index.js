const express = require('express');
const app = express();
const amqp = require('amqplib');

const QUEUE_NAME = 'messages';

// Middleware to parse JSON bodies
app.use(express.json());

// RabbitMQ connection string
const RABBITMQ_URL = 'amqp://rabbitmq:rabbitmq@localhost';

// Send message endpoint
app.post('/send', async (req, res) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert the queue
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    // Send message to the queue
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(req.body)));

    // Close the connection
    await channel.close();
    await connection.close();

    res.send('Message sent to RabbitMQ');
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    res.status(500).send('Error sending message to RabbitMQ');
  }
});

// Receive message endpoint
app.get('/receive', async (req, res) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert the queue
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    // Consume messages from the queue
    await channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        // Acknowledge the message
        channel.ack(msg);
        res.json(JSON.parse(msg.content.toString()));
      }
    });

    // Close the connection
    // This will be done after receiving a message
  } catch (error) {
    console.error('Error receiving message from RabbitMQ:', error);
    res.status(500).send('Error receiving message from RabbitMQ');
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
