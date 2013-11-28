'use strict';

var fillip = require('../');
var redis = require('redis');
var redisClient = redis.createClient();
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

  describe('#apicall() Cache', function(){
    
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

    it('should return the request from cache if it is available');
    it('should write to cache if it was previously not stored');

  });


});


