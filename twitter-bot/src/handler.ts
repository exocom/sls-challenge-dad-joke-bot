import {ScheduleEventHandler} from '../../libs/lambda-util/lambda-util';
import * as Twitter from 'twitter';
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
const quotes = require('./quotes');

export const handler: ScheduleEventHandler<Event> = async (event, context) => {
  if (event.type === 'Quote') {
    const now = moment();
    const hoursSinceStart = now.diff(startDate, 'hours');
    const i =  Math.floor(hoursSinceStart / event.rate) % quotes.length;
    const quote = quotes[i];
    const tweet = await client.post('statuses/update', {status: quote});
    console.log(tweet);
  }

  if (event.type === 'Joke') {
    const options = {
      method: 'GET',
      url: 'https://icanhazdadjoke.com/',
      headers: {Accept: 'application/json'}
    };
    const {joke} = await request(options);
    const tweet = await client.post('statuses/update', {status: joke});
    console.log(tweet);
  }
};

