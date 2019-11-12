import React, { useState, useEffect,useMemo,useRef,useReducer } from 'react';
import { Checkbox,Stepper } from 'antd-mobile';

function CheckboxGroup (props){

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const data = props.goods_service;
    const goods_basicid = props.goods_basicid;
    const handleClick = (e,id) => {
        props.handleServiceChange(e.target.checked,id,goods_basicid);
        forceUpdate()
    }
    return (
        <>
            {
                data.map((item,idx)=>{
                    return (
                        <li key={item.id}>
                            <Checkbox className="cbox" checked={parseInt(item.is_check)===0||!item.is_check?false:true} onChange={(e)=>handleClick(e,item.id)}>
                            {item.name}(+{item.price}元/件)
                            </Checkbox>
                        </li>
                    )
                })
            }
        </>
    )
}

function StepperGroup (props){

    const data = props.specList;
    const { stockNum,stock_type } = props;
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const handleForce = (e,gid,cid) => {
        props.handleForce(e,gid,cid);
        forceUpdate()
    }

    return (
        <>
            {
                data.length > 0 &&
                data.map(item=>
                    <li key={item.goods_id}>
                        <span style={{width:'45%',fontSize:14}}>{item.goods_spec}</span>
                        <span style={{width:'23%',fontSize:14}}>{item.goods_storage}</span>

                        <Stepper
                            style={{ width: '30%', minWidth: '80px' }}
                            showNumber
                            step={stockNum}
                            max={parseInt(item.goods_storage)}
                            min={0}
                            value={item.goods_num}
                            onChange={
                                (e)=>handleForce(e,item.goods_id,item.color_id)
                            }
                        />
                    </li>
                )
            }
        </>
    )
}

const CheckStepGroup = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);    
    const { specList } = props;
    const handleClick = () => {

    }
    const handleForceFromCart = (e,gid,cid) => {
        if(!e){
            return
        }
        props.handleForceFromCart(e,gid,cid);
        //forceUpdate()
    }

    const handleSelCart = (e,id) => {
        props.handleSelCart(e,id)
    }
    return (
        <>
            {
                specList.length > 0 &&
                specList.map(item=>
                    <li key={item.cart_id} style={{display:'flex',justifyContent:'space-between'}}>

                        <Checkbox className="cbox" checked={parseInt(item.is_select)===1?true:false} onChange={(e)=>handleSelCart(e,item.cart_id)} style={{alignSelf:'center'}}></Checkbox>

                        <span style={{width:'45%',fontSize:14}}>{item.goods_spec}</span>
                       <span style={{width:'25%',fontSize:14}}><span style={{color:'#C83B4C',fontWeight:'bold'}}>￥{item.goods_price}</span>/件</span>
                        
                        <Stepper
                            style={{ width: '30%', minWidth: '80px' }}
                            showNumber
                            step={1}
                            max={parseInt(item.goods_storage)}
                            min={0}
                            value={item.goods_num}
                            onChange={
                                (e)=>handleForceFromCart(e,item.cart_id)
                            }
                        />
                    </li>
                )
            }
        </>
    )
}

export {
    CheckboxGroup,
    StepperGroup,
    CheckStepGroup
}

