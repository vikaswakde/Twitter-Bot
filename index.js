const Twit = require('twit');
const schedule = require('node-schedule');
const https = require('https');

const T = new Twit({
  consumer_key: 'QF0PRxj1yWgYgvgsKUgdhCjDq',
  consumer_secret: 'JlTdgBCCzEfFfpAIXAqbgs2GdATbILBI7GENcuFL8nPbl9uKoX',
  access_token: '1598008806956748801-Oa65OjVrhf2OEoFgKh5ivWSMwhM4D9',
  access_token_secret: 'vVl9IJbOSeqkvyftOnsw3cuL5W3PJQrSK9AODyQFYqMBa'
});

function postTweet(status) {
  T.post('statuses/update', { status: status }, function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Tweeted: ' + status);
    }
  });
}

function getQuote(callback) {
  https.get('https://zenquotes.io/api/random', function (res) {
    let data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      try {
        let quote = JSON.parse(data);
        if (quote[0].q) {
          callback(quote[0].q); // Pass the quote to the callback function
        } else {
          callback('Sorry, no quote found.'); // Pass an error message to the callback function
        }
      } catch (err) {
        console.log(err);
        callback('Sorry, something went wrong.'); // Pass an error message to the callback function
      }
    });
  });
}

function postImmediateTweet() {
  getQuote(function (quote) {
    postTweet(quote);
  });
}

postImmediateTweet();

schedule.scheduleJob('0 8,20 * * *', function () {
  getQuote(function (quote) {
    postTweet(quote);
  });
});
