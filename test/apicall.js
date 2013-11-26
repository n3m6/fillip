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
        controller: function(req, res){
          return { 
            hello: 'world'
          };
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
        .end(function(err, res){
          if(err) {
            throw err;
          }
        });
    });

    it('should expect a HTTP 200 status message if the path is detected', function(){
      app.get('/api/hello/:id', function(req, res){
        fillip.apicall(req,res);
      });
      request(app)
        .get('/api/hello/1')
        .expect(200)
        .end(function(err, res){
          if(err) {
            throw err;
          }
        });
    });

    it('should invoke the cache checker');

    it('should invoke the correct controller', function(){
      app.get('/api/hello/:id', function(req, res){
        fillip.apicall(req, res);
      });

      request(app)
        .get('/api/hello/1')
        .expect(200)
        .end(function(err, res){
          assert(res.body.hello === 'world');
        });

    });

    it('should invoke the cache writer');

    it('should invoke the logger');

  });

});


