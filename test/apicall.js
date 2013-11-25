'use strict';

var fillip = require('../');
var redis = require('redis');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var express = require('express');
var request = require('supertest');

describe('Fillip', function(){

  beforeEach(function(){
    var app = express();
    fillip.initialize({
      logging: true,
      caching: {
        type: 'redis',
        db: redis
      },
      routes: [{
        address: '/api/hello/:id',
        controller: function(req, res, callback){
          callback(req, res, { 
            hello: req.params.id
          });
        },
        caching: true
      }]
    });
  });

  describe('#apicall()', function(){
    it('should throw an error if no request or response object is defined', function(){
      // Test with Supertest by Visionmedia    
    });
  });

});


