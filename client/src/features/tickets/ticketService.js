import axios from 'axios'

const API_URL = '/api/tickets/'
//const API_URL_DEPARTMENTS = '/api/departments/'

// CreateTicket
const createTicket = async (ticketData,token) => {
  console.log(`8: client createTicket(ticketData= ${JSON.stringify(ticketData,null,4)} `)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, ticketData, config)
  console.log(`15: client  createTicket() response= ${JSON.stringify(response,null,4)} `)
  return response.data
}

// SaveTicket
const saveTicket = async (ticketData,token) => {
  console.log(`21: client saveTicket(ticketData= ${JSON.stringify(ticketData,null,4)} `)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(`${API_URL}${ticketData.id}`, ticketData.data, config)
  console.log(`15: client  saveTicket() response= ${JSON.stringify(response,null,4)} `)
  return response.data
}

// Get tickets
const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

// Get a ticket
const getTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL + ticketId, config)
  console.log(`38!!!!!!!!!!! getTicket() response.data= ${JSON.stringify(response.data,null,4)}`)
  return response.data
}

// Close a ticket
const closeTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(API_URL + ticketId,{status: 'closed'}, config)
  return response.data
}

// Grab a ticket
const grabTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(API_URL + ticketId,{status: 'assigned'}, config)
  return response.data
}

// ROM Get assingtos
// Get tickets
/*
const getDepartments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL_DEPARTMENTS, config)
  return response.data
}
*/



const ticketService = {
  createTicket,
  getTickets,
  getTicket,

  grabTicket,
  closeTicket,
  saveTicket
}

export default ticketService