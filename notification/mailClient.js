var nodemailer = require('nodemailer')
// var smtpTransport = require('nodemailer-smtp-transport');

const mailClient = {}
mailClient.sendEmail = function (mail) {
  return new Promise((resolve, reject) => {
    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASS
      }
    }

    var transporter = nodemailer.createTransport(smtpConfig)
    var mailOptions = {
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      // text: 'this is some text', //, // plaintext body
      html: mail.buildHtmlText()
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject()
      } else {
        console.log('Message sent: ' + info.response)
        resolve()
      }
    })
  })
}

module.exports = mailClient
