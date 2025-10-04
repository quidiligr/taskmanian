import axios from 'axios'

const API_URL = '/api/departments/'

// Create department
const createDepartment = async (deparmentData,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, deparmentData, config)
  return response.data
}

const createCompany = async (deparmentData,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, deparmentData, config)
  return response.data
}

// Create department
const sendInvite = async (inviteData,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL+'invite', inviteData, config)
  return response.data
}

// Get departments
const getDepartments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL, config)
  //console.log(`24: getDepartments() response.data = ${JSON.stringify(response.data,null,4)}`)
  return response.data
}

const getCompanies= async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}get-companies`, config)
  //console.log(`24: getDepartments() response.data = ${JSON.stringify(response.data,null,4)}`)
  return response.data
}

// Get a ticket
const getDepartment = async (departmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL + departmentId, config)
  return response.data
}

const getCompany = async (companyId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}get-company/${companyId}`, config)
  return response.data
}

// Remove a ticket
const removeDepartment = async (departmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(API_URL + departmentId,{status: 'removed'}, config)
  return response.data
}




const departmentService = {
  createDepartment,
  sendInvite,
  getDepartments,
  getDepartment,
  removeDepartment,
  getCompanies,
  getCompany
}

export default departmentService