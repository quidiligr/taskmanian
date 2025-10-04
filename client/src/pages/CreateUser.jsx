import { useState, useEffect } from "react"
import {toast} from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
//import { sendInvite, reset } from "../features/invite/inviteSlice"
import { adminCreateUser} from "../features/createuser/createuserSlice"
import { getDepartments} from "../features/departments/departmentSlice"

import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'

function CreateUser() {
  
  
  
  //const user = useSelector((state) => state.auth.user)
  const {departments} = useSelector(state=> state.departments)
  
  const [department,setDepartment] = useState('')
  const [company,setCompany] = useState('')
  
  
  const [fullname,setFullName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

 
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //const {isLoading, isError, isSuccess, message} = useSelector((state)=> state.ticket)
  const {isLoading, isError, isSuccess, message} = useSelector(state => state.createuser)

  

  useEffect(()=>{
    if(isError){
      toast.error(message)
      console.log(message)
    }

    // redirect when logged in
    if(isSuccess){
      console.log('45: Success')
      //dispatch(reset())
      navigate('/')
   }

   //dispatch(reset())


 },[isSuccess, isError, message, dispatch, navigate])

 useEffect(()=>{
  dispatch(getDepartments())
  //console.log(`13: departments= ${JSON.stringify(departments,null,4)}`)

}, [dispatch])

/*
useEffect(() => {
  dispatch(getDepartment(departmentId)).unwrap().catch(toast.error)
  // dispatch(getNotes(ticketId)).unwrap().catch(toast.error)
}, [departmentId, dispatch])
*/
/*
useEffect(()=>{
  dispatch(getDepartment())
}, [dispatch])
*/
/*
const departmentt = () =>{
   = departments.find((dd) => dd.id === 'IT') 
  
}
*/
  const onSubmit = (e)=>{
    e.preventDefault()
    dispatch(adminCreateUser({department,company,email,fullname,password}))
  }

  if(isLoading){
    return <Spinner />
  }

   
  const renderDepartments = () => {
    //append new dept
    
    
    return departments.map((d) => (
              
        <option key={d.id} value={d.id}>{d.name}</option>
      ))

      

  }

   

  return (
    <>
      <BackButton url='/' />
      <section className="section heading">
        <h1>Create User</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" className='form-control' name="email" id="email" onChange={(e) => setEmail(e.target.value)}  value={email}/>
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="text" className='form-control' name="password" id="password" onChange={(e) => setPassword(e.target.value)}  value={password}/>
            </div>
            <div className="form-group">
            <label htmlFor="fullname">Name</label>
            <input type="text" className='form-control' name="fullname" id="fullname" onChange={(e) => setFullName(e.target.value)} value={fullname}/>
            </div>
            
            <div className="form-group">
            <label htmlFor="company">Organization/Company</label>
            <input type="text" className='form-control' name="company" id="company" onChange={(e) => setCompany(e.target.value)} value={company}/>
            </div>
            <div className="form-group">
            <label htmlFor="department">Department</label>
            <input type="text" className='form-control' name="department" id="department" onChange={(e) => setDepartment(e.target.value)} value={department}/>
            </div>
            
            {/*
          <div className="form-group">
            <label htmlFor="department">Department</label>
           
            <select name="department" id="department" value={department} onChange={(e)=> setDepartment(e.target.value)}>
            
              {renderDepartments()}
            </select>
          </div>
          */}
          
          
          <div className="form-group">
            <button className="btn btn-block" type="submit">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default CreateUser