import { createBrowserHistory } from 'history';
import store from '../redux/store';
import { message } from 'antd';
//检查登陆状态
const history = createBrowserHistory();
function reLogin(){
    message.warning('登陆状态已过期，请重新登陆~');
    setTimeout(() => {
      store.dispatch({type:'LOGOUT'});
      history.push('/')
      localStorage.removeItem('c_token');
    }, 1500);
}

//全局路径测试
const commonUrl = 'http://192.168.1.128/?service='

//全局路径正式
//const commonUrl = 'http://htwapapi.yijiahaohuo.com/'
//解析json
function parseJSON(response){
  return response.json()
}
//检查请求状态
function checkStatus(response){
    
  if(response.status >= 200 && response.status < 500){
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}
//封装请求
function request(options){
  //console.log(options)
  const {url} = options;
  delete options.url;
   //options.mode = 'no-cors';
   //options.credentials = 'include';
   //options.mode = "cors";
  
  options.headers = {
    'Accept': 'application/json', 
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 

  }
  return fetch(commonUrl + url,options)
    .then(checkStatus)
    .then(parseJSON)
    .catch(err=>({err}))
}
export {
  request,
  reLogin
}