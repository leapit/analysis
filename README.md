# Analysis

## Usage

```
npm install @leapit/analysis
```


## Config your analysis like this

Example
```
var opts = {
    persistence: {
        url: 'mongodb://localhost:27017/analysis',
        mongo: {},
        reports: 'reports',
        logs:'logs'
    },
    ipdata : {
        city: './ipdata/GeoLite2-City.mmdb'
    }
};

```
## Set your analysis middleware,Take express for example

```

var analysis = require('@leapit/analysis');
app.use(analysis(opts));

```

## Usage(in routes),Take express for example

```
/* GET home page. */
router.get('/', function(req, res, next) {

  req.record('index',{"custorm":"here"});
  
  res.render('index', { title: 'Express' });
});

```
