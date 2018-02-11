import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, writeAction } from './init';
import config from 'config';
import { data as fontData } from 'services/fonts';

const { types: t, typesBy, actions } = typesActions({
  pre: `${typesPre}_TEXT`,
  types: ['SET_TEXT'],
  post: ['TEMP']
});

const initialState = {
  ...config.defaults.text,
  _private: {
    intentionalWeight: config.defaults.text.fontWeight
  }
};

const propTypes = {
  textString: PropTypes.string.isRequired,
  fontFamily: PropTypes.string.isRequired,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  alignment: PropTypes.string.isRequired,
  overlayPosition: PropTypes.string.isRequired,
  overlayWidth: PropTypes.number.isRequired,
  overlayHeight: PropTypes.number.isRequired,
  colorScheme: PropTypes.string.isRequired
};

function getClosestWeight(fontFamily, state) {
  const lastIntentional = state._private.intentionalWeight;
  const availableWeights = fontData[fontFamily];

  const weightInWeights =
    availableWeights.map(String).indexOf(String(lastIntentional)) !== -1;
  if (weightInWeights) return lastIntentional;

  const lastIntentionalN = Number(lastIntentional);
  const closestWeight = availableWeights.map(Number).reduce(
    (acc, weight) => {
      const distance = Math.abs(lastIntentionalN - weight);
      return acc[1] === -1 || acc[1] > distance ? [weight, distance] : acc;
    },
    [-1, -1]
  )[0];
  return String(closestWeight);
}

const logic = [];
logic.push(
  createLogic({
    type: values(t),
    process({ getState, action }, dispatch, done) {
      const state = getState().edits.text;
      let payload = action.payload;

      let _private = state._private;
      if (payload.fontWeight) {
        _private = { ..._private, intentionalWeight: payload.fontWeight };
      } else if (payload.fontFamily) {
        payload.fontWeight = getClosestWeight(payload.fontFamily, state);
      }

      payload = { ...state, ...payload, _private };
      dispatch(writeAction(action.type, typesBy)({ text: payload }));
      done();
    }
  })
);

export default {
  initialState,
  propTypes,
  actions,
  logic
};
