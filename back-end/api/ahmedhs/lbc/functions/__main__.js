const mongoose   = require('mongoose');

let db = null;

module.exports = (name = 'world', callback) => {
      callback('Error: you must specify a function to use', null);
};
