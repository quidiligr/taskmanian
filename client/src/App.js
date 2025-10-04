import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewTicket from './pages/NewTicket';
import InviteUser from './pages/InviteUser';
import CreateUser from './pages/CreateUser';

import MyAccount from './pages/MyAccount';

import PrivateRoute from './components/PrivateRoute';
import Tickets from './pages/Tickets';
import Ticket from './pages/Ticket';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login/:inviteId?' element={<Login />} />

            <Route path='/register' element={<Register />} />
            <Route path='/createuser' element={<PrivateRoute />}>
              <Route path='/createuser' element={<CreateUser />} />
            </Route>
            <Route path='/invite' element={<PrivateRoute />}>
              <Route path='/invite' element={<InviteUser />} />
            </Route>
            <Route path='/myaccount' element={<PrivateRoute />}>
              <Route path='/myaccount' element={<MyAccount />} />
            </Route>
            
            <Route path='/new-ticket' element={<PrivateRoute />}>
              <Route path='/new-ticket' element={<NewTicket />} />
            </Route>
            <Route path='/tickets' element={<PrivateRoute />}>
              <Route path='/tickets' element={<Tickets />} />
            </Route>
            <Route path='/ticket/:ticketId' element={<PrivateRoute />}>
              <Route path='/ticket/:ticketId' element={<Ticket />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
