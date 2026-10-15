// ============================================================================
// Notifier Microservice — Entry Point
// Express server + Kafka consumer startup
// ============================================================================
const express = require('express');
const config = require('./config');
const { initEmailService, sendEmail, getEmailMode } = require('./emailService');
const { startConsumer, stopConsumer, getConsumerStatus } = require('./kafkaConsumer');
const templates = require('./templates');

const app = express();
app.use(express.json());

// ── Health Check ──
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Notifier Microservice',
    kafka: {
      enabled: config.kafka.enabled,
      connected: getConsumerStatus(),
      brokers: config.kafka.brokers,
      topics: config.kafka.topics,
    },
    smtp: {
      host: config.smtp.host,
      port: config.smtp.port,
      from: config.smtp.fromEmail,
      configured: !!(config.smtp.user && config.smtp.pass),
      mode: getEmailMode(),
    },
    uptime: Math.floor(process.uptime()),
  });
});

// ── Root ──
app.get('/', (req, res) => {
  res.json({
    service: 'Notifier Microservice',
    status: 'online',
    version: '1.0.0',
    health: '/health',
    test: 'POST /notifications/test',
  });
});

// ── Test Endpoint — Send a test email without Kafka ──
app.post('/notifications/test', async (req, res) => {
  const { to, type } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Field "to" (email) is required.' });
  }

  const validTypes = ['user.created', 'user.updated', 'user.deleted', 'account.created'];
  const eventType = type || 'user.created';

  if (!validTypes.includes(eventType)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
  }

  // Generate sample data for test
  const sampleData = {
    id: 'test-user-001',
    name: 'Test User',
    email: to,
    role: 'MEMBER',
    status: 'ACTIVE',
    user_email: to,
    account_number: '100123456789',
    account_type: 'SAVINGS',
    balance: '50000.00',
    currency: 'COP',
    deletedAt: new Date().toISOString(),
  };

  const templateMap = {
    'user.created': templates.userCreatedTemplate,
    'user.updated': templates.userUpdatedTemplate,
    'user.deleted': templates.userDeletedTemplate,
    'account.created': templates.accountCreatedTemplate,
  };

  try {
    const template = templateMap[eventType](sampleData);
    const result = await sendEmail(to, template.subject, template.html);
    res.json({
      success: true,
      message: `Test email (${eventType}) sent to ${to}`,
      result: result?.simulated ? 'SIMULATED (SMTP not configured)' : `messageId: ${result?.messageId}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ── Start Server ──
async function start() {
  // 1. Initialize SMTP transporter
  initEmailService();

  // 2. Start Express server
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[Notifier] Server running on http://0.0.0.0:${config.port}`);
    console.log(`[Notifier] Environment: ${config.nodeEnv}`);
    console.log(`[Notifier] Health check: http://localhost:${config.port}/health`);
  });

  // 3. Start Kafka consumer (in background)
  startConsumer();
}

// ── Graceful Shutdown ──
async function shutdown(signal) {
  console.log(`\n[Notifier] Received ${signal}. Shutting down gracefully...`);
  await stopConsumer();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Start!
start().catch(error => {
  console.error('[Notifier] Fatal error:', error);
  process.exit(1);
});
