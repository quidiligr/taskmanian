"use strict";

const monk = require('monk');
//const db = monk(config.kMongoDb)

const nodemailer = require("nodemailer")
const smtpTransport = require('nodemailer-smtp-transport');
const util = require('util');



    
exports.send2 = async function(mailInfo){

//  var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport ({
  host: 'mail.taskmanian.com',//'smtp.mandrillapp.com',//'mail.peerlinkmedical.com',
  
  
  secureConnection: true,
  port: 587,
  
  auth: {
        user: 'admin@taskmanian.com',
        pass: 'Rom@Taskmanian!'
  }
}));

/*
var transporter = nodemailer.createTransport(smtpTransport ({
    host: 'mail.peerlinkmedical.com',
    
    
    secureConnection: false,
    port: 25,
    
    auth: {
          user: 'support1@peerlinkmedical.com',
          pass: 'PXCPXC123!'
    }
  }));
  */

  
  var mailOptions = {
    from: mailInfo.from, //'Admin <admin@sharecle.com>',
    to: mailInfo.to,//'rquidilig@gmail.com',
    subject: mailInfo.subject, //'This is a test ',
        text: mailInfo['text'] != null ? mailInfo.text : '', //'Hello world ',
        html: mailInfo.body,//mailInfo.html,//'<b>Hello world </b>',
        tls: {
            rejectUnauthorized: false
        },
    };
/*
transporter.sendMail(mailOptions, function(error, info){
  if(error){
     console.log(error);
     return {status:400}
  }else{
  console.log('Message sent: ' + info.response);
  return {status:200}
  }
});
*/
  //var bc = util.promisify(transporter.sendMail)//util.promisify(req.files.photo.mv)
  let result = await transporter.sendMail(mailOptions)
  console.log(`send2() result= ${JSON.stringify(result)}`)
  if(result.error){
      console.log(`exports.send2() ${JSON.stringify(result.error)}`);
      return {statusCode:500}
   }else{
   //console.log('Message sent: ' + result.info.response);
   console.log('Message sent: ');
   return {statusCode:200}
   }
}
