import React, { useState,useMemo,useEffect,useRef,useCallback } from 'react';
import { ShowEditModal } from '../../utility/modal'
import NavTopBar from '../public/navBar'
import { Steps, WingBlank, WhiteSpace } from 'antd-mobile';
import './order.css'

export default function ConsultLog(props){
    const Step = Steps.Step;
    const [visible,setVisible] = useState(false);
    const [id,setId] = useState(1);

    const handleCancel = () => {
        setVisible(false);
    }

    const handleClickLook = (id) => {
        setVisible(true);
        setId(id)
    }
    return (
        <div style={{padding:'80px 0 60px 0',minHeight:'100vh'}}>
            <NavTopBar title={"协商记录"} />
            <ul className="steps-wrap">
                <div className="sector-line"></div>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>您已支付尾款（1000元）</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-customer'}></div>
                    <p>您已支付尾已支付已支付已支付款（1000元）</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>您已支付尾款（1000元）<button onClick={()=>handleClickLook(2)}>(点击查看)</button></p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-customer'}></div>
                    <p>您已支付尾已支付已支付已支付款（1000元）<button onClick={()=>handleClickLook(4)}>(点击查看)</button></p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>您已支付尾款（1000元）<button >(点击查看)</button></p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>您已支付尾款（1000元）<button onClick={()=>handleClickLook(2)}>(点击查看)</button></p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-customer'}></div>
                    <p>您已支付尾已支付已支付已支付款（1000元）<button onClick={()=>handleClickLook(4)}>(点击查看)</button></p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>您已支付尾款（1000元）<button >(点击查看)</button></p>
                </li>
            </ul>
            <ShowEditModal
                visible={visible}
                popupVal={false}
                transparent={true}
                handleCancel={handleCancel}
                formContent={<LookModal id={id}/>}
            /> 
        </div>
    )
}

const LookModal = function (props) {

    console.log(props.id)
    return (
        <div className="log-modal">
            <h3>进货单</h3>
            <ul>
                <li><span>进货单总金额：</span><p>￥3523.35</p></li>
                <li><span>需支付笔数：</span><p>3笔</p></li>
                <li><span>定金金额：</span><p>￥1000</p></li>
                <li><span>货款金额：</span><p>￥1000</p></li>
                <li><span>尾款金额：</span><p>￥1000</p></li>
                <li><span>预计发货时间：</span><p>2019-12-21</p></li>
                <li><span>邮寄方式：</span><p>XXXXX</p></li>
                <li><span>快递费支付：</span><p>到付</p></li>
                <li><span>快递费金额：</span><p>￥62</p></li>
            </ul>
        </div>
    )
}