'use strict';

var fillip = require('../');
var redis = require('redis');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var express = require('express');
var request = require('supertest');


var app = express();


describe('Fillip', function(){
    
  beforeEach(function(){
    fillip.initialize({
      logging: true,
      caching: {
        type: 'redis',
        db: redis
      },
      routes: [{
        address: '/api/hello/:id',
        controller: function(err, req, res, callback){
          callback(err, req, res, { 
            hello: req.params.id
          });
        },
        caching: true
      }]
    });
  });

  describe('#apicall()', function(){
    
    it('should throw an error if route is not found for the request', function(){
      app.get('/api/test/:id', function(req, res){
        fillip.apicall(req,res);
      });
      request(app)
        .get('/api/test/1')
        .expect(404)
        .end(function(err){
          if(err) {
            throw err;
          }
        });
    });
  });

});


