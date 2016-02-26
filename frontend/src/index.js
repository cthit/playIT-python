require('./styles/style.css');

import React from 'react';
import App from './App';
import { url } from './config';

React.render(<App url={ url } />, document.getElementById('root'));
