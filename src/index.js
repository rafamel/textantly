import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import './vendor/bootstrap-material-design-0510/bootstrap-material-design.min.css';
import './vendor/bootstrap-material-design-0510/ripples.min.css';

import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;
require('bootstrap');
require('./vendor/bootstrap-material-design-0510/material.min.js');
require('./vendor/bootstrap-material-design-0510/ripples.min.js');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
