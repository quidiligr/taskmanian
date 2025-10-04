import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'

// get user from local storage
const user = JSON.parse(localStorage.getItem('user'))
const initialState = {
  user: user ? user : null,
  //createduser:'',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const register = createAsyncThunk('auth/register', 
  async (user, thunkAPI)=>{
    //console.log(user)
    try {
      return await authService.register(user)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const login = createAsyncThunk('auth/login', 
  async (user, thunkAPI)=>{
    try {
      
      return await authService.login(user)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const logout =  createAsyncThunk('auth/logout', async ()=>{
   authService.logOut()
})

export const loginFromInvite = createAsyncThunk('auth/login-from-invite', 
  async (user, thunkAPI)=>{
    try {
      console.log(`loginFromInvite() user= ${JSON.stringify(user)}`)
      return await authService.loginFromInvite(user)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
/*
export const adminCreateUser = createAsyncThunk('auth/admin-create-user', 
  async (user, thunkAPI)=>{
    try {
      //console.log(`loginFromInvite() user= ${JSON.stringify(user)}`)
      const token = thunkAPI.getState().auth.user.token
      return await authService.adminCreateUser(user,token)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
*/

export const authSlice = createSlice({
  name:'authSlice',
  initialState,
  reducers:{
    reset: (state) =>{
      state.isLoading = false
      state.isError = false
      state.isSuccess= false
      state.message = ''
      state.createduser =''
    },

  },
  extraReducers: (builder)=>{
    builder
      .addCase(register.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state,action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state,action) =>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(logout.fulfilled, state=>{
        state.user = null
      })
      .addCase(login.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state,action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state,action) =>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(loginFromInvite.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(loginFromInvite.fulfilled, (state,action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(loginFromInvite.rejected, (state,action) =>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      /*
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
        state.createduser = action.payload
        
      })*/
    
  }
})

export const {reset} = authSlice.actions
export default authSlice.reducer