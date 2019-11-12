import React from 'react';
import { NavBar,Icon } from 'antd-mobile';
import {withRouter} from "react-router-dom";


//头部返回组件
const NavTopBar= (props) => {
    const { backFn } = props;
    const back = () => {
        if(!backFn){
            props.history.goBack();
        }else{
            backFn()
        }
        
    }
    
    return(
        <NavBar
            mode="dark"
            icon={<Icon type="left" size="md"/>}
            onLeftClick={back}
            style={{position:'fixed',width:'100%',maxWidth:768,zIndex:1828,top:0,backgroundColor:'#44BAAE'}}
            >{props.title}</NavBar>
    )
}

export default withRouter(NavTopBar);