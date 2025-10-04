import { Link} from 'react-router-dom'
import TimeAgo from 'react-timeago'

function TicketItem({ ticket }) {
  let {description} = ticket
  if(description.length > 36){
    description = `${description.substring(0,36)}...`
  }
  
  return (
    <div className='ticket'>
      {/*<div>{new Date(ticket.createdAt).toLocaleString('en-US')}</div> */}
      <div><TimeAgo date= {new Date(ticket.createdAt)} /></div> 
      <Link to={`/ticket/${ticket.id}`} className='btn btn-reverse btn-sm'>
        {ticket.id}
      </Link>
      <div>{ticket.product}</div>
      <div>{ticket.assignto.name}</div>
      
      <div className={`status status-${ticket.status}`}>{ticket.status}</div>
      
      <div><p>{description}</p><span style={{fontStyle:"italic"}}>-{ticket.createdby.name}</span></div>
      
    </div>
  )
}

export default TicketItem