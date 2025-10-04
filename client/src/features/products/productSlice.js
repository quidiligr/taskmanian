import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import productService from './productService'

const initialState = {
  products: [],
  isError: false, 
  isSuccess: false, 
  isLoading: false, 
  message: ''
}

// Get Notes
export const getProducts = createAsyncThunk('products/getAll', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await productService.getProducts(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create ticket note
export const createProduct = createAsyncThunk(
  'products/create',
  async ({ name, departmentId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await productService.createProduct(name, departmentId, token)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: state=> initialState
  },
  extraReducers: builder => {
    builder
    .addCase(getProducts.pending, (state)=> {
      state.isLoading = true
    })
    .addCase(getProducts.rejected, (state,action)=> {
      state.isLoading = false
      state.isError = true
      state.message = action.payload

    })
    .addCase(getProducts.fulfilled, (state,action)=> {
      state.isLoading = false
      state.isSuccess = true
      state.notes = action.payload
    })
    .addCase(createProduct.fulfilled, (state, action) => {
      state.products.push(action.payload)
    })
  }
})

export const {reset} = productSlice.actions
export default productSlice.reducer
