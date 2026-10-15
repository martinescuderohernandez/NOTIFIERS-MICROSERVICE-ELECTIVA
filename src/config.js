// ============================================================================
// Notifier Microservice — Configuration
// Loads environment variables for Kafka (Aiven), Brevo SMTP, and Express.
// ============================================================================
require('dotenv').config();

const config = {
  // Express
  port: parseInt(process.env.PORT || '8001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Kafka (Aiven)
  kafka: {
    enabled: process.env.KAFKA_ENABLED !== 'false',
    brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'notifier-service',
    groupId: process.env.KAFKA_GROUP_ID || 'notifier-service-group',
    ssl: {
      enabled: (process.env.KAFKA_SECURITY_PROTOCOL || 'SSL') === 'SSL',
      caPath: process.env.KAFKA_SSL_CAFILE || null,
      certPath: process.env.KAFKA_SSL_CERTFILE || null,
      keyPath: process.env.KAFKA_SSL_KEYFILE || null,
    },
    topics: {
      userCreated: process.env.KAFKA_TOPIC_USER_CREATED || 'user-created-topic',
      userUpdated: process.env.KAFKA_TOPIC_USER_UPDATED || 'user-updated-topic',
      userDeleted: process.env.KAFKA_TOPIC_USER_DELETED || 'user-deleted-topic',
      accountCreated: process.env.KAFKA_TOPIC_ACCOUNT_CREATED || 'account-created-topic',
    },
  },

  // Brevo SMTP
  smtp: {
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@example.com',
    fromName: process.env.SMTP_FROM_NAME || 'Sistema de Notificaciones',
  },

  // Brevo HTTP API (HTTPS:443). Preferred over SMTP because Render free tier
  // blocks outbound SMTP ports (25, 465, 587).
  brevo: {
    apiKey: process.env.BREVO_API_KEY || '',
    apiUrl: process.env.BREVO_API_URL || 'https://api.brevo.com/v3/smtp/email',
  },
};

module.exports = config;
