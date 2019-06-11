// Main router
const express = require('express');
const passport = require('passport');
const router = express.Router();

const api = require('./api/api');
const auth = require('./auth/auth');

require('./auth/passport');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
});

router.use(function (req, res, next) {
     passport.authenticate('jwt', { session: false }, async function (err, jwtData) {
         if(jwtData) {
             req.user = jwtData.data;
             console.log(req.user);
        }
        next();
     })(req, res, next);
});

router.use('/api', api);
router.use('/auth', auth);

router.get('/', function (req, res) {
    res.send('localhost:3000/')
});

module.exports = router;