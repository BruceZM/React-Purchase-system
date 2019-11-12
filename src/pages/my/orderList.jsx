import React from 'react';
import TabBarWrapper from '../tabbar/tabbar'
import { Link } from 'react-router-dom';
import NavTopBar from '../public/navBar'
import { request,reLogin } from '../../utility/request'
import QueueAnim from 'rc-queue-anim'
import { PullToRefresh,WhiteSpace,Tabs,Badge,Toast,ActivityIndicator } from 'antd-mobile';
import qs from 'querystring'
import './order.css'


class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing:false,
            otype:parseInt(this.props.location.search.split("=")[1]),
            height:document.documentElement.clientHeight,
            list:[],
            pageIndex:1,
            ifLoading:false,
            finished:false,
            isIos:!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        }
        //this.handleScorll = this.handleScorll.bind(this)
    }
    
    getScrollTop() {
        var scrollTop = 0;
        if(document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if(document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }
    getClientHeight() {
        var clientHeight = 0;
        if(document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        } else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }
    getScrollHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
    handleScorll = () => {
        //console.log(getScrollTop(),getClientHeight(),getScrollHeight())
        if(this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight() ){
            this.handleListRequest(2)
        }
    }
    componentDidMount() {
        window.scrollTo(0,0);
        this.handleListRequest(1)
        window.addEventListener("scroll",this.handleScorll);
        window.addEventListener("touchmove",this.handleScorll);
        
    }
     
    componentWillUnmount() {
        window.removeEventListener("scroll",this.handleScorll);
        window.removeEventListener("touchmove", this.handleScorll)
    }

    handleListRequest = (requestType) => {
        if(this.state.ifLoading || this.state.finished){
            return
        }
        this.setState({
            ifLoading:true
        })
        let that = this,PageIdx = this.state.pageIndex,tempList = this.state.list,OrderState;
        switch (this.state.otype) {
            case 0:
                OrderState = 99
                break;
            case 1:
                OrderState = 1
                break;
            case 2:
                OrderState = 2
                break;
            case 3:
                OrderState = 10
                break;   
            case 4:
                OrderState = 20
                break;  
            case 5:
                OrderState = 30
                break;
            case 6:
                OrderState = 40
                break;
            default:
                break;
        }
        request({
            url:'Order.OrderList',
            method:"POST",
            body:qs.stringify({
                Key:localStorage.getItem('c_token') || '',
                OrderState,
                PageIndex:PageIdx,
            })
        }).then(function(res){
            console.log(res.data);  
            if(res.flag === 200){
                if(requestType === 1){
                    tempList = res.data
                }else{
                    tempList.concat(res.data)
                }
                that.setState({
                    list:tempList,
                    pageIndex:res.data?PageIdx + 1:PageIdx,
                    finished:res.data?false:true,
                    ifLoading:false
                })
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
        // this.setState({
        //     ifLoading:true
        // },()=>{
        //     setTimeout(() => {
        //         let temp = this.state.list;
        //         temp.push(1)
        //         that.setState(state=>({
        //             list:temp,
        //             ifLoading:false,
        //             pageIndex:state.pageIndex + 1
        //         }))
        //     }, 1000);
        // })
        
    }

    handleSwitchType = (tab, index) => {

        console.log('onChange', index, tab);
        window.scrollTo(0,0);
        this.setState({
            otype:index,
            pageIndex:1,
            finished:false,
            list:[]
        },()=>{
            this.handleListRequest(1)
        })
        
    }

    renderContent = tab =>
        (
            <div style={{overflowY:'scroll'}} >
                
                <QueueAnim type="top">
                {
                    this.state.list &&  
                    this.state.list.map((item,idx)=>
                        <OrderItem key={idx} data={item}/>
                    )
                }
                
                </QueueAnim>
                {
                    !this.state.list && !this.state.ifLoading &&
                    <div style={{paddingTop:'40%',textAlign:'center'}}>
                        <img alt="" src={require('../../images/cart/no-orders.png')} style={{width:100}}/>
                        <h3 style={{color:'#999999',marginTop:20}}>您还没有订单，先<Link to="/" style={{color:'#44BAAE',fontWeight:'bold'}}>去逛逛</Link>，在下单吧</h3>
                    </div>
                }
                
                {
                    this.state.finished && !this.state.isLoading && <div style={{textAlign:'center'}}>加载完毕</div>
                }
                
            </div>
            
    );
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

        return (
            <div className="special-bar-wrap">
                <div >
                    <NavTopBar title={"我的订单"+this.state.pageIndex} backFn={()=>this.props.history.push('/my')}/>
                </div>
              
                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.ifLoading}
                />
                <Tabs tabs={tabs} 
                initialPage={this.state.otype}
                renderTabBar={aprops => <Tabs.DefaultTabBar {...aprops} page={5} />}
                tabBarActiveTextColor="#44BAAE"
                swipeable={!this.state.isIos}
                tabBarUnderlineStyle={{border:'1px solid #44BAAE'}}
                onChange={(tab, index) => this.handleSwitchType(tab, index)}
                >
                    
                    {this.renderContent}
                    
                    
                </Tabs>
                    
            </div>
        )
    }
}


const OrderItem = (props) => {
    const { data } = props
    return(
        <Link className="order-item" key={data.order_id} to={`/order_detail?order_id=${data.order_id}`}>
            <div style={{color:'#999999'}}>订单编号：{data.order_code}</div>
            <div className="order-post-time order-item-padding"><p>预计发货时间：{data.add_time}</p><span style={{color:'#C83B4C'}}>{data.order_status_text}</span></div>

                {
                    data.order_goods && data.order_goods.length>0 &&
                    data.order_goods.map((item,idx)=>
                        <div key={idx}>
                            <div className="order-img-box">
                                <img src={item.goods_image} alt=""/>
                                <div className="order-goods-name">
                                    <h3>{item.goods_name}</h3>
                                    <div>
                                        <p><span style={{color:'#C83B4C',fontSize:18,fontWeight:'bold'}}>￥{item.goods_price}</span><span>/件</span></p>
                                        <b style={{fontSize:16}}>共{item.goods_num}件</b>
                                    </div>
                                </div>
                            </div>
                            <div style={{borderBottom:'1px solid #E6E6E6',fontSize:16,fontWeight:'bold'}} className="order-item-padding">已选服务：<span style={{color:'#999999',fontSize:14,fontWeight:'normal'}}>{item.service_name}</span></div>
                        </div>
                    )
                }

            <div className="order-item-bot order-item-padding">
                <div className="order-item-bot-left">
                    <button style={{alignSelf:'center'}}>付尾款</button>
                </div>
                <div className="order-item-bot-right">
                    <p>共{data.goods_total_num}件商品 预估总价￥{data.goods_total}</p>
                    <p>不含运费 含采购服务费￥{data.total_sprice}</p>
                </div>
            </div>

        </Link>
    )
}
export default (OrderList)