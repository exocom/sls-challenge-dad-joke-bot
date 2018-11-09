import {ScheduleEventHandler} from '../../libs/lambda-util/lambda-util';
import * as Twitter from 'twitter';

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export interface Event {
  type: 'Quote' | 'Joke'
}

export const handler: ScheduleEventHandler<Event> = async (event, context) => {
};

