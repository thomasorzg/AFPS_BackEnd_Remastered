require("dotenv").config();
const test_ = require("../../config/test.config");
const authSender = process.env.SENDGRID_SENDER;
const authApiKey = process.env.SENDGRID_API_KEY;
const sgMail = require("@sendgrid/mail");
const EMAILS_PER_BATCH = 100; // Número de emails por lote

triggerEmailGateway = async (data) => {
  if (!process.env.SENDGRID_SENDER || !process.env.SENDGRID_API_KEY) {
    console.error("One or more Sendgrid credentials missing");
    return;
  }

  if (test_.email_reset_password) {
    return true;
  }

  if (!authSender || !authApiKey) {
    console.log("Please set sengrid in .env");
    throw TypeError("Please set sengrid in .env");
  }

  try {
    sgMail.setApiKey(authApiKey);
    const response = await sgMail.send(data);
    return response;
  } catch (error) {
    throw TypeError(error.response.body);
  }
};

exports.forgotPassword = async function forgotPassword(data) {
  if (!data.email) {
    throw TypeError("To email is required.");
  }

  const msg = {
    to: data.email,
    from: authSender,
    subject: `${process.env.APP_TITLE} Verification Code`,
    text: `Your verification code is ${data.token}.`,
  };

  const response = await triggerEmailGateway(msg);
  return response;
};

/**
 * Dispara el envío de correos electrónicos según los datos proporcionados.
 * @param {*} data - Objeto que contiene los datos del correo electrónico, incluidos los destinatarios, asunto y mensaje.
 * @returns {Promise} - Una promesa que se resuelve con las respuestas del envío de correos electrónicos.
 */
exports.trigger = async function trigger(data) {
  if (!data.emails || !data.subject || !data.message) {
    throw "emails, subject, message is required.";
  }

  let emails = [];
  if (data.recipientType === "specific") {
    emails = [data.specificEmail];
  } else if (data.recipientType === "members" || data.recipientType === "users") {
    emails = data.emails.split(",").map((email) => email.trim());
  }

  const batches = divideIntoBatches(emails, EMAILS_PER_BATCH);

  const sendEmailPromises = batches.map(async (batch) => {
    const sendEmailBatchPromises = batch.map((email) => {
      const msg = {
        to: email,
        from: authSender,
        subject: data.subject,
        text: data.message,
      };

      return triggerEmailGateway(msg);
    });

    return Promise.all(sendEmailBatchPromises);
  });

  const responses = await Promise.all(sendEmailPromises);

  return flattenArray(responses);
};

// Función para dividir un array en lotes más pequeños
function divideIntoBatches(array, batchSize) {
  const batches = [];
  let batch = [];
  for (let i = 0; i < array.length; i++) {
    batch.push(array[i]);
    if (batch.length === batchSize || i === array.length - 1) {
      batches.push(batch);
      batch = [];
    }
  }
  return batches;
}

// Función para aplanar un array de arrays en un solo array
function flattenArray(array) {
  return array.reduce((result, current) => result.concat(current), []);
}
