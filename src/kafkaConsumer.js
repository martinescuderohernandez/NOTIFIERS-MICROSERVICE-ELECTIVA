
const { Kafka } = require('kafkajs');
const fs = require('fs');
const config = require('./config');
const handlers = require('./handlers');

let consumer = null;
let isConnected = false;


function createKafkaClient() {
  const kafkaConfig = {
    clientId: config.kafka.clientId,
    brokers: config.kafka.brokers,
    connectionTimeout: 10000,
    retry: {
      initialRetryTime: 1000,
      retries: 5,
    },
  };


  if (config.kafka.ssl.enabled) {
    const sslConfig = {
      rejectUnauthorized: true,
    };

    if (config.kafka.ssl.caPath && fs.existsSync(config.kafka.ssl.caPath)) {
      sslConfig.ca = [fs.readFileSync(config.kafka.ssl.caPath, 'utf-8')];
    }
    if (config.kafka.ssl.certPath && fs.existsSync(config.kafka.ssl.certPath)) {
      sslConfig.cert = fs.readFileSync(config.kafka.ssl.certPath, 'utf-8');
    }
    if (config.kafka.ssl.keyPath && fs.existsSync(config.kafka.ssl.keyPath)) {
      sslConfig.key = fs.readFileSync(config.kafka.ssl.keyPath, 'utf-8');
    }

    kafkaConfig.ssl = sslConfig;
  }

  return new Kafka(kafkaConfig);
}


async function routeMessage(topic, message) {
  try {
    const value = JSON.parse(message.value.toString());
    console.log(`[KafkaConsumer] Received message on topic '${topic}':`, JSON.stringify(value).substring(0, 200));

    switch (topic) {
      case config.kafka.topics.userCreated:
        await handlers.handleUserCreated(value);
        break;
      case config.kafka.topics.userUpdated:
        await handlers.handleUserUpdated(value);
        break;
      case config.kafka.topics.userDeleted:
        await handlers.handleUserDeleted(value);
        break;
      case config.kafka.topics.accountCreated:
        await handlers.handleAccountCreated(value);
        break;
      default:
        console.warn(`[KafkaConsumer] Unknown topic: ${topic}. Message ignored.`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`[KafkaConsumer] Invalid JSON on topic '${topic}':`, message.value?.toString()?.substring(0, 100));
    } else {
      console.error(`[KafkaConsumer] Error processing message on '${topic}':`, error.message);
    }

  }
}


async function startConsumer() {
  if (!config.kafka.enabled) {
    console.log('[KafkaConsumer] Kafka is DISABLED. Consumer not started.');
    return;
  }

  try {
    const kafka = createKafkaClient();
    consumer = kafka.consumer({ groupId: config.kafka.groupId });

    await consumer.connect();
    isConnected = true;
    console.log(`[KafkaConsumer] Connected to Kafka at ${config.kafka.brokers.join(', ')}`);


    const topics = Object.values(config.kafka.topics);
    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
      console.log(`[KafkaConsumer] Subscribed to topic: ${topic}`);
    }


    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const offset = message.offset;
        console.log(`[KafkaConsumer] Processing: topic=${topic} partition=${partition} offset=${offset}`);
        await routeMessage(topic, message);
      },
    });

    console.log('[KafkaConsumer] Consumer is running and waiting for messages...');
  } catch (error) {
    isConnected = false;
    console.error(`[KafkaConsumer] Failed to start consumer: ${error.message}`);
    console.error('[KafkaConsumer] Will retry connection in 10 seconds...');
    setTimeout(startConsumer, 10000);
  }
}


async function stopConsumer() {
  if (consumer) {
    try {
      await consumer.disconnect();
      isConnected = false;
      console.log('[KafkaConsumer] Consumer disconnected.');
    } catch (error) {
      console.error(`[KafkaConsumer] Error disconnecting: ${error.message}`);
    }
  }
}


function getConsumerStatus() {
  return isConnected;
}

module.exports = { startConsumer, stopConsumer, getConsumerStatus };
