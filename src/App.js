import React from 'react';
import './App.css';
import Login from './pages/login';
import ContentWrapper from './pages/content';
import store from './redux/store'
import 'antd-mobile/dist/antd-mobile.css';
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    ifLogin: state.ifLogin
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      doLogin: () => dispatch({type:'LOGIN'}),
      doLogout: () => dispatch({type:'LOGOUT'})
  }
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = store.getState();
    store.subscribe(this.handleStoreUpdate.bind(this))
  }
  handleStoreUpdate() {
    this.setState(store.getState())
  }
  render() {
    
    console.log('ifLogin??',this.state.ifLogin);
    return (
      <>
        {
          this.state.ifLogin?
          <ContentWrapper />:
          <Login />
        }     
      </>      
      
    )
  }
}

export default connect(mapStateToProps)(App)
