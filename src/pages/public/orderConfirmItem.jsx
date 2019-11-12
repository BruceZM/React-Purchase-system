import React, { useState } from 'react';
import './order_confirm.css'
import { Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { showConfirm } from '../../utility/modal'

const OrderConfirmItem = (props) => {
    const { data } = props;
    console.log(data)

    const handleCheckConfirm = (order_id) => {
        console.log(order_id);
        showConfirm('','是否确认收货？',()=>{
            Toast.success('已确认收货',1,()=>
                props.sectionUpdate()
            )
        })

    }
    
    return(
        <section style={{backgroundColor:'#fff',padding:'5px 10px',marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',overflow:'hidden'}}>
                <div style={{width:'25%',borderRadius:6,overflow:'hidden',alignSelf:'center'}}>
                    <img alt="" src={data.basic_img} style={{width:'100%',borderRadius:6}}/>
                </div>
                <div style={{width:'70%',textAlign:'left',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                    <h4 >{data.basic_name}</h4>
                    
                    <div className="o-c-btn-combine">
                        <Link to={"/logistics?log_id=" + data.order_id}><button className="look-up-logistics">物流查询</button></Link>
                        <button className="check_confirm" onClick={()=>handleCheckConfirm(data.order_id)}>确认收货</button>
                    </div>
                </div>
            </div>
            <h5 style={{fontSize:15,fontWeight:'bold'}}>已选服务：</h5>
            <ul className="chosed-spec-wrap">
                {
                    data.service_info.map((i,idx)=>{
                        if(parseInt(i.is_check) === 1){
                            return (
                            <li key={i.id}>
                                <p>{i.name}</p>
                                <p><span>￥{i.price}</span>/件</p>
                                <p>×{data.goods_nums}</p>
                            </li>
                            )
                        }
                    })
                }
                
            </ul>
            <div style={{paddingTop:15}}>
                <h5 style={{fontSize:15,fontWeight:'bold'}}>已选商品{parseInt(data.stock_type) === 1?'(整手进货)':'(拆码进货)'}：</h5>
                <ul className="chosed-spec-wrap">
                    {
                        data.goods_info.map((item,idx)=>{
                            return (
                                <li key={idx}>
                                    <p>{item.goods_spec}</p>
                                    <p><span>￥{item.goods_price}</span>/件</p>
                                    <p>×{item.goods_num}</p>
                                </li>
                            )
                        })
                    }
                    
                </ul>
            </div>
        </section>
    )
}
export default OrderConfirmItem