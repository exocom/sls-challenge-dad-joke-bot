import {ScheduleEventHandler} from '../../libs/lambda-util/lambda-util';
import {quotes} from './space-dandy';
import Twitter = require('twitter');
import moment = require('moment');
import request = require('request-promise');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export interface Event {
  type: 'Quote' | 'Joke';
  rate?: number;
}

const startDate = moment('2018-11-09T16:00:00.000Z');

export const tweet: ScheduleEventHandler<Event> = async (event) => {
  if (event.type === 'Quote') {
    const now = moment();
    const hoursSinceStart = now.diff(startDate, 'hours');
    const i = Math.floor(hoursSinceStart / event.rate) % quotes.length;
    const quote = quotes[i];
    console.log(quote);
    const tweet = await client.post('statuses/update', {status: quote});
    console.log(tweet);
  }

  if (event.type === 'Joke') {
    const options = {
      method: 'GET',
      url: 'https://icanhazdadjoke.com/',
      json: true
    };
    const {joke} = await request(options);
    console.log(joke);
    const tweet = await client.post('statuses/update', {status: joke.replace(/([^a-z0-9])?$/i, ', Baby$1')});
    console.log(tweet);
  }
};

