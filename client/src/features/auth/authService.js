import axios from 'axios'

const API_URL = '/api/users'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  // const response = fetch(API_URL, {
  //   method: 'POST',
  //   body:userData,
  // })

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Admin create user
/*
const adminCreateUser = async (inputData,token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(`${API_URL}/admin-create-user`, inputData, config)
  console.log(`28: adminCreateUser() response.data= ${JSON.stringify(response.data,null,4)}`)
  return response.data
  
}
*/
const login = async(userData)=>{
  const response = await axios.post(`${API_URL}/login`, userData)
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const loginFromInvite = async(userData)=> {
  
  const response = await axios.post(`${API_URL}/login-from-invite`, {inviteId:userData})
  if (response.data) {
    localStorage.setItem('30: user', JSON.stringify(response.data))
  }
  return response.data
}
/*
const loginInvite = async (userData) => {
  
  const response = await axios.post(`${API_URL}login-invite`, userData)
  return response.data
}
*/

const logOut = ()=>{
  localStorage.removeItem('user')
}

const authService = {
  register,
  logOut,
  login,
  loginFromInvite,
  //adminCreateUser
}

export default authService