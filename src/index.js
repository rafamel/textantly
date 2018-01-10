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

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// import Canvaser from './engine';

// const Textantly = new Canvaser('#main-canvas');
// Textantly.load('static/default.png').then(() => {
//     global.Textantly = Textantly;
// });
