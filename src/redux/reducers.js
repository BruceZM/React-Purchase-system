import { doLogin,doLogout } from './actions'


const token = localStorage.getItem('c_token');
const defaultState = token?{ ifLogin:true }:{ ifLogin:false }

const reducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return doLogin
      case 'LOGOUT':
        return doLogout
      default:
        return state
    }
  }
  
export default reducer
