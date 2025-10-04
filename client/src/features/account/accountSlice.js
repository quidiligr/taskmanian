import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import accountService from './accountService'

const initialState = {
  //account:{},
  //account: account ? {...account,passwordreset:{oldpassword:null,done:false}} : {passwordreset:{oldpassword:null,done:false}},
  //account: {passwordreset:{oldpassword:null,done:false}},
  account: {},
  isDone: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  
  

}

/*
export const loginInvite = createAsyncThunk('account/logininvite', 
  async (inputData, thunkAPI)=>{
    console.log(inputData)
    try {
      if(inputData){
        //const token = thunkAPI.getState().auth.user.token
      return await accountService.loginInvite(inputData)
      }
      else{
        return thunkAPI.rejectWithValue()
      }
      
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
*/
// Get Account minimal
/*
export const getMyAccount = createAsyncThunk('account/myaccount', 
  async (inputData, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await accountService.getMyAccount(inputData,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
*/
export const getMe = createAsyncThunk('account/getMe', 
  async (_, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await accountService.getMe(token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const updateMe = createAsyncThunk('account/updatMe', 
  async (inputData, thunkAPI)=>{
    console.log(inputData)
    try {
      const token = thunkAPI.getState().auth.user.token
      //return await accountService.passwordReset(inputData,token)
      return await accountService.updateMe(inputData,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers:{
    reset: (state) => {
      
      state.isError = false
      state.isSuccess= false
      state.message = ''
      state.isLoading=false
      state.account = {}
      state.isDone = false
      
    }    
  },
  extraReducers:(builder)=>{
    builder
    
      .addCase(getMe.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(getMe.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        

      })
      .addCase(getMe.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.account = action.payload
        

      })
      
      .addCase(updateMe.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(updateMe.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        

      })
      .addCase(updateMe.fulfilled, (state)=> {
        console.log('131: updateMe.fulfilled')
        state.isLoading = false
        state.isSuccess = true
        //state.account = action.payload
        state.isDone = true
      })

      
      
      
      
      
  }
})

export const {reset} = accountSlice.actions
export default accountSlice.reducer