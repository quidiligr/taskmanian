import { useState, useEffect } from "react"
import {toast} from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { sendInvite, reset } from "../features/invite/inviteSlice"
import { getDepartments} from "../features/departments/departmentSlice"

import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'

function InviteUser() {
  
  
  
  //const user = useSelector((state) => state.auth.user)
  const {departments} = useSelector(state=> state.departments)
  
  const [department,setDepartment] = useState('')
  const [company,setCompany] = useState('PRS')
  
  const [contactname,setContactName] = useState('')
  const [contactemail,setContactEmail] = useState('')

  const [notifyuser,setNotifyUser] = useState(true)

  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //const {isLoading, isError, isSuccess, message} = useSelector((state)=> state.ticket)
  const {isLoading, isError, isSuccess, message} = useSelector(state=> state.invite)

  

  useEffect(()=>{
    if(isError){
      toast.error(message)
      console.log(message)
    }

    // redirect when logged in
    if(isSuccess){
      console.log('Success')
      dispatch(reset())
      navigate('/')
   }

   dispatch(reset())


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
    dispatch(sendInvite({department,company,contactemail,contactname,notifyuser}))
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
  const checkHandler = () => {
    setNotifyUser(!notifyuser)
  }
   

  return (
    <>
      <BackButton url='/' />
      <section className="section heading">
        <h1>Invite</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className='form-control' name="contactname" id="contactname" onChange={(e) => setContactName(e.target.value)} value={contactname}/>
        </div>
        <div className="form-group">
          <label htmlFor="name">Email</label>
          <input type="text" className='form-control' name="contactemail" id="contactemail" onChange={(e) => setContactEmail(e.target.value)}  value={contactemail}/>
        </div>
        
          
        <div className="checkbox">
          <input type="checkbox" id="checkbox" onChange={checkHandler} checked={notifyuser} />
          <label htmlFor="checkbox">Send email notification </label>
        </div>
        
        
        
        <form onSubmit={onSubmit}>
          {/*}
          <div className="form-group">
            
            <label htmlFor="department">Department</label>
            
            <select name="department" id="department" value={department} onChange={(e)=> setDepartment(e.target.value)}>
            
              {renderDepartments()}
            </select>
          </div>
          */}
          <div className="form-group">
            <label htmlFor="company">Organization/Company</label>
            <input type="text" className='form-control' name="company" id="company" onChange={(e) => setCompany(e.target.value)} value={company}/>
            </div>
            <div className="form-group">
            <label htmlFor="department">Department</label>
            <input type="text" className='form-control' name="department" id="department" onChange={(e) => setDepartment(e.target.value)} value={department}/>
            </div>
          
          
          <div className="form-group">
          <button className="btn btn-block" type="submit">Save</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default InviteUser