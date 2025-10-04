'use strict';


//const notificationsWorker = require('./workers/notificationsWorker');
//const moment = require('moment');
const EmailService = require('./services/email.service')

async function run(){
    //const CasesService = require('./services/cases.service');
    //const AccountService = require('./services/account.service');
    let email = {
          
        from:'support@physicianreviewservices.com',
        to: 'rquidilig@gmail.com',
        subject: 'TEST',
        //body:`Dear Dr. X
        body: `
        <p>Hi,</p>
        
        <p>TEST</p>`
      }

let result = await EmailService.send2(email)

console.log(`result=${JSON.stringify(result,null,4)}`)


  }
  
  run()