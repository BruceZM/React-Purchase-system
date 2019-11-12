import React, { useState,useEffect,useCallback } from 'react';
import TabBarWrapper from '../tabbar/tabbar'
import { Link } from 'react-router-dom';
import NavTopBar from '../public/navBar'
import { Checkbox,Stepper,WhiteSpace,Toast,ActivityIndicator } from 'antd-mobile';
import { request,reLogin } from '../../utility/request'
import { Icon } from 'antd'; // 加载 JS
import './address.css'
import qs from 'querystring'
import { showConfirm } from '../../utility/modal'

const AddressList = (props) => {
    const key = localStorage.getItem('c_token') || '';
    const [addressList, setAddressList] = useState([]);
    const [force, setForce] = useState(24);
    const [loading,setLoading] = useState(true);    
    
    useEffect(()=>{
        request({
            url:'Buy.AddressList',
            method:"POST",
            body:qs.stringify({
                Key:key,
            })  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setAddressList(res.data);
                setLoading(false);
                
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    },[key,force])

    const handleUpdate = () => {
        setForce(n=>n+2);
    }
    return (
        <div style={{minHeight:'100vh',paddingTop:45,paddingBottom:60}} className={!addressList?"white-background":'grey-background'}>
            <NavTopBar title="收货地址管理" backFn={()=>props.history.goBack()}/>
            {
                loading && 
                <div className="loading-example">
                    <ActivityIndicator animating />
                </div>
            }
            {
                !loading && !addressList && 
                <div style={{paddingTop:'40%',textAlign:'center'}}>
                    <img alt="" src={require('../../images/cart/no-address.png')} style={{width:80}}/>
                    <h3 style={{color:'#999999',marginTop:20,fontSize:14}}>还没有收货地址哦，添加收货地址下单更方便~</h3>
                </div>
            }
            
            {
                !loading && addressList &&
                addressList.map(item=>
                    <AddressItem data={item} key={item.address_id} handleUpdate={handleUpdate}/>
                )
            
            }
            <div className="fixed-bottom-button">
                <Link to="/address_edit?a_id=0" >添加新地址</Link>
            </div>
        </div>
    )
}

const AddressItem = (props) => {

    const { data } = props;
    const AddressID = data.address_id;
    const key = localStorage.getItem('c_token') || '';
    const setDefault = useCallback(
        () => {
            request({
                url:'Buy.SetDefaultAddress',
                method:"POST",
                body:qs.stringify({
                    Key:key,
                    AddressID:AddressID
                })  
            }).then(function(res){
                console.log(res.data);
                if(res.flag === 200){
                    Toast.success(res.msg,1,()=>props.handleUpdate())
                }else if(res.flag === 420){
                    reLogin()
                }else{
                    Toast.fail(res.msg)
                }
            })
    },[key,AddressID])

    const handleAddDelete = useCallback(
        () => showConfirm('','确定要删除吗？',()=>{
                request({
                    url:'Buy.DelAddress',
                    method:"POST",
                    body:qs.stringify({
                        Key:key,
                        AddressID:AddressID
                    })  
                }).then(function(res){
                    console.log(res.data);
                    if(res.flag === 200){
                        Toast.success(res.msg,1,()=>props.handleUpdate())
                    }else if(res.flag === 420){
                        reLogin()
                    }else{
                        Toast.fail(res.msg)
                    }
                })
            }) 
        ,[key,AddressID])

    return(
        <>
            <div className="ad-wrap">
                <div className="ad-top">
                    <Link to={`/order_confirm?addressId=${data.address_id}`}>
                        <div className="ad-top-info">
                            <p>{data.full_name}</p>
                            <p>{data.telphone}</p>
                        </div>
                        <p style={{fontSize:14}}>收货地址：{data.area_info} {data.address}</p>
                    </Link>
                    
                </div>
                <div className="ad-bot">
                    <Checkbox className="cbox" checked={parseInt(data.is_default)===1?true:false} onChange={setDefault}>
                    默认地址
                    </Checkbox>
                    <div className="handle-address">
                        <Link to={"address_edit?a_id="+data.address_id}>
                            <div>
                                <Icon type="edit"/>编辑
                            </div>
                        </Link>
                        <div style={{marginLeft:15}} onClick={handleAddDelete}>
                            <Icon type="delete"/>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
            </div>
            <WhiteSpace style={{height:12,backgroundColor:'#F4F4F4'}}/>
        </>
    )
}
export default (AddressList)