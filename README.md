# fillip
======
[![Build Status](https://travis-ci.org/n3m6/fillip.png)](https://travis-ci.org/n3m6/fillip)

API middleware for Node.js and Connect/Express.

Routing, and pre- and post-routing plugins for security, caching and logging.

## About
Motivation for this module comes from attempts to find a more modular and flexible
plugin to handle common API related funcationality.

## Installation

`npm install fillip`

## Example

```
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
  routes: [{
    address:    '/api/hello/:id',
    controller: api.hello,
    caching:    true
  }]
});

app.get('/api/hello:id', function(req, res){
  fillip.apicall(req, res);
});
```

Replace api.hello with your custome api function.

## API

  Funcationality is provided through two primary methods. fillip.initialize()
  and fillip.apicall(). Currently only supports JSON responses.

### fillip.initialize()
  Takes a javascript object with the following mandatory fields
  - logging (boolean, either true or false)
  - caching (javascript object) 
    - type (currently supports only 'redis')
    - db (takes a redis object)
  - routes (an array of routes and their controller functions)
    - address (express.js route that will be handled through middleware)
    - controller (your customer api function, must return a javascript object)
    - caching (optional field, boolean, if true will store objects in db)

### fillip.apicall()
  Invoke this method to let the middle ware handle the request.

## License

(The MIT License)

Copyright (c) 2013 Abdulla Faraz <abdulla.faraz@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


