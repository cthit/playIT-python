require('./styles/style.css');

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/store';
import App from './App';
import config from './config';

ReactDOM.render(
    <Provider store={store}>
        <App url={config.url} />
    </Provider>,
    document.getElementById('root')
)
