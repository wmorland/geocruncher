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

  T.get('statuses/user_timeline', { screen_name: name, count: 200}, function(err, reply) {
    if (err) return next(err);
    res.render('person/tweet', {
      title: 'Tweet',
      results: reply,
      showUser: true
    });
  });
};

/**
 * Get /random
 * Display a tweet.
 */

exports.getRandom = function(req, res) {
  var token = _.findWhere(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });

  var name = 'dolphonia';

  // TODO: Get random username with some geolocation data
  T.get('search/tweets', { q: 'foursquare', count: 100}, function(err,reply) {
    if (err) return next(err);
    var index = Math.floor((Math.random()*reply.statuses.length)+1);
    var count = 0;
    while (reply.statuses[index].coordinates != null && count < 50) {
      name = reply.statuses[index].user.screen_name;
      count = count + 1;
      var index = Math.floor((Math.random()*reply.statuses.length)+1);
    }

    T.get('statuses/user_timeline', { screen_name: name, count: 200}, function(err, reply) {
      if (err) return next(err);
      res.render('person/tweet', {
        title: 'Random User',
        results: reply,
        showUser: false
      });
    });
  });
};

exports.getMe = function(req, res) {
  var token = _.findWhere(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('account/settings', {}, function(err, reply) {
    var name = reply.screen_name;

    T.get('statuses/user_timeline', { screen_name: name, count: 200}, function(err, reply) {
      if (err) return next(err);
      res.render('person/tweet', {
        title: 'Tweet',
        results: reply,
        showUser: true
      });
    });
  });
};