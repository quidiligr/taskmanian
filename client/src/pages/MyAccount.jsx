import { useState, useEffect } from "react"
import {toast} from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
//import { createTicket, reset } from "../features/tickets/ticketSlice"
//import { getDepartments } from "../features/departments/departmentSlice"
//import { passwordResetStart, passwordReset,reset } from "../features/account/accountSlice"
import { getMe, updateMe,reset } from "../features/account/accountSlice"
import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'

function MyAccount() {
  //const {departments} = useSelector(state=> state.departments)
  
  
  //const user = useSelector((state) => state.auth.user)
  const {account,isDone, isLoading, isSuccess,isError,message} = useSelector(state=> state.account)
  //const {departments} = useSelector(state=> state.departments)
  //const [departmentId,setDepartmentId] = useState('IT')
  //const [department,setDepartment] = useState('IT')
  
  //const [product,setProduct] = useState('EK Import')
  const [newpassword,setNewPassword] = useState('')
  const [newname,setNewName] = useState("")
  const [enablenotification,setEnableNotification] = useState(true)
  
  
  //const [oldpassword,setOldPassword] = useState('')
  
  //const [solution,setSolution] = useState('')

  //const department = useSelector((state) => state.departments.find(({id}) => id==departmentId))
  
  //const department = departments.find(({id}) => id === departmentId)
  

  const navigate = useNavigate()
  const dispatch = useDispatch()

  //const {isLoading, isError, isSuccess, message} = useSelector((state) => state.account)


  

  useEffect(()=>{
    if(isError){
      toast.error(message)
      //console.log(message)
    }

    // redirect when 
    if(isSuccess){
      console.log('51: Success')
      if(isDone){
        console.log('51: Done')
        dispatch(reset())
        navigate('/')
      }
      else{
        console.log('51: Not Done')
        
      }

      
   }

  // dispatch(reset())


 },[account,isDone,isSuccess, isError, message, dispatch, navigate])

 useEffect(() => {
  
    //dispatch(passwordResetStart()).unwrap().catch(toast.error)
    dispatch(getMe()).unwrap().catch(toast.error)
  
  //dispatch(reset)
  // dispatch(getNotes(ticketId)).unwrap().catch(toast.error)
}, [dispatch])


 
  const onSubmit = (e) => {
    e.preventDefault()
    //dispatch(passwordReset({newpassword}))
    const inputData = {}
    if(newname && newname !== account.name){
      
      if(newname.length < 2){
        toast.error('Invalid name')
      }
      else{
        inputData['newname'] = newname
      }
    }
    if(newpassword){
      if(newpassword.length < 7){
        toast.error('Invalid password. Atleast 6 alphanumeric characters.')
      }
      else{
        inputData['newpassword'] = newpassword
      }
      
    }
    if(Object.keys(inputData).length > 0){
      dispatch(updateMe(inputData))
    
    }
   
    
  }
  function handleEnableNotificationChange(e) {
    setEnableNotification(e.target.checked);
 }

  if(isLoading){
    return <Spinner />
  }

   
  
  return (
    <>
      <BackButton url='/' />
      <section className="section heading">
        <h1>My Account</h1>
        <p>{account.email} </p>
        {/* <p>{JSON.stringify(account,null,4)}</p> */}
      </section>

      <>
      
      
      <section className="form">

        
       
       
        <form onSubmit={onSubmit}>
          
          <div className="form-group">
          <label htmlFor="newname">Name</label>
            <input type="text" className="form-control" placeholder="Name" id='newname' value={account.name} name='newname' onChange={(e) => setNewName(e.target.value)}/>
          </div>
          <div className="form-group">
          <label htmlFor="newpassword">Password</label>
          
            <input type="text" placeholder="*******" className="form-control" id='newpassword' value={account.password} name='newpassword' onChange={(e) => setNewPassword(e.target.value)}/>
          </div>
          <div className="form-group">
          <label htmlFor="enablenotification">Enable notification</label>
          
            <input type="checkbox" placeholder="*******" className="form-control" id='enablenotification' value={account.enablenotification} name='enablenotification' onChange={handleEnableNotificationChange}/>
          
            <input value = "test" type = "checkbox" onChange = {handleChange} />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
    </>
  )
}

export default MyAccount