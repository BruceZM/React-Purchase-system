import React, { useState, useEffect } from 'react';
import { Flex, WhiteSpace,Carousel, WingBlank,Grid,Toast,PullToRefresh } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TabBarWrapper from '../tabbar/tabbar'
import './list.css'
import QueueAnim from 'rc-queue-anim';
import { request,reLogin } from '../../utility/request'
import qs from 'querystring'

  
export default function ListPage(){

    const [PageIndex,setPageIndex] = useState(1);
    const [banners,setBanners] = useState([]);
    const [goodsList,setGoodsList] = useState([]);
    const [refreshing,setRefreshing] = useState(false);
    const key = localStorage.getItem('c_token');

    useEffect(()=>{
        request({
            url:'Selection.IndexAdv',
            method:"POST",
            body:qs.stringify({
                Key:key
            })
        }).then(function(res){
            console.log(res);
            if(res.flag === 200){
                setBanners(res.data.adv_list)
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    },[key])

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
            }else if(res.flag === 420){
                reLogin()
            }else{
                Toast.fail(res.msg)
            }
        })
    },[key,PageIndex])   
    

    return (
        // <PullToRefresh refreshing={refreshing} 
        //     onRefresh={() => {
        //         setRefreshing(true)
        //         setTimeout(() => {
        //             setRefreshing(false)
        //         }, 1000);        }}
            
        // >
        <div style={{textAlign:'center',paddingTop:40}}>
            <QueueAnim>
                <WhiteSpace key={32} />
                    <div className="search-top">
                        <WingBlank style={{display: 'flex',justifyContent: 'center'}}>
                            <Link to="/categories">分类</Link>
                            <Link className="search-right" to="/search">
                                <img src={require('../../images/search-icon.png')}/>
                            </Link>
                        </WingBlank>
                    </div>
                    <WingBlank>
                    <Carousel autoplay infinite >
                    {banners.map((item,idx) => (
                        <a
                        key={item.activity_id}
                        href=""
                        style={{ display: 'inline-block', width: '100%', height: 'auto' }}
                        >
                        <img
                            src={item.adv_content}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            
                        />
                        </a>
                    ))}
                    </Carousel>
                </WingBlank>
                <WhiteSpace/>
                <WingBlank key={52}>
                    <Flex>
                        <Flex.Item><img alt="" src={require('../../images/nav-btn1.png')} style={{width:'100%'}}/></Flex.Item>
                        <Flex.Item><img alt="" src={require('../../images/nav-btn2.png')} style={{width:'100%'}}/></Flex.Item>
                    </Flex>
                </WingBlank>

                <WhiteSpace style={{backgroundColor:'#F8F8F8',marginTop:20}}/>
                <WhiteSpace/>
                <Flex key={6} >
                    <Flex.Item><img alt="" src={require('../../images/recommend.png')} style={{width:'50%',display:'block',margin:'0 auto'}}/></Flex.Item>
                </Flex>
                <WhiteSpace/>
                
                <div style={{paddingBottom:50,padding:'0 6px 50px 6px'}}>
                    <Grid data={goodsList}
                        key={68}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        renderItem={dataItem => (
                            <div style={{ padding: '0 6px' }}>
                                <Link to={"/goods-detail?gid=" + dataItem.goods_basicid} style={{textAlign:'left'}}>
                                    <div style={{height:180,overflow:'hidden',borderTopLeftRadius:6,borderTopRightRadius:6}}>
                                        <img src={dataItem.goods_image} style={{ width: '100%', }} alt="" />
                                    </div>
                                    <p style={{ color: '#888', fontSize: '14px',marginBottom:0,minHeight:40 }}>
                                        {dataItem.goods_name}
                                    </p>
                                    <div style={{display:'flex',justifyContent:'space-between'}}>
                                        <p style={{color:'#C83B4C'}}>{dataItem.goods_wholesale_price1}</p>
                                        <span style={{color:'#9C9C9C',fontSize:12}}>{dataItem.stock_begin_num}件起批</span>
                                    </div>
                                </Link>
                                
                            </div>
                        )}
                    />
                </div>
                
            </QueueAnim>
            <TabBarWrapper/>
        </div>
        // </PullToRefresh>        
    )
}

