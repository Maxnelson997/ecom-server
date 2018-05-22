const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
    // use email and password already authenticated
    // just need to provide a session token now
    // send user too now.
    res.send({ user: req.user ,token: tokenForUser(req.user ) })
}

exports.signup = (req, res, next) => {
    // res.send({ success: 'true' })
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;


    if(!email || !password) {
        res.status(422).send({ error: 'you must provide an email + password'})
    }

    // see if user with given email exists
    User.findOne({ email: email }, (err, existingUser) => {
        if(err) { return next(err); }

        //if a user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'email is in use' });
        }


        // if user wtih email does not exist, create a save user record
        const user = new User({
            name: name,
            email: email,
            password: password
        });

        user.save(err => {
            
          if(err) { return next(err); }  

          res.json({ token: tokenForUser(user) });
        });
    // respond to request indicating the user was created.
    });

}
