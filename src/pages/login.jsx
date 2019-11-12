import React from 'react';
import {Input,Icon,Form} from 'antd'; // 加载 JS
import { Toast } from 'antd-mobile';
import store from '../redux/store';
import { connect } from 'react-redux'
import { createBrowserHistory } from 'history'; // 如果是history路由
import { request } from '../utility/request'
import qs from 'querystring'

const mapStateToProps = (state) => {
    return {
      ifLogin: state.ifLogin
    }
}
  
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        doLogin: (token) => {
            localStorage.setItem('c_token',token);
            createBrowserHistory().push('/')
            dispatch({type:'LOGIN'})
            
        },
    }
};
class NormalLoginForm extends React.Component{
    state = {
        checked: true,
        
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const that = this;
        this.props.form.validateFields((err, values) => {
        if (!err) {
                console.log('Received values of form: ', values);
                request({
                    url:'Home.Login',
                    method:"POST",
                    body:qs.stringify(values)
                }).then(function(res){
                    console.log(res);
                    if(res.flag === 200){
                        Toast.success(res.msg,1,()=>{
                            that.props.doLogin(res.data.api_token)
                        })
                    }else{
                        Toast.fail(res.msg)
                    }
                })
                // Toast.success('登陆成功！', 1,()=>{
                //     const { doLogin } = this.props;
                //     createBrowserHistory().push("/list/index");
                //     doLogin('test-token');
                // });
                
                
            }
        });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { ifLogin,doLogin } = this.props;
    return (
        <div style={{textAlign:'center'}}>
            <div className="login-top">
                <h3>质信供应链进货系统</h3>
                <div className="login-box">
                <Form onSubmit={this.handleSubmit} style={{width:'90%',margin:'0 auto'}}>
                    <Form.Item hasFeedback key="bb">
                        {getFieldDecorator('MemberPhone', {
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(
                            <Input
                            size="large"
                            prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)',fontSize:14 }} />}
                            placeholder="您的手机号"
                            className="login-input"
                            type="tel"
                            />,
                        )}
                        </Form.Item>
                    <Form.Item hasFeedback key="cc">
                        {getFieldDecorator('MemberPwd', {
                            rules: [{ required: true, message: '请输入您的密码！' }],
                        })(
                            <Input.Password
                            size="large"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)',fontSize:14 }} />}
                            type="password"
                            placeholder="输入您的密码"
                            className="login-input"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item key="dd">
                        <div style={{paddingTop:30}}>    
                            <button type="submit" className="login-btn">登 陆</button>
                        </div>
                    </Form.Item>
                </Form>
                </div>
            </div>
            </div>
    )
}
}
const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);


export default connect(mapStateToProps, mapDispatchToProps)(Login)
