
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import './index.css';
import App from './App'
import store from './redux/store'

ReactDOM.render((
//使用Provider 组件将APP主组件包裹住，这样内部组件都有Store种提供的属性。
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById('root'));