require('./styles/style.css');

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/reducer';
import App from './App';
import { url } from './config';

ReactDOM.render(
    <Provider store={store}>
        <App url={url} />
    </Provider>,
    document.getElementById('root')
)
