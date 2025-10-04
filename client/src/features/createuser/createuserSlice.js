import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import createuserService from './createuserService'

// get user from local storage
//const user = JSON.parse(localStorage.getItem('user'))
const initialState = {
  
  createuser:'',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}


export const adminCreateUser = createAsyncThunk('auth/admin-create-user', 
  async (user, thunkAPI)=>{
    try {
      //console.log(`loginFromInvite() user= ${JSON.stringify(user)}`)
      const token = thunkAPI.getState().auth.user.token
      return await createuserService.adminCreateUser(user,token)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const createuserSlice = createSlice({
  name:'authSlice',
  initialState,
  reducers:{
    reset: (state) =>{
      state.isLoading = false
      state.isError = false
      state.isSuccess= false
      state.message = ''
      state.createuser =''
    },

  },
  extraReducers: (builder)=>{
    builder
     
    
      .addCase(adminCreateUser.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(adminCreateUser.rejected, (state,action) =>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(adminCreateUser.fulfilled, (state,action)=> {
        console.log(`135: adminCreateUser.fulfilled`)
        state.isLoading = false
        state.isSuccess = true
        state.createuser = action.payload
        
      })
    
  }
})

export const {reset} = createuserSlice.actions
export default createuserSlice.reducer