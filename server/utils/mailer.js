const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Votre Gmail dans .env
    pass: process.env.EMAIL_PASS  // Votre "Mot de passe d'application" Google
  },
});

const sendVerificationEmail = (toEmail, code) => {
  return transporter.sendMail({
    from: `"E-SANTÉ" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Votre code de vérification E-Santé',
    html: `<div style="text-align:center;"><h2>Bienvenue !</h2><p>Voici votre code :</p>
           <h1 style="background:#f0f4f8; padding:20px; display:inline-block;">${code}</h1></div>`
  });
};

module.exports = sendVerificationEmail;