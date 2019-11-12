import React, { useState, useEffect } from 'react';
import { Flex, WhiteSpace,Carousel, WingBlank,Grid,Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import './list.css'
import QueueAnim from 'rc-queue-anim';
import { request } from '../../utility/request'
import qs from 'querystring'

export default function SearchIndex(){

    const [PageIndex,setPageIndex] = useState(1);
    const [goodsList,setGoodsList] = useState([]);
    const key = localStorage.getItem('c_token');

    useEffect(()=>{
        request({
            url:'Selection.GoodsList',
            method:"POST",
            body:qs.stringify({
                Key:key,
                PageIndex
            })
        }).then(function(res){
            console.log(res);
            if(res.flag === 200){
                setGoodsList(res.data)
            }else{
                Toast.fail(res.msg)
            }
        })
    },[key,PageIndex])   
    

    return (
        
        <div style={{textAlign:'center',paddingTop:40}}>
            <QueueAnim>
                <WhiteSpace style={{backgroundColor:'#F8F8F8',marginTop:20}}/>
                <Grid data={goodsList}
                    key={68}
                    columnNum={2}
                    square={false}
                    hasLine={false}
                    renderItem={dataItem => (
                        <div style={{ padding: '12.5px' }}>
                            <Link to={"/goods-detail?gid=" + 3}>
                                <div style={{height:180,overflow:'hidden'}}><img src={dataItem.img} style={{ width: '100%', }} alt="" /></div>
                                <p style={{ color: '#888', fontSize: '14px',marginBottom:0 }}>
                                    {dataItem.desc}
                                </p>
                            </Link>
                            
                        </div>
                    )}
                />
            </QueueAnim>
        </div>
                
    )
}