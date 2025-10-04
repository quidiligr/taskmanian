const userService = require('./services/user.service')
const companyService = require('./services/company.service')

const run = async () =>
{ 
    //await accountService.createAccount('peerlink','Peerlink.100.1!','Peerlink','rquidilig@peerlinkmedical.com','customer',true,'/data/medicals/CONTAINER/CONTAINER/Medicals')
    //await accountService.createAccount('rquidilig','rquidilig.100.1','Peerlink','rquidilig@peerlinkmedical.com','customer',true,'/data/uploads.peerxc.com/datastore/rquidilig')
    //await accountService.createAccount('robert','Peerlink.100.1!','Peerlink','ceo@peerlinkmedical.com','customer',true,'/data/uploads.peerxc.com/datastore/robert')
    //await accountService.createAccount('sam','Peerlink.100.1!','Peerlink','sam.yamini@peerlinkmedical.com','customer',true,'/data/uploads.peerxc.com/datastore/sam')
    //let result = await userService.registerUser('Taskmanian Admin','admin@taskmanian.com','Taskmanian.20241211!','Taskmanian','customer'.true)
    //let result = await userService.registerUser('Rom','rquidilig@gmail.com','Rom.20241211!','Cryptibuy',''.true)
    let result = await companyService.createCompany({id:'taskmanian',name:'Taskmanian', username:'rquidilig@gmail.com'})
console.log(`result= ${JSON.stringify(result)}`)
}

run()