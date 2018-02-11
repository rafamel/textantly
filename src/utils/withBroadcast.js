import React from 'react';
import { Subscriber } from 'react-broadcast';

export default function withBroadcast(channel, prop = channel) {
  return (Component) =>
    function WithBroadcast(props) {
      return (
        <Subscriber channel={channel}>
          {(value) => <Component {...props} {...{ [prop]: value }} />}
        </Subscriber>
      );
    };
}
