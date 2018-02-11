import PropTypes from 'prop-types';
import typesActions from './utils/types-actions';
import { createLogic } from 'redux-logic';
import engine from 'engine';
import loading from './loading';

const typesPre = 'CANVASES';
const { types: t, actions } = typesActions({
  pre: `${typesPre}_PUBLIC`,
  types: ['SET_SOURCE', 'SCALE', 'DRAW']
});

const initialState = {
  source: {
    id: -1,
    canvas: null
  },
  scaled: {
    id: -1,
    canvas: null,
    forSourceId: null
  },
  drawn: {
    id: -1,
    canvas: null,
    forSourceId: null,
    forOperations: null
  }
};

const propTypes = {
  source: {
    id: PropTypes.number.isRequired,
    canvas: PropTypes.object
  },
  scaled: {
    id: PropTypes.number.isRequired,
    canvas: PropTypes.object,
    forSourceId: PropTypes.number
  },
  drawn: {
    id: PropTypes.number.isRequired,
    canvas: PropTypes.object,
    forSourceId: PropTypes.number,
    forOperations: PropTypes.object
  }
};

let internal = {};
internal.TPRIVATE = `${typesPre}_PRIVATE`;
internal.action = (payload) => ({ type: internal.TPRIVATE, payload });

function reducer(state = initialState, { type, payload }) {
  return type === internal.TPRIVATE ? { ...state, ...payload } : state;
}

const logic = [];
logic.push(
  createLogic({
    type: t.SET_SOURCE,
    cancelType: t.SET_SOURCE,
    process({ getState, action }, dispatch, done) {
      dispatch(loading.actions.setRendering(true));
      dispatch(
        internal.action({
          source: {
            id: getState().canvases.source.id + 1,
            canvas: action.payload
          }
        })
      );
      dispatch(actions.scale());
      dispatch(actions.draw());
      done();
    }
  })
);
logic.push(
  createLogic({
    type: t.SCALE,
    cancelType: [t.SCALE],
    process({ getState, action }, dispatch, done) {
      const state = getState();
      const source = state.canvases.source;
      const scaled = state.canvases.scaled;
      const dimensions = state.views.dimensions;
      if (!source.canvas || !dimensions.width || !dimensions.height) {
        return done();
      }

      const factor = 1.75;
      const ranges = {
        lower: 0.1,
        higher: 0.2
      };

      const scale = {
        width: dimensions.width * factor,
        height: dimensions.width * factor
      };
      const newDims = engine.getDimensions(
        { width: source.canvas.width, height: source.canvas.height },
        { fit: scale }
      );

      const inRange = () => {
        const range =
          newDims.width > scaled.canvas.width ? ranges.lower : ranges.higher;
        const rangeRatio = scaled.canvas.width * range;
        return Math.abs(newDims.width - scaled.canvas.width) < rangeRatio;
      };
      if (scaled.canvas && scaled.forSourceId === source.id && inRange()) {
        return done();
      }

      dispatch(loading.actions.setRendering(true));
      dispatch(
        internal.action({
          scaled: {
            id: scaled.id + 1,
            canvas: engine.draw(source.canvas, { fit: scale }),
            forSourceId: source.id
          }
        })
      );
      dispatch(loading.actions.setRendering(false));
      done();
    }
  })
);
logic.push(
  createLogic({
    type: t.DRAW,
    cancelType: [t.SET_SOURCE, t.DRAW],
    process({ getState, action }, dispatch, done) {
      const state = getState();
      const source = state.canvases.source;
      const drawn = state.canvases.drawn;
      const operations = state.edits.image;
      const forceIncrease = action.payload
        ? action.payload.forceIncrease
        : false;

      if (!source.canvas) return done();

      if (
        drawn.forOperations === operations &&
        drawn.forSourceId === source.id
      ) {
        if (forceIncrease) {
          dispatch(
            internal.action({
              drawn: { ...drawn, id: drawn.id + 1 }
            })
          );
        }
        return done();
      }

      dispatch(loading.actions.setRendering(true));
      dispatch(
        internal.action({
          drawn: {
            id: drawn.id + 1,
            canvas: engine.draw(source.canvas, operations),
            forSourceId: source.id,
            forOperations: operations
          }
        })
      );
      dispatch(loading.actions.setRendering(false));
      done();
    }
  })
);

export default {
  initialState,
  propTypes,
  reducer,
  actions,
  logic
};
