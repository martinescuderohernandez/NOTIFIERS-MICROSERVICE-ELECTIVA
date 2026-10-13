// ============================================================================
// Event Handlers — Process Kafka messages and send corresponding emails
// ============================================================================
const { sendEmail } = require('./emailService');
const templates = require('./templates');

/**
 * Handles a user.created event from the Users microservice.
 * Message format: { eventType: "user.created", data: { id, name, email, role, status, createdAt } }
 */
async function handleUserCreated(message) {
  const data = message.data || message;
  const email = data.email;

  if (!email) {
    console.warn('[Handler] user.created — No email in payload, skipping.');
    return;
  }

  const template = templates.userCreatedTemplate(data);
  await sendEmail(email, template.subject, template.html);
  console.log(`[Handler] user.created — Notification sent to ${email}`);
}

/**
 * Handles a user.updated event from the Users microservice.
 * Message format: { eventType: "user.updated", data: { id, name, email, role, status, updatedAt } }
 */
async function handleUserUpdated(message) {
  const data = message.data || message;
  const email = data.email;

  if (!email) {
    console.warn('[Handler] user.updated — No email in payload, skipping.');
    return;
  }

  const template = templates.userUpdatedTemplate(data);
  await sendEmail(email, template.subject, template.html);
  console.log(`[Handler] user.updated — Notification sent to ${email}`);
}

/**
 * Handles a user.deleted event from the Users microservice.
 * Message format: { eventType: "user.deleted", data: { id, deletedAt, email?, name? } }
 */
async function handleUserDeleted(message) {
  const data = message.data || message;
  const email = data.email;

  if (!email) {
    console.warn('[Handler] user.deleted — No email in payload (user already deleted from DB). Event logged only.');
    console.log('[Handler] user.deleted — Event data:', JSON.stringify(data));
    return;
  }

  const template = templates.userDeletedTemplate(data);
  await sendEmail(email, template.subject, template.html);
  console.log(`[Handler] user.deleted — Notification sent to ${email}`);
}

/**
 * Handles an ACCOUNT_CREATED event from the Accounts microservice.
 * Message format: { event: "ACCOUNT_CREATED", data: { id, account_number, user_id, user_email, account_type, balance, currency, status } }
 */
async function handleAccountCreated(message) {
  const data = message.data || message;
  const email = data.user_email;

  if (!email) {
    console.warn('[Handler] ACCOUNT_CREATED — No user_email in payload, skipping.');
    return;
  }

  const template = templates.accountCreatedTemplate(data);
  await sendEmail(email, template.subject, template.html);
  console.log(`[Handler] ACCOUNT_CREATED — Notification sent to ${email}`);
}

module.exports = {
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
  handleAccountCreated,
};
