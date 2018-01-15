import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// Polyfills
import 'babel-polyfill';
import 'dom4';

import 'typeface-playfair-display-sc';
import 'typeface-roboto';
import 'font-awesome/css/font-awesome.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
// TODO
// registerServiceWorker();
