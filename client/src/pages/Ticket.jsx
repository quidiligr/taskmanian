import {useSelector, useDispatch} from 'react-redux'
import {getTicket,closeTicket,grabTicket, saveTicket} from '../features/tickets/ticketSlice'

//import {getDepartment,getDepartments} from '../features/departments/departmentSlice'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef, createRef, forwardRef } from "react"
import { getDepartments } from "../features/departments/departmentSlice"

import NoteItem from '../components/NoteItem'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
//import ListItemAvatar from '@mui/material/ListItemAvatar';
//import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
//import ListItemButton from '@mui/material/ListItemButton';
import Chip from '@mui/material/Chip'

/*
const MuiMenu = React.forwardRef((props, ref) => {
  return <Menu  ref={ref} {...props} />;
});

export default MuiMenu;
*/
//const EmergencyService = React.forwardRef(({ ...props }, ref) => {
function Ticket() {
  
  const MAX_COUNT = 10;
  const {user} = useSelector((state)=> state.auth)
  const {ticket, isLoading, isError} = useSelector(state=> state.ticket)
  const {departments, isLoading: departmentsIsLoading} = useSelector(state=> state.departments)
  
  const [assignto,setAssignto] = useState('')
  const [department,setDepartment] = useState('')
  const [solution,setSolution] = useState(ticket.solution)
  const [description,setDescription] = useState(ticket.description)
  
  const [newnoteitem,setNewNoteItem] = useState('')
  const [iseditsol,setIsEditSol] = useState(false)
  const [iseditdesc,setIsEditDesc] = useState(false)
//  const {notes, isLoading: notesIsLoading} = useSelector(state=> state.notes)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [fileLimit, setFileLimit] = useState(false);
 // const [isUploading, setIsUploading] = React.useState(false);
  //const [files,setFiles] = React.useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const ticketId = params.ticketId
  const fileInputRef = useRef(null)
  const commentInputRef = useRef(null)

  // Close Ticket
  const onTicketClose = (e)=>{
    e.preventDefault()
    dispatch(closeTicket(ticketId))
    toast.success('Ticket Closed Successfully')
    navigate('/tickets')
  }

  // Grab Ticket
  const onTicketGrab = (e)=>{
    e.preventDefault()
    dispatch(grabTicket(ticketId))
    toast.success('Ticket Assigned Successfully')
    navigate('/tickets')
  }

    // Save Ticket(notes,description,solution,...)
    const onSaveNote = (e)=>{
      e.preventDefault()
      dispatch(saveTicket({id:ticketId,data:{newnoteitem:newnoteitem}}))
      toast.success('Note saved.')
      setNewNoteItem('')
      
      //navigate('/tickets')
    }
    const onSaveSolution = (e)=>{
      e.preventDefault()
      dispatch(saveTicket({id:ticketId,data:{solution:solution}}))
      setIsEditSol(false)
      //toast.success('Solution saved.')
      //navigate('/tickets')
    }
/*
    const onEditSolution = (e)=>{
      e.preventDefault()
      if(iseditsol){
        setIsEditSol(false)
      
      }
      else{
        setIsEditSol(true)
      
      }
      
    }*/
    
    const onSaveDescription = (e)=>{
      e.preventDefault()
      dispatch(saveTicket({id:ticketId,data:{description:description}}))
      setIsEditDesc(false)
      //toast.success('Solution saved.')
      //navigate('/tickets')
    }
/*
    const onEditDesc = (e)=>{
      e.preventDefault()
      if(iseditdesc){
        setIsEditDesc(false)
      
      }
      else{
        setIsEditDesc(true)
      
      }
      
    }
    */

// handle drag events
const handleDrag = function(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  } else if (e.type === "dragleave") {
    setDragActive(false);
  }
};

// triggers when file is dropped
const handleDrop = function(e) {
    //alert('handleDrop')
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  //if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  if (e.dataTransfer.files) {
    
   //startUpload(e.dataTransfer.files[0]);
   const chosenFiles = Array.prototype.slice.call(e.dataTransfer.files);
  handleUploadFiles(chosenFiles);
  }
};

const handleRemoveUploadedFiles = (file) =>{
  
  //let tmp_files = [...uploadedFiles];
  //var array = [...uploadedFiles]; // make a separate copy of the array
  //alert(`282: len= ${uploadedFiles.length}`);
  let array  =     uploadedFiles.filter(f => f!== file)
  //alert(`284:len= ${array.length}`);
 
  
  
  setUploadedFiles(array);
  

}


const handleFileEvent =  (e) => {
  console.log('170: handleFileEvent')
  const chosenFiles = Array.prototype.slice.call(e.target.files);
  handleUploadFiles(chosenFiles);
  
}

