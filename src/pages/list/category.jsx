import React, { useState, useEffect } from 'react';
import { NavBar,List,Icon,Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import NavTopBar from '../public/navBar'
import QueueAnim from 'rc-queue-anim';
import { request } from '../../utility/request'
import qs from 'querystring'

const Item = List.Item;

export default function Categories(){
    const [list,setList] = useState([]);
    const key = localStorage.getItem('c_token');
    
    useEffect(()=>{
        request({
            url:'Selection.GetClass',
            method:"POST",
            body:qs.stringify({
                Key:key
            })
        }).then(function(res){
            console.log(res);
            if(res.flag === 200){
                setList(res.data);
            }else{
                Toast.fail(res.msg)
            }
        })
        
    },[key])
    return (
        <>
            <NavTopBar title="分类" key="31" backFn={false}/>
            <List className="cate-wrap"  key="351">
            <QueueAnim duration={200} interval={70}>
            {
                list.length > 0 &&
                list.map((item,idx)=>{
                    return (
                        <Item
                            key={item.class_id}
                            arrow="horizontal"
                            multipleLine
                            onClick={() => {}}
                            platform="android"
                            align="middle"
                        >
                        <Link to={"/search_index?class_id=" + item.class_id} style={{width:'100%',display:'block'}}>
                            {/* <img src={require(`../../images/cates/cate-icon${idx+1}.png`)} alt=""/> */}
                            <span>{item.class_name}</span>
                            {/* <Icon type="right" /> */}</Link>
                        </Item>
                    )
                })
            }
            </QueueAnim>    
            </List>
        </>
        
        // <ul className="cate-wrap">
        //     {
        //         list.length > 0 &&
        //         list.map((item,idx)=>{
        //             return (
        //                 <li>
        //                     <Link to="/s" style={{width:'100%',display:'block',height:60}}>
        //                         <img src={require(`../../images/cates/cate-icon${idx+1}.png`)} alt=""/>
        //                         <span>{item.desc}</span>
        //                         <Icon type="right" />
        //                     </Link>
                            
        //                 </li>
        //             )
        //         })
        //     }
        // </ul>
    )
}