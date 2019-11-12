import React, { useState,useEffect,useCallback,useReducer } from 'react';
import TabBarWrapper from '../tabbar/tabbar'
import { Link } from 'react-router-dom';
import { Checkbox,Stepper,WhiteSpace,Toast,ActivityIndicator,Icon,NavBar } from 'antd-mobile';
import { CheckboxGroup,CheckStepGroup } from '../public/checkboxGroup'
import { request,reLogin } from '../../utility/request'
import QueueAnim from 'rc-queue-anim'
import { showConfirm } from '../../utility/modal'
import qs from 'querystring'

const Cart = (props) => {
    const [PageIndex,setPageIndex] = useState(1);
    const [count,setCount] = useState(1);
    const [loading,setLoading] = useState(true);
    const [ifEdit,setIfEdit] = useState(false);
    const [cartInfo,setCartInfo] = useState({});

    const key = localStorage.getItem('c_token');
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0); 

    useEffect(() => {
        request({
            url:'Cart.Cartlist',
            method:"POST",
            body:qs.stringify({
                Key:key,
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setCartInfo(res.data);
                setLoading(false);
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }, [key,count])

    const EditCartquantity = (GoodsNum,CartID) => {
        setLoading(true);
        request({
            url:'Cart.EditCartquantity',
            method:"POST",
            body:qs.stringify({
                Key:key,
                CartID,
                GoodsNum
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setCount(n=>n+1)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }

    const SelCart = (e,CartID) => {
        e.stopPropagation()
        console.log(CartID,e);
        
        const IsSelect = e.target.checked?'1':'0';
        console.log(CartID,IsSelect);
        setLoading(true);
        request({
            url:'Cart.SelCart',
            method:"POST",
            body:qs.stringify({
                Key:key,
                CartID,
                IsSelect
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                
                setCount(n=>n+1)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }

    const handleEdit = () => {
        setIfEdit(true);
        forceUpdate()
    }

    const editDone = () => {
        setIfEdit(false);
        forceUpdate()
    }

    const selectAll = (e) => {
        e.stopPropagation()
        const IsSelect = e.target.checked?'1':'0';
        setLoading(true);
        request({
            url:'Cart.AllSelCart',
            method:"POST",
            body:qs.stringify({
                Key:key,
                IsSelect
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setCount(n=>n+1)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }
    const itemClick = (e,GoodsBasicID) => {
        e.stopPropagation()
        const IsSelect = e.target.checked?'1':'0';
        setLoading(true);
        request({
            url:'Cart.BasSelCart',
            method:"POST",
            body:qs.stringify({
                Key:key,
                GoodsBasicID,
                IsSelect
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setCount(n=>n+1)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.hide()
                Toast.fail(res.msg)
            }
        })
    }

    const doDelete = () => {
        showConfirm('','确定要删除选中商品吗？',()=>{
            setLoading(true)
            request({
                url:'Cart.DelCart',
                method:"POST",
                body:qs.stringify({
                    Key:key,
                })  
            }).then(function(res){
                console.log(res.data);
                if(res.flag === 200){
                    Toast.success(res.msg,1);
                    setIfEdit(false);
                    setCount(n=>n+1);
                }else if(res.flag === 420){
                    reLogin()
                }else{
                    Toast.fail(res.msg)
                }
            })
        })
        
    }
    const handleServiceChange = (e,id,basic_id) => {
        setLoading(true);
        let temp = cartInfo;
        id = String(id);
        let service_group = [];
        for(var i = 0;i<temp.cart_list.length;i++){
            if(basic_id === temp.cart_list[i].goods_basicid){
                service_group = temp.cart_list[i].service_id.split(',');
                if(service_group[0] == ''){
                    service_group = []
                }
            }
        }
        let index = service_group.indexOf(id);
        if(index < 0 && e){
            service_group.push(id);
        }else if(index >= 0 && !e){
            service_group.splice(index,1);
        }
        service_group = service_group.join(',');
        console.log(service_group);
        request({
            url:'Cart.SelService',
            method:"POST",
            body:qs.stringify({
                Key:key,
                GoodsBasicID:basic_id,
                ServiceID:service_group
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                
                // Toast.hide();
                // Toast.success(res.msg,1);
                setCount(n=>n+1);
            }else if(res.flag === 420){
                reLogin()
            }else{
                setLoading(false);
                Toast.fail(res.msg);
            }
        })
    }

    const submitOrder = () => {
        localStorage.setItem('skip_type',1)
        props.history.push("/order_confirm?addressId=0")
        
    }
    return (
        <div style={{height:'100vh',paddingBottom:50,paddingTop:50}} className={!cartInfo?'white-background':'grey-background'}>
            <NavBar
            mode="dark"
            icon={<Icon type="left" size="md"/>}
            onLeftClick={()=>props.history.push('/')}
            style={{position:'fixed',left:0,width:'100%',maxWidth:768,zIndex:28,top:0,backgroundColor:'#44BAAE'}}
            rightContent={
                !cartInfo?
                <></>
                :
                !ifEdit?<button onClick={handleEdit}>编辑</button>:<button onClick={(e)=>editDone(e)}>完成</button>
                
            }
            >进货单</NavBar>
            <div style={{paddingBottom:50}}>
                <div className="toast-example">
                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={loading}
                    />
                </div>
                <QueueAnim type={['left', 'right']} leaveReverse>
                {
                    cartInfo && cartInfo.cart_list && cartInfo.cart_list.length > 0 &&
                        cartInfo.cart_list.map((item,idx)=>
                            <CartItem data={item} key={idx} EditCartquantity={EditCartquantity} SelCart={SelCart} itemClick={itemClick} handleServiceChange={handleServiceChange}/>
                        )
                }
                </QueueAnim>
                {
                    !cartInfo? 
                    <div style={{paddingTop:'40%',textAlign:'center'}}>
                        <img alt="" src={require('../../images/cart/no-orders.png')} style={{width:100}}/>
                        <h3 style={{color:'#999999',marginTop:20}}>进货单中还没有商品，快<Link to="/" style={{color:'#44BAAE',fontWeight:'bold'}}>去进货</Link>吧</h3>
                    </div>
                    :
                    <div className="cartlist-bottom" >
                        <div style={{width:'25%',height:'100%',display:'flex'}}>
                            <Checkbox className="cbox" checked={parseInt(cartInfo.cart_select)===1?true:false} style={{paddingTop:'10%',height:'100%'}} onClick={(e)=>selectAll(e)}>全选</Checkbox>
                        </div>
                        <div style={{width:'45%',textAlign:'left',alignSelf:'center'}}>
                        
                        
                            <div style={{display:'flex',justifyContent:'flex-start',color:'#333'}}>
                                <span style={{alignSelf:'center'}}>共{cartInfo.cart_count}件</span>
                                <p style={{alignSelf:'center',marginLeft:15,fontSize:16}}>合计:<span style={{color:'#C83B4C'}}>{cartInfo.total_price}</span></p>
                            </div>
                            <p>采购服务费<span style={{color:'#C83B4C'}}>￥{cartInfo.total_sprice}</span></p>
                        </div>

                        {
                            ifEdit?
                            <button style={{width:'30%',color:'#fff',background:'#C83B4C'}} onClick={doDelete}>删除</button>
                            :
                            <button style={{width:'30%',color:'#fff',background:'#C83B4C'}} onClick={submitOrder}>提交订货单</button>
                        }
                        
                    </div>
                }
                    
                
            </div>
        </div>
    )
}

const CartItem = (props) => {
    const { data } = props;
    const [stepVal,setStepVal] = useState(1);
    const handleServiceChange = (e,gid,goods_basicid) => {
        console.log(e,gid,goods_basicid)
        props.handleServiceChange(e,gid,goods_basicid)
    }

    const handleForceFromCart = (e,cart_id) => {
        console.log(e,cart_id)
        props.EditCartquantity(e,cart_id)
    }

    const handleSelCart = (e,id) => {
        props.SelCart(e,id)
    }
    const itemClick = (e,id) => {
        props.itemClick(e,id)
    }
    return(
        <>
            <div style={{backgroundColor:'#fff',padding:'5px 10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',height:120,padding:'10px 0',overflow:'hidden'}}>
                
                    <Checkbox className="cart-cbox" style={{width:'10%',borderRadius:6,overflow:'hidden',alignSelf:'center',textAlign:'center'}} checked={parseInt(data.all_select)===1?true:false} onChange={(e)=>itemClick(e,data.goods_basicid)}></Checkbox>
                    <div style={{width:'25%',borderRadius:6,overflow:'hidden',alignSelf:'center'}}>
                        <img alt="" src={data.basic_img} style={{width:'100%',borderRadius:6}}/>
                    </div>
                    <div style={{width:'65%',textAlign:'left',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'3px 5px'}}>
                        <h4>{data.basic_name}</h4>
                        <ul style={{padding:0,overflow:'hidden'}}>
                            <li style={{float:'right'}}>
                               共{data.goods_nums}件
                            </li>
                        </ul>
                        
                    </div>
                </div>
                <h5 style={{fontSize:15,fontWeight:'bold'}}>请选择采购服务：</h5>
                <ul className="cbox-wraper">
                    <CheckboxGroup goods_service={data.service_info} goods_basicid={data.goods_basicid} handleServiceChange={handleServiceChange} />

                </ul>
                <div style={{paddingTop:15}}>
                    <div style={{display:'flex',justifyContent:'space-between'}} className="chose-spec-title">
                        <h5 style={{fontSize:15,fontWeight:'bold'}}>已选商品{parseInt(data.stock_type)===1?'（整手进货）':'（拆码进货）'}</h5>
                    </div>
                    <ul className="chose-spec-wrap">
                        <CheckStepGroup stock_type={data.stock_type} specList={data.goods_info} stockNum={data.stockNum} handleForceFromCart={handleForceFromCart} handleSelCart={handleSelCart}/>
                    </ul>
                </div>
            </div>
            <WhiteSpace style={{height:12,backgroundColor:'#F4F4F4'}}/>
        </>
    )
}

export default (Cart)