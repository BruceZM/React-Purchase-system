import React, { useState,useEffect } from 'react';
import TabBarWrapper from '../tabbar/tabbar'
import { Button, WhiteSpace,Icon } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { createBrowserHistory } from 'history'; // 如果是history路由
import { showConfirm } from '../../utility/modal'
import QueueAnim from 'rc-queue-anim';

const history = createBrowserHistory()


const mapStateToProps = (state) => {
    return {
      ifLogin: state.ifLogin
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        doLogout: () => {
            localStorage.removeItem('c_token');
            dispatch({type:'LOGOUT'});
            history.push('/login')
        },
    }
};

const My = (props) => {
    const [iconList,setIconList] = useState([]);
    useEffect(() => {
        setIconList([
            {desc:'待审核',num:0},{desc:'待确认',num:5},{desc:'待付款',num:9},{desc:'待发货',num:1},{desc:'待收货',num:0},{desc:'已完成',num:2}
        ])
    }, [])
    const handleLogout = () => {
        showConfirm('','确定要退出登陆吗？',()=>{
            props.doLogout()
        })
    }

    return (
        <div style={{textAlign:'center'}}>
            
                <div className="login-top" style={{padding:1}}>
                    <QueueAnim type="top">
                        <div className="personal-info" key="sg">
                            <img src={require('../../images/banner2.jpeg')} alt=""/>
                            <div>
                                <p style={{fontSize:16}}>金凤凰的店铺</p>
                                <span>ID：12341253</span>
                            </div>
                            {/* <Link to="/setting">设置</Link> */}
                        </div>
                    </QueueAnim>
                <div className="personal-center-box">
                    <QueueAnim type="left">
                        <div style={{width:'95%',margin:'0 auto',overflow:'hidden',padding:'10px 5px 5px 10px',borderBottom:'1px #E6E6E6 solid'}} key="ww">
                            <span className="hot-search" style={{float:'left',fontWeight:'bold'}}>我的进货单</span>
                            <Link to="/order_list?o_type=0" style={{float:'right',marginTop:5}}><span style={{float:'left',color:'#44BAAE'}}>查看全部订单</span><Icon type="right" style={{float:'left',color:'#CDCED2'}}/></Link>
                        </div>
                    </QueueAnim>
                    <ul className="order-icon-box">
                    {
                        iconList.map((item,idx)=>{
                            return (
                                <li key={idx}>
                                    <QueueAnim type={["bottom",'top']} ease={['easeOutQuart', 'easeInOutQuart']}> 
                                        <Link to={`/order_list?o_type=${idx+1}`} key={idx}>
                                            {
                                                parseInt(item.num) > 0 && <b>{item.num}</b>
                                            }
                                            <img src={require(`../../images/my/my-icon${idx+1}.png`)}/>
                                            <span>{item.desc}</span>
                                        </Link>
                                    </QueueAnim>
                                </li>
                            )
                        })
                    }
                       
                    </ul>
                </div>
            </div>
            {/* <Button onClick={handleLogout}>登出</Button> */}
            
            <TabBarWrapper />
        </div>
    )
}
export default connect(mapStateToProps , mapDispatchToProps)(My)
