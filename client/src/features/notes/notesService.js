import axios from 'axios'

const API_URL = '/api/notes/'

// Get notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  //const response = await axios.get(API_URL + ticketId + '/notes', config)
  const response = await axios.get(API_URL + ticketId, config)
  return response.data
}

// Create ticket note
const createNote = async (noteText, ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(
    API_URL + ticketId + '/notes',
    {
      text: noteText,
    },
    config
  )

  return response.data
}

const notesService = {
  getNotes,
  createNote
}

export default notesService