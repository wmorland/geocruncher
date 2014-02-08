var secrets = require('../config/secrets');
var User = require('../models/User');
var _ = require('underscore');
var Twit = require('twit');


/**
 * GET /person
 * Enter a twitter username.
 */

exports.getPerson = function(req, res) {
  res.render('person/person', { title: 'Select User'});
};

/**
 * PUT /person
 * Display a tweet.
 */

exports.putPerson = function(req, res) {
  var token = _.findWhere(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  var name = req.body.username;

  T.get('statuses/user_timeline', { screen_name: name, count: 1 }, function(err, reply) {
    if (err) return next(err);
    res.render('person/tweet', {
      title: 'Tweet',
      useme: reply[0].text
    });
  });

};