import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import ticketReducer from '../features/tickets/ticketSlice'
import noteReducer from '../features/notes/notesSlice';
import departmentReducer from '../features/departments/departmentSlice'
//import productReducer from '../features/products/productSlice';
//import accountReducer from '../features/account/accountSlice';
import inviteReducer from '../features/invite/inviteSlice'
import accountReducer from '../features/account/accountSlice';
import createuserReducer from '../features/createuser/createuserSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ticket: ticketReducer,
    invite: inviteReducer,
    
    account: accountReducer,
    createuser: createuserReducer,
      
    notes: noteReducer,
    departments: departmentReducer,
    
  //  products: productReducer
    
  },
});
