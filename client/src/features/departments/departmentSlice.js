import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import departmentService from './departmentService'

const initialState = {
  departments: [],
  department: {},
  companies:[],
  company: {},
  
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

// Create new dept
export const createDepartment = createAsyncThunk('departments/create', 
  async (departmentData, thunkAPI)=>{
    console.log(departmentData)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.createDepartment(departmentData,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// Get Departments
export const getDepartments = createAsyncThunk('departments/getAll', 
  async (_, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      //return await departmentService.getDepartments(token)
      let result =  await departmentService.getDepartments(token)
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
export const getDepartment = createAsyncThunk('departments/getOne', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.getDepartment(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Clode Tickets
export const removeDepartment = createAsyncThunk('departments/remove', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.removeDepartment(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


//companies
// Create new company
export const createCompany = createAsyncThunk('departments/createCompany', 
  async (departmentData, thunkAPI)=>{
    console.log(departmentData)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.createCompany(departmentData,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// Get Departments
export const getCompanies = createAsyncThunk('departments/getCompanies', 
  async (_, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      //return await departmentService.getDepartments(token)
      let result =  await departmentService.getCompanies(token)
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
export const getCompany = createAsyncThunk('departments/getCompany', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.getCompany(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Clode Tickets
export const removeCompany = createAsyncThunk('departments/removeCompany', 
  async (departmentId, thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await departmentService.removeCompany(departmentId,token)
    } catch (error) {
      console.log(error)
      const message = (error.response && error.response.data && error.response.data.message) || error.messsage || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)



export const departmentSlice = createSlice({
  name: 'department',
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
      
      
      .addCase(getDepartments.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(getDepartments.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload

      })
      .addCase(getDepartments.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.departments = action.payload
      })
      .addCase(getDepartment.pending, (state)=> {
        state.isLoading = true
      })
      .addCase(getDepartment.rejected, (state,action)=> {
        state.isLoading = false
        state.isError = true
        state.message = action.payload

      })
      .addCase(getDepartment.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.department = action.payload
      })
      
      
      .addCase(removeDepartment.fulfilled, (state,action)=> {
        state.isLoading = false
        //state.departments.map((d) => d._id === action.payload._id ? d.status ='closed' : d)
        state.departments.map((d) => d)
      })

      .addCase(getCompany.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.company = action.payload
      })
      .addCase(getCompanies.fulfilled, (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.companies = action.payload
      })
      
  }
})

export const {reset} = departmentSlice.actions
export default departmentSlice.reducer