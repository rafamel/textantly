'use strict';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// Bootstrap material
import '../libraries/bootstrap-material-design-0510/material.min.js';
import '../libraries/bootstrap-material-design-0510/bootstrap-material-design.min.css';
import '../libraries/bootstrap-material-design-0510/ripples.min.js';
import '../libraries/bootstrap-material-design-0510/ripples.min.css';

// Textantly
import './assets/style.css';
import Canvaser from './engine';

const Textantly = new Canvaser('#main-canvas');
Textantly.load('static/default.png').then(() => {
    global.Textantly = Textantly;
});
