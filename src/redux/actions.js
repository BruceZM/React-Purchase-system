export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const doLogin = ({
    type: LOGIN,
    ifLogin:true
});
export const doLogout = ({
    type: LOGOUT,
    ifLogin:false
});