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
  
  for(var route1 in this.routes){
    if(typeof(this.routes[route1].address) === 'undefined'){
      throw {
        name: 'FillipRouteAddressMissing',
        message: 'Fillip route address missing'
      };
    }
  }
  
  for(var route2 in this.routes){
    if(typeof(this.routes[route2].address) !== 'string'){
      throw {
        name: 'FillipRouteAddressNotRecognized',
        message: 'Fillip route address is not a string'
      };
    }
  }
  
  for(var route3 in this.routes){
    if(typeof(this.routes[route3].controller) === 'undefined'){
      throw {
        name: 'FillipRouteControllerMissing',
        message: 'Fillip route controller missing'
      };
    }
  }
  
  for(var route4 in this.routes){
    if(typeof(this.routes[route4].controller) !== 'function'){
      throw {
        name: 'FillipRouteControllerNotRecognized',
        message: 'Fillip route controller is not a function'
      };
    }
  }
  
  for(var route5 in this.routes){
    if(this.routes[route5].caching && typeof(this.routes[route5].caching) !== 'boolean'){
      throw {
        name: 'FillipRouteCachingOptionNotBoolean',
        message: 'Fillip route caching option is not a boolean value'
      };
    }
  }

  for(var route6 in this.routes){
    if(this.routes[route6].caching && typeof(this.routes[route6].expiry) === 'undefined'){
      throw {
        name: 'FillipCacheExpiryNotSet',
        message: 'Fillip route cache expiry is not set'
      };
    }
  }

  for(var route7 in this.routes){
    if(this.routes[route7].caching && typeof(this.routes[route7].expiry) !== 'number'){
      throw {
        name: 'FillipCacheExpiryIsNotANumber',
        message: 'Fillip route cache expiry is not a number'
      };
    }
  }


  // Create Redis Client
  this.caching.client = this.caching.db.createClient();

};

// Returns true if the route is found in the object
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

// Returns the name of the route block
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

  if(thisObject.routes[route].caching === true){

    var cacheKey = req.sessionID + ':' + route;
  
    thisObject.caching.client.get(cacheKey, function(err, reply){

    
      var cacheObject = {};
      if(reply !== null)
      {
        cacheObject = reply;
      }

      callback(req, res, route, thisObject, cacheObject);
    });

  } else {
    callback(req, res, route, thisObject, {});
  }

}

// This method will apply all the general features defined
// at initialization and invoke the controller function
Fillip.prototype.apicall = function(req, res){
  
  // Controller was not found for the path. Initialization object error
  if(!routeFound(this.routes, req.route.path)){
    res.send(404);
    return;
  }

  var route = getRouteName(this.routes, req.route.path);
  
  // Check cache for object
  cacheCheck(req, res, route, this, 
    function _checkingCache(req, res, route, thisObject, cacheObject){

    if(Object.keys(cacheObject).length === 0 ) {

      // No cache object was found. Invoking controller
      if(typeof(thisObject.routes[route].controller) === 'function'){
        
        // Controllers should invoke a callback with a json reply
        thisObject.routes[route].controller(function _passingJson(jsonObject){
          
          //If caching is enabled for the route
          if(thisObject.routes[route].caching === true){

            var cacheKey = req.sessionID + ':' + route;

            thisObject.caching.client.setex(cacheKey, thisObject.routes[route].expiry,
              JSON.stringify(jsonObject), function(){
            
              res.json(jsonObject);
          
            });
          } else {

            // No caching required. Send immediately
            res.json(jsonObject);
          
          }
        
        });

      } else {
        res.json({ 404: 'not found' });
      }
     
    } else {
      
      // Cache object was found, so returning it.
      res.json(cacheObject);
    
    }
  });  
};

module.exports = new Fillip();


