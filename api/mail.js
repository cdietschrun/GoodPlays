import nodemailer from 'nodemailer';
import 'dotenv/config';

async function main() {

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(`smtps://${process.env.GOOGLE_EMAIL_ACCOUNT}:${process.env.GOOGLE_SMTP_APP_PASSWORD}@smtp.gmail.com`);
 
// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"GoodPlays" <noreply@goodplays.com>', // sender address
    to: 'foo@foo.com', // list of receivers
    subject: 'Hello ✔ test', // Subject line
    text: 'Hello I sent this from code 🐴', // plaintext body
    html: '<b>cool cool, i want to send out periodic "your <weekly/monthly/yearly> playtime summary" 🐴</b>' // html body
};
 
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

}

main().catch(err => {
    console.error(err.message);
    process.exit(1);
});