import axios from 'axios'

const API_URL = '/api/users'



// Admin create user
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




const createuserService = {
  
  adminCreateUser
}

export default createuserService