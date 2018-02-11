import config from 'config';

function warn(message, mode = 'warn') {
  if (!Array.isArray(message)) message = [message];
  // eslint-disable-next-line
  if (!config.production) console[mode](...message);
}

export default warn;
