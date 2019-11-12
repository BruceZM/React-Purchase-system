import React from 'react';
import { Route,Redirect,Switch,BrowserRouter,withRouter } from 'react-router-dom';
import { routes } from '../utility/routers'
import { Result, Button } from 'antd';
import NotFound from './notFound';

const ContentDetail = (props) => {

    return (
        <>
            <Switch>
                {
                    routes.map((item,idx)=>{
                        return <Route path={item.path} component={item.comp} key={idx} />
                    })
                }
                <Route path='/' exact render={()=> (
                    <Redirect to="/list/index"/>
                )}/>
                <Route path="/notFound" component={NotFound} /> 
                <Redirect to="/notFound" />
            </Switch>
        </>
    )
    
}
const WithRouterContentDetail = withRouter(ContentDetail);

export default function ContentWrapper(props){

    return (
        <BrowserRouter>
            <WithRouterContentDetail {...props}/>
        </BrowserRouter>
    )
}

