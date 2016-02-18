# Together Analysis

## Config your analysis like this

Example
```
var opts = {
    persistence: {
        url: 'mongodb://localhost:27017/analysis',
        mongo: {},
        reports: 'reports',
        logs:'logs'
    }  
};

```
## Set your analysis middleware

```
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


## More refer to wiki
