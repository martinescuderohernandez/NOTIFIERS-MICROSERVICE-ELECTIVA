
function userCreatedTemplate(data) {
  const name = data.name || 'Usuario';
  return {
    subject: `¡Bienvenido/a, ${name}!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido/a!</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hola <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #555;">Tu cuenta ha sido creada exitosamente en nuestro sistema.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 5px 0; color: #444;"><strong>Email:</strong> ${data.email || 'N/A'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Rol:</strong> ${data.role || 'MEMBER'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Estado:</strong> ${data.status || 'ACTIVE'}</p>
          </div>
          <p style="font-size: 14px; color: #888;">Si no creaste esta cuenta, por favor contacta al administrador.</p>
        </div>
        <div style="background: #e9ecef; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">Sistema de Gestión de Usuarios — Electiva</p>
        </div>
      </div>
    `,
  };
}


function userUpdatedTemplate(data) {
  const name = data.name || 'Usuario';
  return {
    subject: `Tus datos fueron actualizados, ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Datos Actualizados</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hola <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #555;">Te informamos que tu información personal ha sido actualizada.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <p style="margin: 5px 0; color: #444;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Email:</strong> ${data.email || 'N/A'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Rol:</strong> ${data.role || 'N/A'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Estado:</strong> ${data.status || 'N/A'}</p>
          </div>
          <p style="font-size: 14px; color: #888;">Si no realizaste estos cambios, contacta al administrador inmediatamente.</p>
        </div>
        <div style="background: #e9ecef; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">Sistema de Gestión de Usuarios — Electiva</p>
        </div>
      </div>
    `,
  };
}


function userDeletedTemplate(data) {
  return {
    subject: 'Tu cuenta ha sido eliminada',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #434343 0%, #000000 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Cuenta Eliminada</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hola,</p>
          <p style="font-size: 16px; color: #555;">Te informamos que tu cuenta con ID <code>${data.id || 'N/A'}</code> ha sido eliminada de nuestro sistema.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #434343;">
            <p style="margin: 5px 0; color: #444;"><strong>Fecha de eliminación:</strong> ${data.deletedAt || new Date().toISOString()}</p>
          </div>
          <p style="font-size: 14px; color: #888;">Si crees que esto fue un error, contacta al administrador.</p>
        </div>
        <div style="background: #e9ecef; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">Sistema de Gestión de Usuarios — Electiva</p>
        </div>
      </div>
    `,
  };
}


function accountCreatedTemplate(data) {
  return {
    subject: `Tu cuenta bancaria ${data.account_type || ''} ha sido creada`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">¡Cuenta Bancaria Creada!</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hola,</p>
          <p style="font-size: 16px; color: #555;">Tu nueva cuenta bancaria ha sido creada exitosamente.</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #11998e;">
            <p style="margin: 5px 0; color: #444;"><strong>Número de cuenta:</strong> ${data.account_number || 'N/A'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Tipo:</strong> ${data.account_type || 'N/A'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Saldo inicial:</strong> ${data.balance || '0.00'} ${data.currency || 'COP'}</p>
            <p style="margin: 5px 0; color: #444;"><strong>Estado:</strong> ${data.status || 'ACTIVE'}</p>
          </div>
          <p style="font-size: 14px; color: #888;">Si no solicitaste esta cuenta, contacta al administrador.</p>
        </div>
        <div style="background: #e9ecef; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">Sistema de Gestión de Cuentas — Electiva</p>
        </div>
      </div>
    `,
  };
}

module.exports = {
  userCreatedTemplate,
  userUpdatedTemplate,
  userDeletedTemplate,
  accountCreatedTemplate,
};
