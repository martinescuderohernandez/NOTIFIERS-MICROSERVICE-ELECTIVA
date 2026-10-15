
const { sendEmail } = require('./emailService');
const templates = require('./templates');


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
