'use strict';


function Fillip() {
  console.log('fillip running...');
}

Fillip.prototype.initialize = function(options){
  options = options || {};
  this.logging = options.logging;
  this.caching = options.caching;
};

module.exports = new Fillip();

