import React, { useState } from 'react';
import TabBarWrapper from '../tabbar/tabbar'
import { Link } from 'react-router-dom';
import NavTopBar from '../public/navBar'
import { List,WhiteSpace,Icon,Toast,ActivityIndicator,TextareaItem } from 'antd-mobile';
import { ShowEditModal } from '../../utility/modal'
import { request,reLogin } from '../../utility/request'
import OrderConfirmItem from '../public/orderConfirmItem'
import './address.css'
import qs from 'querystring'

const Item = List.Item;

const OrderConfirm = (props) => {
    const key = localStorage.getItem('c_token');
    const [loading,setLoading] = useState(true);    
    const [list, setList] = useState([]);
    const [obj,setObj] = useState({});
    const [remarks,setRemarks] = useState('');
    const [visible, setVisible] = useState(false);
    const skipType = localStorage.getItem('skip_type') || 1

    const handleCancel = () => {
        setVisible(false);
        props.history.push('/order_list?o_type=0')
    }
    React.useEffect(() => {
        let url = parseInt(skipType) === 1?"Buy.BuyStep1":"Buy.AtonceBuyStep1";
        let values = parseInt(skipType) === 1?{
            Key:key,
        }:JSON.parse(localStorage.getItem('atOnceBuyInfo'))
        Object.assign(values,{AddressID:parseInt(props.location.search.split("=")[1])})
        request({
            url,
            method:"POST",
            body:qs.stringify(values)
        }).then(function(res){
            console.log(res.data);  
            if(res.flag === 200){
                setList(res.data.cart_list);
                setObj(res.data);
                setLoading(false);
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }, [key,skipType])

    const confirmSubmit = () => {
        //购物车购买与立即购买的参数不一样
        let url = parseInt(skipType) === 1?"Buy.BuyStep2":"Buy.AtonceBuyStep2";
        let values = parseInt(skipType) === 1?{
            Key:key,
            AddressID:parseInt(props.location.search.split("=")[1]),
            OrderMessage:remarks
        }:Object.assign({
            Key:key,
            AddressID:parseInt(props.location.search.split("=")[1]),
            OrderMessage:remarks
        },{GoodsData:JSON.stringify(obj)})
        console.log(obj)
        request({
            url,
            method:"POST",
            body:qs.stringify(values)  
        }).then(function(res){
            console.log(res.data);
            if(res.flag === 200){
                setVisible(true)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    }

    const backFn = () => {
        parseInt(skipType) === 1?
        props.history.push('/cart')
        :
        props.history.goBack()
    }
    return (
        <div style={{minHeight:'100vh',backgroundColor:'#f4f4f4',paddingTop:45,paddingBottom:50}}>
            <NavTopBar title="填写进货单" backFn={backFn}/>
    
            <List style={{textAlign:'center'}}>
                <Link to={"/address_list?skip_type="} style={{width:'100%',display:'block'}}>
                <Item
                    key={3}
                    arrow="horizontal"
                    multipleLine
                    align="middle"
                >
                {
                    obj.address_info && !loading &&
                    <>
                        <div className="check-info">
                            <p>收货人：{obj.address_info.full_name}</p>
                            <p>{obj.address_info.telphone}</p>
                        </div>
                        <div className="check-info-add">收货地址：{obj.address_info.area_info} {obj.address_info.address}</div>
                    </>
                }
                {
                    !obj.address_info && !loading &&
                    <span style={{color:'#969696',fontSize:15}}>请选择收货地址</span>
                }    
                </Item>
                </Link>
            </List>
            <WhiteSpace style={{height:12,backgroundColor:'#F4F4F4'}}/>

            {
                loading && 
                <div className="loading-example">
                    <ActivityIndicator animating />
                </div>
            }
            
            {
                list && list.length>0 &&
                <>
                {list.map((item,idx)=>
                    <OrderConfirmItem key={idx} data={item}/>
                )}
                <List style={{textAlign:'center',fontSize:14}}>
                    <TextareaItem
                        title="备注："
                        placeholder="您对本单的备注内容"
                        autoHeight
                        value={remarks}
                        onChange={(e)=>setRemarks(e)}
                        rows={2}
                    > 
                    </TextareaItem>
                </List>
                </>
            }
            
            <div className="order-confirm-bottom" >
                <div style={{textAlign:'left',alignSelf:'center',paddingRight:8,fontSize:15}}>
                    应付总金额: <span style={{color:'#C83B4C'}}>￥{obj.order_total}</span>
                </div>
                <button style={{width:'30%',color:'#fff',background:'#C83B4C',fontSize:16}} onClick={confirmSubmit}>确认提交</button>
            </div>

            <ShowEditModal
                visible={visible}
                popupVal={false}
                transparent={true}
                handleCancel={handleCancel}
                anType="fade"
                formContent={<OrderModal />}
            /> 
        </div>
    )
}

const OrderModal = () => {

    return (
        <div className="order-modal">
            <img src={require('../../images/cart/submit-done.png')} alt=""/>
            <h3>进货单提交成功</h3>
            <p style={{fontSize:14,margin:'5px 0'}}>为了我们更快协商货期、定金等问题您可拨打下方电话与我们联系</p>
            <a href="tel:13989821708"><img src={require('../../images/cart/tel-icon.png')} alt=""/>拨打电话</a>
            <div className="order-m-bottom">
                <p>电话：<b style={{fontSize:18,color:'#44BAAE',fontWeight:'bold'}}>13403458536</b></p>
                <p>工作时间：<span style={{color:'#4A4A4A'}}>周一至周五，每天9:00—18:00</span></p>
            </div>
        </div>
    )
}
export default (OrderConfirm)