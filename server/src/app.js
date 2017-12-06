'use strict';
const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');

// Additional useful middleware
// const RateLimit = require('express-rate-limit');

// rootRequire, config
require('./utils/root-require')(__dirname);
const config = require('./config');

// Initialize Express
const app = express();

// Middleware
app.use(morgan(config.logs)); // Logger
// app.use(bodyParser.json()); // Parser
// app.use(bodyParser.urlencoded({ extended: false })); // Parser
app.use(compress()); // Gzip compression
app.use(helmet()); // Secure headers

app.use(express.static(path.join(__dirname, 'public')));
require('./handler')(app);

app.listen(config.port, () => {
    console.log('Server running on port', config.port);
});
