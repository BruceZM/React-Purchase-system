import React from 'react';
import { TabBar } from 'antd-mobile';
import { withRouter,Link } from 'react-router-dom';

class TabBarBottom extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedTab: 'list',
      };
    }
    
    componentDidMount(){
        const { pathname } = this.props.location;
        switch (pathname) {
            case '/list/index':
                this.setState({
                    selectedTab: 'list',
                })
                break;
            case '/cart':
                this.setState({
                    selectedTab: 'cart',
                })
                break;
            case '/my':
                this.setState({
                    selectedTab: 'my',
                })
                break;
            default:
                break;
        }

    }
    render() {
    return (
        <div style={{ position: 'fixed', height: 50, width: '100%', bottom:0,maxWidth:768 }}>
        <TabBar
            unselectedTintColor="#949494"
            tintColor="#44BAAE"
            barTintColor="white"
        >
            <TabBar.Item
            icon={{ uri: require('../../images/tabbar/list.png')}}
            selectedIcon={{ uri: require('../../images/tabbar/list-selected.png') }}
            title="采购"
            key="list"
            selected={this.state.selectedTab === 'list'}
            onPress={() => {
                    if(this.state.selectedTab === 'list'){
                        return
                    }
                    this.props.history.push("/list/index");
            }}
            data-seed="logId1"
            >

            </TabBar.Item>
            <TabBar.Item
            icon={{ uri: require('../../images/tabbar/cart.png')}}
            selectedIcon={{ uri: require('../../images/tabbar/cart-selected.png') }}
            title="购物车"
            key="cart"
            selected={this.state.selectedTab === 'cart'}
            onPress={() => {
                    if(this.state.selectedTab === 'cart'){
                        return
                    }
                    this.props.history.push("/cart");
                }}
            >

            </TabBar.Item>

            
                <TabBar.Item
                icon={{ uri: require('../../images/tabbar/my.png')}}
                selectedIcon={{ uri: require('../../images/tabbar/my-selected.png') }}
                title="我的"
                key="my"
                selected={this.state.selectedTab === 'my'}
                onPress={() => {
                    if(this.state.selectedTab === 'my'){
                        return
                    }
                    this.props.history.push("/my");
                }}
                >
                </TabBar.Item>
            
        </TabBar>
        </div>
    );
    }
}
  
const TabBarWithRouter = withRouter(TabBarBottom);
export default function TabBarWrapper(props){
    return (
        <TabBarWithRouter {...props}/>
    )
}

