'use strict';


function Fillip() {
  console.log('fillip running...');
}


// Initialize function to load all parameters
Fillip.prototype.initialize = function(options){
  
  options = options || {};
  
  this.logging = options.logging;
  this.caching = options.caching;
  this.routes = options.routes;

  // throw errors if crucial information is missing
  if(typeof(this.logging) === 'undefined'){
    throw {
      name: 'FillipLoggingOptionNotDefined',
      message: 'Fillip object does not have a logging option'
    };
  }
  
  if(typeof(this.logging) !== 'boolean'){
    throw {
      name: 'FillipLoggingOptionIsNotBoolean',
      message: 'Fillip logging option is not boolean'
    };
  }
  
  if(typeof(this.caching) !== 'object'){
    throw {
      name: 'FillipCachingObjectNotDefined',
      message: 'Fillip caching option not defined'
    };
  }
  
  if(typeof(this.caching.type) === 'undefined'){
    throw {
      name: 'FillipCachingTypeUndefined',
      message: 'Fillip caching type is not given'
    };
  }
  
  if(this.caching.type !== 'redis'){
    throw {
      name: 'FillipCachingTypeUnknown',
      message: 'Fillip caching type is of unknown type'
    };
  }
  
  if(typeof(this.caching.db) === 'undefined'){
    throw {
      name: 'FillipCachingDbUndefined',
      message: 'Fillip caching db not attached'
    };
  }
  
  if(typeof(this.caching.db.RedisClient) !== 'function'){
    throw {
      name: 'FillipCachingDBNotRecognized',
      message: 'Fillip caching db mismatches with defined type'
    };
  }
  
  if(typeof(this.routes) === 'undefined'){
    throw {
      name: 'FillipRouteArrayNotDefined',
      message: 'Fillip route array not given'
    };
  }
  
  if(this.routes.length === 0){
    throw {
      name: 'FillipRouteArrayEmpty',
      message: 'Fillip route array is empty'
    };
  }
  
  this.routes.forEach(function(route){
    if(typeof(route.address) === 'undefined'){
      throw {
        name: 'FillipRouteAddressMissing',
        message: 'Fillip route address missing'
      };
    }
  });
  
  this.routes.forEach(function(route){
    if(typeof(route.address) !== 'string'){
      throw {
        name: 'FillipRouteAddressNotRecognized',
        message: 'Fillip route address is not a string'
      };
    }
  });
  
  this.routes.forEach(function(route){
    if(typeof(route.controller) === 'undefined'){
      throw {
        name: 'FillipRouteControllerMissing',
        message: 'Fillip route controller missing'
      };
    }
  });
  
  this.routes.forEach(function(route){
    if(typeof(route.controller) !== 'function'){
      throw {
        name: 'FillipRouteControllerNotRecognized',
        message: 'Fillip route controller is not a function'
      };
    }
  });
  
  this.routes.forEach(function(route){
    if(typeof(route.caching) !== 'boolean'){
      throw {
        name: 'FillipRouteCachingOptionNotBoolean',
        message: 'Fillip route caching option is not a boolean value'
      };
    }
  });


};

module.exports = new Fillip();


