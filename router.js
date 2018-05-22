const Authentication = require('./controllers/authentication');
const passportService = require('./server/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false })

const Sticker = require('./models/sticker');
const User = require('./models/user');

module.exports = (app) => {
    
    app.get('/', requireAuth, function(req, res) {
        res.send({ hi: 'there' })
    });

    app.post('/signin', requireSignin, Authentication.signin);

    app.post('/signup', Authentication.signup);

    app.put('/user/update', requireAuth, (req, res, next) => {

  
        const currentEmail = req.body.currentEmail;

        const newEmail = req.body.email;
        const name = req.body.name;
        const address = req.body.address;
        const city = req.body.city;
        const state = req.body.state;
        const zipcode = req.body.zipcode;

        if(req.body.newPassword != req.body.confirmPassword) {
            res.send('new password does not match confirm password');
        }
    
        User.findOne({ email: currentEmail }, (err, user) => {
            if(err) return next(err); 
    
            
            user.comparePassword(req.body.currentPassword, (err, isMatch) => {
                if(err) { res.send(err) }
        
                if(!isMatch) {
                    res.send('current password field does not match logged in users password')
                } else {
                    user.password = req.body.newPassword;
                    user.email = newEmail;
                    user.name = name;
                    user.address = address;
                    user.city = city;
                    user.state = state;
                    user.zipcode = zipcode;
            
                    user.save(err => {
                        if(err) { return next(err); }  
                        res.json(user);
                    });
                }
      

            })
        })
    
    });

    // {
    //     "email": "max@max.com",
    //     "password": "password"
    // }

    app.put('/products/edit/:id', (req, res, next) => {
        Sticker.findOne({
            _id: req.params.id
        })
    
        .then(sticker => {
            sticker.category = req.body.category
            sticker.save()
                .then(sticker => {
                    res.send('item successfully saved')
                })
              
        })
    })

    app.post('/products/add', (req, res, next) => {
        const title = req.body.title
        const description = req.body.description;
        const category = req.body.category;
        let imageUrl = 'http://via.placeholder.com/200x200';
        const price = req.body.price ? req.body.price : '1.99'

        if(!title || !description) {
            res.status(422).send({ error: 'you must provide a product title and description'})
        }
        
        const sticker = new Sticker({
            title,
            description,
            imageUrl,
            category,
            price
        });
    
        sticker.save(err => {
            if(err) { return next(err); }  
            res.json(sticker)
        });
    });

    app.get('/products', (req, res, next) => {

        Sticker.find({}, function(err, stickers) {

            // stickers.forEach((stick, index) => {
                // stick.imageUrl = 'http://via.placeholder.com/200x200';
                // stick.category =  item
                // stick.save();
            // })
            res.send(stickers.reverse())
        })
    });

    app.get('/products/:category', requireAuth, (req, res, next) => {

        var queriedStickers = []
        Sticker.find({}, function(err, stickers) {
            if(!req.params.category || req.params.category.toLowerCase() == 'all') { 
                queriedStickers = stickers.reverse()
            } else {
                stickers.forEach((sticker, index) => {
                    console.log(sticker);
                    if(sticker.category == req.params.category.toLowerCase() ) {
                        console.log(sticker.category);
                        queriedStickers.push(sticker);
                    }
                })
            }
            res.send(queriedStickers);
        })
    })





}