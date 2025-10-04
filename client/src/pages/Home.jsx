import { FaQuestionCircle, FaTicketAlt, FaEnvelope } from "react-icons/fa"
import { Link } from "react-router-dom"
import {useSelector} from 'react-redux'

function Home() {
  const {user} = useSelector((state)=> state.auth)
  console.log(`Home: user=${JSON.stringify(user,null,4)}`)
  return (
    <>
      <section className="heading">
      
        <h1>AI-powered Task & Ticket Management System for the Community</h1>   
        <p>What do you need help with?</p> 
        
      </section>

      <Link to='/new-ticket' className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Ticket/Task
      </Link>

      <Link to='/tickets' className="btn btn-block">
        <FaTicketAlt /> View Your Tickets/Tasks
      </Link>
      { (user !== null && user.isAdmin) && 
        <Link to='/createuser' className="btn btn-block">
        <FaEnvelope /> Create User
      </Link>
      }
      { (user !== null && user.isAdmin) && 
        <Link to='/invite' className="btn btn-block">
        <FaEnvelope /> Invite User
      </Link>
      }

      

    </>
  )
}

export default Home