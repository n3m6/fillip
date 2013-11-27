'use strict';

var fillip = require('../');
var redis = require('redis');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Fillip', function(){
  describe('#initialize()', function(){
    
    it('should set parameters for the Fillip object', function(){
      fillip.initialize({
        logging:      true,
        caching: {
          type:       'redis',
          db:         redis
        },
        routes: { 
          hello: {
            address:    '/api/hello',
            controller: function(jsonCall){
              jsonCall({ hello: 'world' });
            },
            caching:    true,
            expiry:     60
          }
        }
      });
      
      assert.isBoolean(fillip.logging, 'logging option not found');
      assert.isObject(fillip.caching, 'caching options not found');
      assert.isString(fillip.caching.type, 'caching type not found');
      assert.isObject(fillip.caching.db, 'caching db object not found');
      assert.isObject(fillip.routes, 'routes array not found');
      assert.isString(fillip.routes.hello.address, '1st route has no route defined');
      assert.isFunction(fillip.routes.hello.controller, '1st route has no controller');
      assert.isBoolean(fillip.routes.hello.caching, '1st route cache is not a boolean');
      assert.isNumber(fillip.routes.hello.expiry, '1st route cache expiry is not a number');
    });
    
    it('should throw an error if logging is not defined', function(){
      expect(function(){
        fillip.initialize({
          // no logging option given
        });
      }).to.throw();
    });
    
    it('should throw an error if logging is not a boolean', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: 'hello'
        });
      }, 'Fillip logging option is not boolean');
    });
    
    it('should throw an error if a caching object is not given', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true
          // no caching option given
        });
      }, 'Fillip caching option not defined');
    });
    
    it('should throw an error if caching object does not have a type', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
          }
        });
      }, 'Fillip caching type is not given');
    });
    
    it('should throw an error if caching object is of an unrecognized type', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: ''
          }
        });
      }, 'Fillip caching type is of unknown type');
    });
    
    it('should throw an error if caching object does not have a db attached', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            // db not defined
          }
        });
      }, 'Fillip caching db not attached');
    });
    
    it('should throw an error if caching object db mismatches with defined type', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            db: {
              RedisClient: {}
            }
          }
        });
      }, 'Fillip caching db mismatches with defined type');
    });
    
    it('should throw an error if route array is not given', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true, 
          caching: {
            type: 'redis',
            db: redis
          }
          // route array not given 
        });
      }, 'Fillip route array not given');
    });
    
    it('should throw an error if route array is empty', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            db: redis
          },
          routes: []
        });
      }, 'Fillip route array is empty');
    });
    
    it('should throw an error if routes have missing addresses', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            db: redis
          },
          routes: {
            nothing: 'no'
          }
        });
      }, 'Fillip route address missing');
    });
    
    it('should throw an error if route addresses are not strings', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            db: redis
          },
          routes: {
            hello: {
              address: 1
            }
          }
        });
      }, 'Fillip route address is not a string');
    });
    
    it('should throw an error if routes have missing controllers', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            db: redis
          },
          routes: {
            hello: {
              address: '/api/user'
            }
          }
        });
      }, 'Fillip route controller missing');
    });
    
    it('should throw an error if route controllers are not functions', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true, 
          caching: {
            type: 'redis',
            db: redis
          },
          routes: {
            hello: {
              address: '/api/user',
              controller: { hello: 1 }
            }
          }
        });
      }, 'Fillip route controller is not a function');
    });
    
    it('should throw an error if optional caching option is not a boolean', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis',
            db: redis
          },
          routes: {
            hello: {
              address: '/api/user',
              controller: function(jsonCall){ jsonCall({ world: 'hello' }); },
              caching: 1
            }
          }
        });
      }, 'Fillip route caching option is not a boolean value');
    });

    it('should throw an error if caching is enabled and expiry is not set', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis', 
            db: redis
          },
          routes: {
            hello: {
              address: '/api/user',
              controller: function(jsonCall){ jsonCall({ world: 'hello' }); },
              caching: true
            }
          }
        });
      }, 'Fillip route cache expiry is not set');
    });

    it('should throw an error if cache expiry is not a number', function(){
      assert.throw(function(){
        fillip.initialize({
          logging: true,
          caching: {
            type: 'redis', 
            db: redis
          },
          routes: {
            hello: {
              address: '/api/user',
              controller: function(jsonCall){ jsonCall({ world: 'hello' }); },
              caching: true,
              expiry: 'foahbodey'
            }
          }
        });
      }, 'Fillip route cache expiry is not a number');
    });

    it('should create a redis client on initialization', function(){
      fillip.initialize({
        logging: true,
        caching: {
          type: 'redis',
          db: redis
        },
        routes: {
          hello: {
            address: '/api/user', 
            controller: function (jsonCall) { jsonCall({ hello: 'hello' }); }, 
            caching: true,
            expiry: 60
          }
        }
      });
      assert.isObject(fillip.caching.client, 'db client attached as function');
    });
  });
});


