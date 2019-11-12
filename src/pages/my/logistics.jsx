import React, { useState,useMemo,useEffect,useRef,useCallback } from 'react';
import { ShowEditModal } from '../../utility/modal'
import NavTopBar from '../public/navBar'
import './order.css'

export default function Logistics(props){

    return (
        <div style={{padding:'80px 0 60px 0',minHeight:'100vh'}}>
            <NavTopBar title={"物流查询"} />
            <ul className="steps-wrap">
                <div className="sector-line"></div>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>已付款已付款已付</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货代发货</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收待签收收</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>后我就奥法叫我二级访问佛为契机驱蚊器嘎个然而</p>
                </li>
                <li>
                    <span>2019-09-12  16:32</span>
                    <div className={'step-circle step-plaform'}></div>
                    <p>已签收！</p>
                </li>
            </ul>
            
        </div>
    )
}
