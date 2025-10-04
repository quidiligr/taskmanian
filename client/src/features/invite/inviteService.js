import axios from 'axios'

const API_URL = '/api/invite'


// Create department
const sendInvite = async (inviteData,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(`${API_URL}/send-invite`, inviteData, config)
  return response.data
}




const inviteService = {

  sendInvite

}

export default inviteService