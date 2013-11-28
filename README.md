# fillip

[![Build Status](https://travis-ci.org/n3m6/fillip.png)](https://travis-ci.org/n3m6/fillip)

API middleware for Node.js and Connect/Express.

Routing, and pre- and post-routing plugins for security, caching and logging.

## About
Motivation for this module comes from attempts to find a more modular and flexible
plugin to handle common API related funcationality.

## Installation

`npm install fillip`

## Example

```javascript
var fillip  = require('fillip');
var express = require('express');
var redis   = require('redis');
var api     = require('routes/api');

var app = express();

fillip.initialize({
  logging:  true,
  caching:  {
    type:   'redis',
    db:     redis
  },
  routes: {
    hello: {
      address:    '/api/hello/:id',
      controller: api.hello,
      caching:    true,
      expiry:     300
    }
  }
});

app.get('/api/hello:id', function(req, res){
  fillip.apicall(req, res);
});
```

Replace __api.hello__ with your custom api function.

Your controller receives a params object and a callback function. The params object contains request parameters in an associative array.
Your controller should invoke the callback with the json object, as follows -

```javascript
exports.hello = function(params, jsonCall){
  var json = {
    hello: 'world'
  };

  jsonCall(json);

};
```

## API

  Funcationality is provided through two primary methods. fillip.initialize()
  and fillip.apicall(). Currently only supports JSON responses.

### fillip.initialize()
  Takes a javascript object with the following mandatory fields
  - logging (boolean, either true or false)
  - caching (javascript object) 
    - type (currently supports only 'redis')
    - db (takes a redis object)
  - routes (named objects with the following parameters, name must be unique)
    - address (express.js route that will be handled through middleware)
    - controller (your api function, must invoke a callback with the json object)
    - caching (optional field, boolean, if true will store objects in db)
    - expiry (if caching is set, this must be set as well, in seconds, accepts only numbers)

### fillip.apicall(req, res)
  Invoke this method to let the middleware handle the request. Pass in express's request & response.

## Limitations

  - Currently supports only one parameter URL (eg. /api/hello/:id )
  - Logging functionality does not work yet

## License

(The MIT License)

Copyright (c) 2013 Abdulla Faraz <abdulla.faraz@gmail.com>

Refer to included LICENSE file.

