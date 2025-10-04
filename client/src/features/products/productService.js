import axios from 'axios'

const API_URL = '/api/products/'

// Get a ticket
const getProducts = async (departmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL +  departmentId , config)
  return response.data
}

// Create ticket note
const createProduct = async (name, departmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(
    API_URL,
    {
      departmentId:departmentId,
      name: name,
    },
    config
  )

  return response.data
}

const productsService = {
  getProducts,
  createProduct
}

export default productsService

//db.products.insert{"id" : "EK Import",departmentId:"IT","name" : "EK Import"}