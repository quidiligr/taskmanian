import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector(state=> state.auth)

  const onLogOut = ()=>{
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to='/'>Taskmanian</Link><img src="./taskmanian_right.jpeg" alt="taskmanian" height="50" />
      </div>
      <ul>
        {user && user.email ?   (
            <>
            <li><>Welcome <Link to='/myaccount'><FaUser /> {user.name? user.name.split(' ')[0]:''}</Link></></li>
            <li>
            <button className='btn' onClick={onLogOut}>
              <FaSignOutAlt /> Log Out
            </button>
          </li>
            </>
            
        ): (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            {/*
            <li>
              <Link to='/register'>
                <FaUser /> Register
              </Link>
            </li>
        */}
          </>

        )}
      
      </ul>
    </header>
  )
}

export default Header