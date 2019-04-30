const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER, // Your email id
        pass: process.env.MAIL_PASS // Your password
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

const sendResetToken = (mail, token, username) => {
    var mailOptions = {
        from: 'vnscriptkid@gmail.com',
        to: mail,
        subject: "Reset Password Confirmation",
        text: `
        Hi ${username}! We had received a reset password request for your account!
        Please click on this link to reset ur password: http://${process.env.HOST_NAME}:${process.env.PORT}/reset/${token}
        `.trim(),
        html: `
        Hi ${username}! We had received a reset password request for your account!
        Please click on this link to reset ur password: <a href="http://${process.env.HOST_NAME}:${process.env.PORT}/reset/${token}">RESET NOW</a>
        `.trim()
    };
    return transporter.sendMail(mailOptions);
}

module.exports = {
    transporter,
    sendResetToken
};