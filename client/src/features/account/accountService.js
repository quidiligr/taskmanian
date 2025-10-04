import axios from 'axios'

const API_URL = '/api/users/'


//

const updateMe = async (inputData,token) => {
  console.log(`9: START updateMe() inputData=${JSON.stringify(inputData,null,4)}`)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(`${API_URL}updateMe`, inputData, config)
  return response.data
}

/*
const getMyAccount = async (inputData,token) => {
  console.log(`20: START getMyAccount inputData=${JSON.stringify(inputData,null,4)}`)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}getmyaccount`,inputData, config)
  return response.data
}
*/
// Get tickets
const getMe = async (token) => {
  console.log(`33: START getMe()`)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}getme`, config)
  console.log(`40: getMe response=${JSON.stringify(response,null,4)}`)
  return response.data
}



/*
const passwordReset = async (inputData,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(`${API_URL}/password-reset`, inputData, config)
  return response.data
}

const passwordResetStart = async (inputData,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(`${API_URL}/password-reset-start`, inputData, config)
  return response.data
}
*/

/*
const login = async(userData)=>{
  const response = await axios.post(`${API_URL}/login`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}
*/




const accountService = {

  //passwordResetStart,
  //passwordReset
  getMe,
  updateMe

}

export default accountService