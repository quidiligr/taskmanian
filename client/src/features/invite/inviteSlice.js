import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import inviteService from './inviteService'

const initialState = {
  invites: [],
  invite: {},
  
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

// Send invite
export const sendInvite = createAsyncThunk('invite/send', 
  async (inviteData, thunkAPI)=>{
    console.log(`17: inviteData= ${JSON.stringify(inviteData,null,4)}`)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await inviteService.sendInvite(inviteData,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// Get all departments
export const getInvites= createAsyncThunk('invite/getAll', 
  async (_, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      //return await departmentService.getDepartments(token)
      let result =  await inviteService.getInvites(token)
      //console.log(`35: depatmentSlice.getDepartments() result= ${JSON.stringify(result,null,4)}`)
      return result
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)



// Get Department
export const getInvite = createAsyncThunk('invite/getOne', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await inviteService.getInvite(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Remove invite
export const removeInvite = createAsyncThunk('invite/remove', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await inviteService.removeInvite(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const inviteSlice = createSlice({
  name: 'invite',
  initialState,
  reducers:{
    reset: (state) => {
      state.isError = false
      state.isSuccess= false
      state.message = ''
      state.isLoading=false
    }    
  },
  extraReducers:(builder)=>{
    builder
    /*
      .addCase(createDepartment.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(createDepartment.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload

      })
      .addCase(createDepartment.fulfilled, (state)=> {
        state.isLoading = false
        state.isSuccess = true
      })
      */
      .addCase(sendInvite.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(sendInvite.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        

      })
      .addCase(sendInvite.fulfilled, (state)=> {
        state.isLoading = false
        state.isSuccess = true
       
      })
      
      .addCase(getInvites.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(getInvites.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload

      })
      .addCase(getInvites.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.departments = action.payload
      })
      .addCase(getInvite.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(getInvite.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload

      })
      .addCase(getInvite.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.department = action.payload
      })
      
      
      .addCase(removeInvite.fulfilled, (state,action)=> {
        state.isLoading = false
        state.departments.map((d) => d._id === action.payload._id ? d.status ='closed' : d)
      })
      
  }
})

export const {reset} = inviteSlice.actions
export default inviteSlice.reducer