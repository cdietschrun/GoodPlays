import nodemailer from 'nodemailer';
import 'dotenv/config';

export default async function mailDaily(text, html)
{
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(`smtps://${process.env.GOOGLE_EMAIL_ACCOUNT}:${process.env.GOOGLE_SMTP_APP_PASSWORD}@smtp.gmail.com`);

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"GoodPlays" <noreply@goodplays.com>', // sender address
        to: 'foo@gmail.com', // list of receivers
        subject: 'Daily GoodPlays summary', // Subject line
        text: text,
        html: html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info)
    {
        if (error)
        {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

}