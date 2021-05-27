const path = require('path');
const express = require('express');

const root = path.join(__dirname, 'www');
const options = {
  maxAge: '1m',
};

module.exports = express.static(root, options);
