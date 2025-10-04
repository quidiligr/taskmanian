import { useState, useEffect } from "react"
import { FaUser } from "react-icons/fa";
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import {register, reset} from '../features/auth/authSlice'
import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const navigate = useNavigate()

  const {name,email,password,password2} = formData

  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector((state)=> state.auth)


  useEffect(()=>{
     // redirect when logged in
     if(isSuccess || user){
      navigate('/')
    }

    if(isError){
      toast.error(message)
      console.log(message)
    }

    dispatch(reset)

  },[user, isLoading, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e)=>{
    setFormData((prev)=>(
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))
  }

  const onSubmit = (e)=>{
    e.preventDefault();

    if(password !== password2){
      toast.error('Passwords do not Match')
    }else {
      const userData = {
        name,
        email,
        password
      }

      dispatch(register(userData))
    }

  }

  if(isLoading){
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register 
        </h1>
        <p>Please create an Account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" className="form-control" id='name' value={name} name='name' onChange={onChange} placeholder="Please enter your name" required/>
          </div>
          <div className="form-group">
            <input type="email" className="form-control" id='email' value={email} name='email' onChange={onChange} placeholder="Please enter your email" required/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" id='password' value={password} name='password' onChange={onChange} placeholder="Enter a password" required/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" id='password2' value={password2} name='password2' onChange={onChange} placeholder="Confirm password" required/>
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}
/*
db.users.insert({
"name" : "Rom The Great",
"email" : "rquidilig@gmail.com",
"password" : "$2a$10$aORZcsUQ.uoMbBFJnhjaUu/oxuFaOEa06lihNu2NLY/gwOqEz.xie",
"isAdmin" : true,
"createdAt" : ISODate("2024-09-11T16:55:07.959Z"),
"updatedAt" : ISODate("2024-09-11T16:55:07.959Z"),
"__v" : 0,
"isActive" : true,
"company" : "PRS",
"department" : "IT",
"status" : "ACTIVE",
"hashedPass" : "$2a$10$9naIrlXn6Yf0PVXPym0s6urkcnHcupze/Gnnhc93n8CDKcjAqL6QO"
})

db.users.insert({
"name" : "Sam Yamini",
	"email" : "sam@physicianreviewservices.comm",
	"password" : "$2a$10$br83ZuOxUZMJCRfYkgruruBo95Lqn6wGpKMxDbw0E633rX3Ayl4q6",
	"company" : "PRS",
	"department" : "QA",
	"isAdmin" : false,
	"isActive" : true,
	"status" : "ACTIVE",
	"createdAt" : ISODate("2024-10-07T15:39:30.843Z"),
	"updatedAt" : ISODate("2024-10-07T15:39:30.843Z"),
	"__v" : 0,
	"id" : "670400b245e28dcec2198d1c"
})

*/

export default Register