import React from 'react';
import { createBrowserHistory } from 'history'; 
import { Result, Button } from 'antd';

export default function NotFound(){
    function backHome(){
        createBrowserHistory().push('/')
    }
    return(
        <Result
            status="404"
            title="404"
            subTitle="Sorry, 您访问的页面不存在.."
            extra={<Button type="primary" href="/list/index" >Back Home</Button>}
        />
    )
}