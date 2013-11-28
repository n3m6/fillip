'use strict';

var fillip = require('../');
var redis = require('redis');
var rclient = redis.createClient();
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
          controller: function(params, jsonCall){
            jsonCall({ 
              hello: 'world'
            });  
          },
          caching: true,
          expiry: 60
        },
        world: {
          address: '/api/world/:worldid',
          controller: function(params, jsonCall){
            jsonCall({
              not: 'this'
            });
          },
          caching: true,
          expiry: 60
        },
        moon: {
          address: '/api/moon/:moonid',
          controller: function(params, jsonCall){
            if(params.moonid === '1'){
              jsonCall({
                moon: 'europa'
              });
            } else if(params.moonid === '2'){
              jsonCall({
                moon: 'io'
              });
            } else if(params.moonid === '3'){
              jsonCall({
                moon: 'callisto'
              });
            } else {
              jsonCall({
                moon: 'ganymede'
              });
            }
          },
          caching: true,
          expiry: 60
        },
        sun: {
          address: '/api/sun/:sunid',
          controller: function(params, jsonCall){
            if(params.sunid === '1'){
              jsonCall({
                sun: 'sirius'
              });
            } else if (params.sunid === '2'){
              jsonCall({
                sun: 'aldebaran'
              });
            } else {
              jsonCall({
                sun: 'rigel'
              });
            }
          },
          caching: true,
          expiry: 60
        }
      }
    });
 
    app.get('/api/sun/:sunid', function(req, res){
      fillip.apicall(req, res);
    });
  });

  describe('#apicall() Cache', function(){
    
    it('should write to cache if it was previously not stored', function(done){
      var key = '';
      app.get('/api/hello/:id', function(req, res){
        key = req.sessionID + ':hello:1';
        rclient.get(key, function(err, reply){
          assert.isNull(reply, 'is not null');
          fillip.apicall(req,res);
        }); 
      });
      request(app)
        .get('/api/hello/1')
        .expect(200)
        .end(function(err){
          if(err) {
            throw err;
          }
          rclient.get(key, function(err, reply){
            assert.isNotNull(reply, 'is null, should be not null');
            done();
          });
        });
    });
    
    it('should match the first response stored in cache', function(done){
      var key = '';
      var first = false;
      var firstReply = '';
      app.get('/api/world/:worldid', function(req, res){
        key = req.sessionID + ':world:1';
        if(!first){
          rclient.get(key, function(err, reply){
            assert.isNull(reply, 'is not null');
            fillip.apicall(req,res);
          }); 
        } else {
          fillip.apicall(req, res);
        }
      });
      // first request. should store the key
      request(app)
        .get('/api/world/1')
        .expect(200)
        .end(function(err){
          if(err) {
            throw err;
          }
          // execute second request
          rclient.get(key, function(err, reply){
            firstReply = reply;
            request(app)
              .get('/api/world/1')
              .expect(200)
              .end(function(err, res){
                if(err) {
                  throw err;
                }
                assert.strictEqual(JSON.stringify(res.body), firstReply, 
                  'store cache object and reply not the same');
                done();
              });  
          });
        });
    });

    it('should not respond with the same reply for different parameters', function(done){
      var key = '';
      var first = false;
      var firstReply = '';
      app.get('/api/moon/:moonid', function(req, res){
        key = req.sessionID + ':moon:' + req.params[Object.keys(req.params)[0]];
        if(!first){
          rclient.get(key, function(err, reply){
            assert.isNull(reply, 'is not null');
            fillip.apicall(req,res);
          }); 
        } else {
          fillip.apicall(req, res);
        }
      });
      // first request. should store the key
      request(app)
        .get('/api/moon/1')
        .expect(200)
        .end(function(err){
          if(err) {
            throw err;
          }
          // execute second request
          rclient.get(key, function(err, reply){
            firstReply = reply;
            request(app)
              .get('/api/moon/2')
              .expect(200)
              .end(function(err, res){
                if(err) {
                  throw err;
                }
                assert.notStrictEqual(JSON.stringify(res.body), firstReply, 
                  'stored cache object and reply is the same');
                done();
              });  
          });
        });
    });

    it('should hit the cache with the same key for the same session', function(){
      var cookie;

      request(app)
        .get('/api/sun/1')
        .expect(200)
        .end(function(err, res){
          if(err){
            throw err;
          }
          cookie = res.header['set-cookie'];
          request(app)
            .get('/api/sun/1')
            .set('cookie', cookie)
            .expect(200)
            .end(function(err){
              if(err){
                throw err;
              }
            });
        });
    });
    
    //it block
  });
});


