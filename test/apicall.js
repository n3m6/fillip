'use strict';

var fillip = require('../');
var redis = require('redis');
var chai = require('chai');
var assert = chai.assert;
//var expect = chai.expect;
var express = require('express');
var request = require('supertest');


var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'helloworldoneminute'}));
app.use(app.router);

describe('Fillip', function(){
    
  beforeEach(function(){
    fillip.initialize({
      logging: true,
      caching: {
        type: 'redis',
        db: redis
      },
      routes: {
        hello: {
          address: '/api/hello/:id',
          controller: function(jsonCall){
            jsonCall({ 
              hello: 'world'
            });  
          },
          caching: true,
          expiry: 60
        },
        world: {
          address: '/api/world/:worldid',
          controller: function(jsonCall){
            jsonCall({
              not: 'this'
            });
          },
          caching: true,
          expiry: 60
        }
      }
    });
  });

  describe('#apicall()', function(){
    
    it('should throw an error if route is not found for the request', function(done){
      app.get('/api/test/:id', function(req, res){
        fillip.apicall(req,res);
      });
      request(app)
        .get('/api/test/?callback=json_callback')
        .expect(404)
        .end(function(err){
          if(err) {
            //console.log(err);
            done(err);
          } else {
            done();
          }
        });
    });

    it('should expect a HTTP 200 status message if the path is detected', function(done){
      app.get('/api/hello/:id', function(req, res){
        fillip.apicall(req,res);
      });
      request(app)
        .get('/api/hello/1')
        .expect(200)
        .end(function(err){
          if(err) {
            //console.log(err);
            done(err);
          } else {
            done();
          }
        });
    });

    it('should return the request from cache if it is available');

    it('should invoke the correct controller', function(done){
      app.get('/api/hello/:id', function(req, res){
        fillip.apicall(req, res);
      });

      request(app)
        .get('/api/hello/1')
        .expect(200)
        .end(function(err, res){
          if(err) {
            //console.log(err);
            done(err);
          } else {
            //console.log(res.body);
            assert(res.body.hello === 'world');
            done();
          }
        });

    });

    it('should write to cache if it was previously not stored');

    it('should write all requests to log if logging is enabled');

  });

});


