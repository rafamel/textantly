import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// Polyfill
import 'babel-polyfill';

import 'typeface-playfair-display-sc';
import 'typeface-roboto';
import 'font-awesome/css/font-awesome.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
import 'bootstrap-material-design/dist/css/ripples.css';
import './index.css';

import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;
require('bootstrap');
require('bootstrap-material-design/dist/js/material.js');
require('bootstrap-material-design/dist/js/ripples.js');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// import Canvaser from './engine';

// const Textantly = new Canvaser('#main-canvas');
// Textantly.load('static/default.png').then(() => {
//     global.Textantly = Textantly;
// });
