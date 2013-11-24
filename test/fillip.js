'use strict';

var fillip = require('../');
var redis = require('redis');
var chai = require('chai');
var assert = chai.assert;

describe('Fillip', function(){
  describe('#initialize()', function(){
    it('should set parameters for the Fillip object', function(){
      fillip.initialize({
        logging     : true,
        caching: {
          enabled   : true,
          type      : 'redis',
          db        : redis
        }
      });
      
      assert.isBoolean(fillip.logging, 'logging option not found');
      assert.isObject(fillip.caching, 'caching options not found');
      assert.isBoolean(fillip.caching.enabled, 'caching enabled not found');
      assert.isString(fillip.caching.type, 'caching type not found');
      assert.isObject(fillip.caching.db, 'caching db object not found');
    });
  });
});


