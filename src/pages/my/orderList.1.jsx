import React, { useState,useMemo,useEffect,useRef,useCallback } from 'react';
import TabBarWrapper from '../tabbar/tabbar'
import { Link } from 'react-router-dom';
import NavTopBar from '../public/navBar'
import { PullToRefresh,WhiteSpace,Tabs,Badge } from 'antd-mobile';
import './order.css'

class OrderList extends React.Component {
    state = {
        refreshing:false,
        otype:parseInt(this.props.location.search.split("=")[1]),
        height:document.documentElement.clientHeight
    }

    handleRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 1000);
    }
    render(){
        const tabs = [
            { title: <Badge>全部</Badge> },
            { title: <Badge>待审核</Badge> },
            { title: <Badge>待确认</Badge> },
            { title: <Badge>待付款</Badge> },
            { title: <Badge>待发货</Badge> },
            { title: <Badge>待收货</Badge> },
            { title: <Badge>已完成</Badge> },
        ];
        const renderContent = tab =>
        (
            <div style={{overflowY:'scroll'}}>
                <PullToRefresh 
                refreshing={this.state.refreshing} 
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                    paddingBottom:20
                }}
                
                onRefresh={this.handleRefresh}
                direction="up"
                
                >
                    
                <OrderItem/>
                <OrderItem/>
                <OrderItem/>
                <OrderItem/>

                 {/* <div style={{paddingTop:'40%',textAlign:'center'}}>
                    <img alt="" src={require('../../images/cart/no-orders.png')} style={{width:100}}/>
                    <h3 style={{color:'#999999',marginTop:20}}>您还没有订单，先<Link to="/" style={{color:'#44BAAE',fontWeight:'bold'}}>去逛逛</Link>，在下单吧</h3>
                </div>    */}
                </PullToRefresh>
            </div>
            
        
    );
        return (
            <div className="special-bar-wrap">
                <div >
                    <NavTopBar title="我的订单" backFn={()=>this.props.history.push('/my')}/>
                </div>

                <Tabs tabs={tabs} 
                initialPage={this.otype}
                renderTabBar={aprops => <Tabs.DefaultTabBar {...aprops} page={5} />}
                tabBarActiveTextColor="#44BAAE"
                tabBarUnderlineStyle={{border:'1px solid #44BAAE'}}
                onChange={(tab, index) => { console.log('onChange', index, tab); }}
                >
                {renderContent}
                </Tabs>
                    asdasdasd
            </div>
        )
    }
}


const OrderItem = (props) => {

    return(
        <div className="order-item">
            <div style={{color:'#999999'}}>订单编号：134054045600132</div>
            <div className="order-post-time order-item-padding"><p>预计发货时间：2019-10-21</p><span style={{color:'#C83B4C'}}>已完成</span></div>
            <div className="order-img-box">
                <img src='https://pic2.zhimg.com/50/v2-103584e62930fd16c47ca890796ec267_hd.jpg' alt=""/>
                <div className="order-goods-name">
                    <h3>发就沃尔夫马尾区欧冠摩尔</h3>
                    <div>
                        <p><span style={{color:'#C83B4C',fontSize:18,fontWeight:'bold'}}>￥26.58</span><span>/件</span></p>
                        <b style={{fontSize:16}}>共43件</b>
                    </div>
                </div>
            </div>
            <div style={{borderBottom:'1px solid #E6E6E6',fontSize:16,fontWeight:'bold'}} className="order-item-padding">已经选服务：<span style={{color:'#999999',fontSize:14,fontWeight:'normal'}}>吊牌 礼盒包装</span></div>
            <div className="order-item-bot order-item-padding">
                <p>共42件商品 预估总价￥2395.83</p>
                <p>不含运费 含采购服务费￥55</p>
            </div>

        </div>
    )
}
export default (OrderList)