const handleUploadFiles = files => {
  const uploaded = [...uploadedFiles];
  let limitExceeded = false;
  files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
          uploaded.push(file);
          if (uploaded.length === MAX_COUNT) setFileLimit(true);
          if (uploaded.length > MAX_COUNT) {
              alert(`Max of ${MAX_COUNT} files`)
              setFileLimit(false);
              limitExceeded = true;
              return true;
          }
      }
      
  })
  if(!limitExceeded) setUploadedFiles(uploaded);
  
}

// triggers the input when the button is clicked
const onButtonClick = () => {
  fileInputRef.current.click();
}


  useEffect(() => {
    dispatch(getTicket(ticketId)).unwrap().catch(toast.error)
    
  }, [ticketId, dispatch])

  
  
  useEffect(()=>{
    dispatch(getDepartments())
    //console.log(`13: departments= ${JSON.stringify(departments,null,4)}`)
  
  }, [dispatch])

  
  
  if(isLoading){
    return <Spinner />
  }

  if(isError){
    return <h3>Something Went Wrong</h3>
  }

  const ActionButtons = () => {
    console.log(`59: ticket = ${JSON.stringify(ticket,null,4)}`)
    console.log(`59: user = ${JSON.stringify(user,null,4)}`)
    
    
    
    if(ticket.status === 'closed'){
      return( <></>  )
      
    }
    else {
     
      if(ticket.status === 'new'){
        
        return (<button className="btn btn-block btn-danger" onClick={onTicketGrab}>Work on this Ticket</button>)
        
      }

      //if( ticket.assignto != null && ticket.assignto.username != null && ticket.assignto.username.length > 0 && (user.email === ticket.assignto.username || user.email === ticket.createdby.username)){
      else{
        return(  <button className="btn btn-block btn-danger" onClick={onTicketClose}>Close Ticket</button>)
        
      }
      /*else{
        
        return (<button className="btn btn-block btn-danger" onClick={onTicketGrab}>Work on this Ticket</button>)
      // }
          
      }
      */
    
    }
  }
  
    const AssignToDropDown = () => {
      const dept = departments.find((d) => d.id === ticket.department)
      if(dept && dept.members){
        
        return (
          <div className="form-group">
                
                <h3>Assign To : </h3>
                <select name="assignto" id="assignto" value={ticket.assignto.name} onChange={(e)=> setAssignto(e.target.value)}>
                
                {dept.members.map((m) => (
                
                <option key={m.username} value={m.username}>{m.name}</option>
              ))}
                  
                </select>
              </div>
        )
  
    }
    else{
      return (<></>)
    }
  }
  
  const Solution = () => {

    //if(ticket.status !== 'new'){
        
              
        //console.log(`ticket= ${JSON.stringify(ticket,null,4)}`)
        //if(ticket.assignto != null && ticket.assignto.username === user.email){
          
          //return(<textarea name="solution" id="solution" className="form-control" placeholder="" value={solution} onChange={(e)=> setSolution(e.target.value)}></textarea>)
          return(
            <div className="ticket-desc">
              <h3>Solution</h3>
              <div className="form-group">
                <textarea name="solution" id="solution" className="form-control" placeholder="" value={ticket.solution} onChange={(e)=> setSolution(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                
                <button className="btn btn-block" onClick={onSaveSolution}>Submit Solution</button>
              </div>
            </div>
          )
      
        //}
      
          
          
    
    //}

    /*
    return (
      
      <></>
    )
    */
    

  }
  const style = {
    maxHeight:'200px',
    minHeight:'38px',
      resize:'none',
      padding:'9px',
      boxSizing:'border-box',
      fontSize:'15px'};

 
  const NewNoteItem = () => {

    //if(ticket.status !== 'closed'){
        
              
        //console.log(`ticket= ${JSON.stringify(ticket,null,4)}`)
       // if(ticket.assignto != null && ticket.assignto.username === user.email){
          
          //return(<textarea name="solution" id="solution" className="form-control" placeholder="" value={solution} onChange={(e)=> setSolution(e.target.value)}></textarea>)
          return(
            
            <div className="ticket-desc">
              
              <div className="form-group">
                <textarea rows={5}  ref={commentInputRef} name="newnoteitem" id="newnoteitem"  className="form-control" placeholder="New comment" value={newnoteitem} onChange={(e)=> setNewNoteItem(e.target.value)}></textarea>
                
                
              </div>
              <div className="form-group">
              <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={fileInputRef} type="file" id="input-file-upload" multiple={true} onChange={handleFileEvent} />
                
                <div>
                    <div>
                      <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                          <div>
                          <p>Drag and drop your file here or</p>
                          
                          <Button variant="outlined" onClick={onButtonClick}>Select files </Button>
                          
                          
                          </div> 
                      </label>
                      { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }

                    </div>
                    <div>
                    <List>
              
                        {uploadedFiles.map(file => (
                            <ListItem key={file.name}>
                                <ListItemText>
                                <Chip label={file.name} onDelete={ () => handleRemoveUploadedFiles(file)} />
                                
                                </ListItemText>
                                
                            </ListItem>
                        ))} 
                        
                        </List>    
                    </div>
                        
                </div>
                                
    
    
                </form>
              </div>
              
              <div className="form-group">
               
                <button className="btn btn-block" onClick={onSaveNote}>Submit Comment</button>
              </div>
            </div>
            
            
          )
    
          
    /*}

    return (
      <div className="ticket-desc">
    <p>{ticket.solution}</p>
    </div>
    )*/

  }
 
 
  
  /*
  const renderedListUserItems = departments.map(d => {
    //console.log(`59: renderedListUserItems d.id= ${d.id} department= ${ticket.department}`)
    if(d.id === ticket.department){
      //console.log(`61: renderedListUserItems`)
        return d.members.map(m => {
          //console.log(`Adding: m= ${JSON.stringify(m,null,4)}`)
      
          return <option key={m.username} value={m.username}>{m.name}</option>  
        })
        
    }
    
    
  })
  */

  const ticketss = () => {
    if(ticket && ticket.notes && ticket.notes.length > 0){
      return ticket.notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))
    }

    return <></>
    
    
  }   
  


  return (
    <div className='ticket-page'>
      <header className="ticket-header">
        <BackButton url='/tickets' />
        <h2>
          Ticket ID: {ticket.id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>Date Open: {new Date(ticket.createdAt).toLocaleString('en-IN')}</h3>
        <h3>Open By : {ticket.openby}</h3>
        
        <h3>Product : {ticket.product}</h3>
        <h3>Department : {ticket.department}</h3>
        <h3>Assign To : {ticket.assignto != null && ticket.assignto.name? ticket.assignto.name : ""}</h3>
        
        
        
        <hr />
        
        {/*
        <div className="ticket-desc">
            <h3>Issue</h3>
            <div className="form-group">
              { iseditdesc ? 
              <textarea name="description" id="description" className="form-control"  value={description} onChange={(e)=> setDescription(e.target.value)} ></textarea>
              : <textarea name="description" id="description" className="form-control"value={description}  disabled ></textarea>
              }
            </div>
            <div className="form-group">
              { iseditdesc ? 
              <button className="btn btn-block" onClick={onSaveDescription}>Save</button>
              : <button className="btn btn-block" onClick={() => setIsEditDesc(true)}>Edit</button> 
              }
            </div>
          </div>
          */}
          <div className="ticket-desc">
            <h3>Issue</h3>
            <div className="form-group">
              <textarea name="description" id="description" className="form-control"value={ ticket.description }  disabled ></textarea>
              
            </div>
          </div>


        {/*}
          { ticket.isstaff ? 
          <div className="ticket-desc">
            <h3>Solution</h3>
            <div className="form-group">
            {iseditsol ?
              <textarea name="solution" id="solution" className="form-control"  value={solution} onChange={(e)=> setSolution(e.target.value)}></textarea>
              : <textarea name="solution" id="solution" className="form-control"  value={solution} disabled></textarea>
            }
            </div>
            <div className="form-group">
              {iseditsol ? 
              <button className="btn btn-block" onClick={onSaveSolution}>Save</button> : 
              <button className="btn btn-block" onClick={ () => setIsEditSol(true)}>Edit</button> }
            </div>
          </div> : <></>
        }*/}
        {/*}
        { ticket.isstaff ? 
          <div className="ticket-desc">
            <h3>Solution</h3>
            <div className="form-group">
      
              <textarea rows={5}  name="solution" id="solution" className="form-control"  value={solution} onChange={(e)=> setSolution(e.target.value)}></textarea>
      
      
            </div>
            <div className="form-group">
      
              <button className="btn btn-block" onClick={onSaveSolution}>Submit Solution</button> 
      
            </div>
          </div> : <></>
      }
      */}
        
        
           
      <h2>Comments</h2>
      </header>
      {/*
      {ticket.notes ? (
        ticket.map((note) => <NoteItem key={note.id} note={`${note.text} -${note.name}`} />)
      ) : (
        <Spinner />
      )}
      */}
      { ticketss() }
      {NewNoteItem()}
     

      <ActionButtons/>
      
    </div>
  )
}

export default Ticket
