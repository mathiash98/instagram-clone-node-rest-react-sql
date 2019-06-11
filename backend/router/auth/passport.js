const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

const config = require('../../config');
const User = require('../../controllers/User');

passport.use('local-login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, cb) {
    console.log(username, password);
    User.compareUsernamePassword(username, password)
        .then((user) => {
            cb(null, user);
        })
        .catch((err) => {
            cb(err);
        });
}));

passport.use('jwt', new JWTStrategy({
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, (token, cb) => {
    cb(null, token);
}));