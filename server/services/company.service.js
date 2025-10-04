"use strict";

const config = require('../config/config')
const monk = require('monk');
const db = monk(config.kMongoDb)

//const nodemailer = require("nodemailer")
//const smtpTransport = require('nodemailer-smtp-transport');
//const util = require('util');
const departmentsTable = db.get('departments')
const companiesTable = db.get('companies')


    


exports.createDepartment = async (p_department)=>{
  //{id:, name:, company: }
  
  //console.log('68: createTicket()')
  /*
  const ticket = await Tickets.create({
    department,
    product,
    description,
    solution,
    user: req.user.id,
    status: 'new'
  })
  */
 if(p_department && p_department.id && p_department.name && p_department.company && p_department.usename){

  
  let existing = await departmentsTable.findOne({id:p_department.id})
 if(existing && existing.id){
     console.log(`department ${existing.id} exists!`)
     res.status(201).json(existing)
}

 await departmentsTable.insert({
    id: p_department.company.id,
    name: p_department.name,
    username:p_department.username, 
    company: p_department.company,

    members:[],
    products:[]
  })


  const department = await departmentsTable.findOne({id:p_department.id})
 

  //console.log('78: createDepartment()')

  //res.status(201).json(department)
  return {statusCode:200, data:department}
 }
 
  return {statusCode:500}
 
 
  
}

exports.createCompany = async (p_company)=>{
  //{id:, name:, username:}
  
  //console.log('68: createTicket()')
  /*
  const ticket = await Tickets.create({
    department,
    product,
    description,
    solution,
    user: req.user.id,
    status: 'new'
  })
  */
 if(p_company && p_company.id && p_company.name && p_company.username){

  
  let existing = await companiesTable.findOne({id:p_company.id})
 if(existing && existing.id){
     console.log(`department ${existing.id} exists!`)
     res.status(201).json(existing)
}

 await companiesTable.insert({
    id:p_company.id,
    name: p_company.name,
    username: p_company.username,
    verified: false,
    departments:[],
    
  })


  const company = await companiesTable.findOne({id:p_company.id})
 

  //console.log('78: createDepartment()')

  //res.status(201).json(department)
  return {statusCode:200, data:company}
 }
 
  return {statusCode:500}
 
 
  
}
