# simplegett

Simple ge.tt API client.

## Installation

```
npm install simplegett
```

## Usage

```javascript
var gett = require('simplegett');

var key = '';     //your API key
var email = '';   //your email
var password = '';//your password

gett.uploadFile(key, email, password,
    'test.txt', new Buffer('hello world!'),
    function(err, fileMeta) {
        console.log('err      :', err);
        console.log('fileMeta :', fileMeta);
    }
);

```