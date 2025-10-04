import { useState, useEffect } from "react"
import {toast} from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { createTicket, reset } from "../features/tickets/ticketSlice"
import { getDepartments,getCompanies } from "../features/departments/departmentSlice"

import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'

function NewTicket() {
  const {departments,companies} = useSelector(state=> state.departments)
  //const {notes, isLoading: notesIsLoading} = useSelector(state=> state.notes)
  
  
  const user = useSelector((state) => state.auth.user)
  //const {departments} = useSelector(state=> state.departments)
  //const [departmentId,setDepartmentId] = useState('IT')
  const [department,setDepartment] = useState('')
  const [company,setCompany] = useState('')
  const [member,setMember] = useState('')
  
  const [product,setProduct] = useState('')
  const [description,setDescription] = useState('')
  //const [solution,setSolution] = useState('')

  //const department = useSelector((state) => state.departments.find(({id}) => id==departmentId))
  
  //const department = departments.find(({id}) => id === departmentId)
  

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {isLoading, isError, isSuccess, message} = useSelector((state)=> state.ticket)



  useEffect(()=>{
    if(isError){
      toast.error(message)
      console.log(message)
    }

    // redirect when logged in
    if(isSuccess){
      console.log('Success')
      dispatch(reset())
      navigate('/tickets')
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
    dispatch(createTicket({department,member, product, description}))
  }

  if(isLoading){
    return <Spinner />
  }

   // since `todos` is an array, we can loop over it
  
   const renderedListProductItems = departments.map(d => {
    
    if(d.id === department){
        return d.products.map(p => {
          //console.log(`Adding: p= ${JSON.stringify(p,null,4)}`)
      
          return <option key={p.id} value={p.id}>{p.name}</option>  
        })
        
    }
    
    
  })

  const renderedListDeptUsers = departments.map(d => {
    
    if(d.id === department){

        return d.members.map(m => {
          //console.log(`Adding: p= ${JSON.stringify(p,null,4)}`)
          let name = m.name === '' ? 'AI': m.name
          if(m['company'] != null){
            name = `${name} (${m.company})`
          }
      
          return <option key={m.username} value={m.username}>{ name }</option>  
        })
        
    }
    
    
  })

  const renderedListProductItemsWorking = departments.map(d => {
    
    
          return <option key={d.id} value={d.id}>{d.name}</option>  
        
    })

  return (
    <>
      <BackButton url='/' />
      <section className="section heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        {/*
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          <input type="text" className='form-control' name="name" id="name" value={user.name} disabled/>
        </div>
        <div className="form-group">
          <label htmlFor="name">Customer Email</label>
          <input type="text" className='form-control' name="email" id="email" value={user.email} disabled/>
        </div>
        */}

        <form onSubmit={onSubmit}>
        {/*<div className="form-group">
            <label htmlFor="department">Company/Organization</label>
            
            <select name="companyId" id="companyId" value={company} onChange={(e)=> setCompany(e.target.value)}>
            
              {departments.map((d) => (
              
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
            </select>
          </div>
              */}
          <div className="form-group">
            <label htmlFor="department">Department</label>
            
            <select name="departmentId" id="departmentId" value={department} onChange={(e)=> setDepartment(e.target.value)}>
            
              {departments.map((d) => (
              
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="department">Assign To:</label>
            {/*<p>{JSON.stringify(departments,null,4)}</p> */}
            <select name="memberId" id="memberId" value={member} onChange={(e)=> setMember(e.target.value)}>
            
              {renderedListDeptUsers}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product">Product/Service</label>
            <select name="product" id="product" value={product} onChange={(e)=> setProduct(e.target.value)}>
              
              {renderedListProductItems}
            
              
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea name="description" id="description" className="form-control" placeholder="Description" value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-block" type="submit">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default NewTicket