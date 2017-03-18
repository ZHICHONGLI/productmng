var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var Product = require('./app/models/products');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/product'); // connect to our database
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, '/angularjs')));
var port = process.env.PORT || 8080; // set our port
var router = express.Router(); // get an instance of the express Router
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/angularjs', 'index.html'));
});
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.get('/client', function(req, res) {
    res.sendFile(path.join(__dirname, '/angularjs', 'client.html'));
});

router.route('/clilist')

.get(function(req, res) {
    Product.find(function(err, products) {
        if (err)
            res.send(err);

        res.json(products);
    });
});

router.route('/products')

// create a user (accessed at POST http://localhost:8080/api/users)
.post(function(req, res) {

        var prd = new Product(); // create a new instance of the Bear model
        prd.Name = req.body.Name; // set the users name (comes from the request)
        prd.Description = req.body.Description;
        prd.Price = req.body.Price;
        prd.Stock = req.body.Stock;
        prd.Packing = req.body.Packing;
        prd.Status = true;
        prd.id = req.body.id;
        prd.save(function(err) {
            if (err)
                res.send(err);
            Product.find(function(err, prds) {
                if (err)
                    res.send(err);
                res.json(prds);
            });
        });

    })
    // 3rd part

// 4th part -- get the bear list
// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res) {
    Product.find(function(err, products) {
        if (err)
            res.send(err);

        res.json(products);
    });
});
// 4
router.route('/products/:id')

.get(function(req, res) {
    var idx = req.params.id;

    Product.findOne({ 'id': idx }, function(err, prd) {
        if (err)
            res.send(err);

        res.send(prd);
    });
})

.put(function(req, res) {
    var idx = req.params.id;
    Product.findOne({ '_id': idx }, function(err, prd) {
        if (err) {
            res.send(err);
        }
        // console.log("prd is :" + prd);
        prd.Name = req.body.Name;
        prd.Price = req.body.Price;
        prd.Description = req.body.Description;
        prd.Packing = req.body.Packing;
        prd.Stock = req.body.Stock;
        prd.save(function(err) {
            if (err)
                res.send(err);
            Product.find(function(err, prds) {
                if (err)
                    res.send(err);
                res.json(prds);
            });
        });
    });
})

.delete(function(req, res) {
    Product.remove({
        _id: req.params.id
    }, function(err, prd) {
        if (err)
            res.send(err);
        console.log("removed");
        Product.find(function(err, prds) {
            if (err)
                res.send(err);
            res.json(prds);
        })
    });
});

router.route('/products/changeqty/:id')
    .put(function(req, res) {
        var idx = req.params.id;
        Product.findOne({ '_id': idx }, function(err, prd) {
            if (err) {
                res.send(err);
            }
            prd.Stock = req.body.Stock;
            // console.log(prd.Stock);
            prd.save(function(err) {
                if (err)
                    res.send(err);
                // console.log("stock updated");
                res.send("Stock Updated");
            });
        });
    });

router.route('/products/changesta/:id')
    .put(function(req, res) {
        var idx = req.params.id;
        Product.findOne({ '_id': idx }, function(err, prd) {
            if (err) {
                res.send(err);
            }
            prd.Status = req.body.Status;
            prd.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Service updated!' });
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);