'use strict';


function Fillip() {
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
  
  for(var route in this.routes){
    if(typeof(this.routes[route].address) === 'undefined'){
      throw {
        name: 'FillipRouteAddressMissing',
        message: 'Fillip route address missing'
      };
    }
  }
  
  for(var route in this.routes){
    if(typeof(this.routes[route].address) !== 'string'){
      throw {
        name: 'FillipRouteAddressNotRecognized',
        message: 'Fillip route address is not a string'
      };
    }
  }
  
  for(var route in this.routes){
    if(typeof(this.routes[route].controller) === 'undefined'){
      throw {
        name: 'FillipRouteControllerMissing',
        message: 'Fillip route controller missing'
      };
    }
  }
  
  for(var route in this.routes){
    if(typeof(this.routes[route].controller) !== 'function'){
      throw {
        name: 'FillipRouteControllerNotRecognized',
        message: 'Fillip route controller is not a function'
      };
    }
  }
  
  for(var route in this.routes){
    if(this.routes[route].caching && typeof(this.routes[route].caching) !== 'boolean'){
      throw {
        name: 'FillipRouteCachingOptionNotBoolean',
        message: 'Fillip route caching option is not a boolean value'
      };
    }
  }

  // Create Redis Client
  this.caching.client = this.caching.db.createClient();

};

function routeFound(routeTable, address){
  
  var found = false;
  var routes = [];
  for(var route in routeTable){
    if(routeTable.hasOwnProperty(route)){
      routes.push(routeTable[route]);
    }
  }
  
  found = routes.some(function _findingRoute(route){
    return route.address === address;
  });
  
  return found;
}

function getRouteName(routeTable, address){

  var thisBlock = '';

  for(var route in routeTable){
    if(routeTable[route].address === address) {
      thisBlock = route;
    }
  }
  return thisBlock;
}

// Check cache for the request and serve the request if
// it is available in the cache. Otherwise return a blank
// js object
function cacheCheck(req, res, route, thisObject, callback){

  var cacheKey = req.sessionID + ':' + route;
  
  thisObject.caching.client.get(cacheKey, function(err, reply){

    
    var cacheObject = {};
    if(reply !== null)
    {
      cachObject = reply;
    }

    callback(req, res, route, thisObject, cacheObject);
  });

}

// This method will apply all the general features defined
// at initialization and invoke the controller function
Fillip.prototype.apicall = function(req, res){
  
  if(!routeFound(this.routes, req.route.path)){
    res.send(404);
    return;
  }

  var route = getRouteName(this.routes, req.route.path);
  
  cacheCheck(req, res, route, this, 
    function _checkingCache(req, res, route, thisObject, cacheObject){

    //invoke controller
    if(typeof(thisObject.routes[route].controller) === 'function'){
      res.json(thisObject.routes[route].controller());
    } else {
      res.json({ 404: 'not found' });
    }
  
  });  

};

module.exports = new Fillip();


