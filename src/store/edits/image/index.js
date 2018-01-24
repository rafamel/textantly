import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { typeInTypes, values } from '../../utils/types-actions';
import { typesPre, writeAction } from '../init';
import selectors from './selectors';
import isEqual from 'lodash.isequal';
import { Operation } from 'engine';
import canvases from '../../canvases';

const pre = `${typesPre}_IMAGE`;
const { types: t, typesBy, actions } = typesActions({
    pre,
    types: ['ROTATE', 'RESIZE', 'CROP', 'FLIP'],
    post: ['TEMP']
});

const initialState = {
    operations: {
        id: -1,
        list: []
    },
    last: null
};

const propTypes = {
    operations: {
        id: PropTypes.number.isRequired,
        list: PropTypes.arrayOf(PropTypes.instanceOf(Operation)).isRequired
    },
    last: PropTypes.object
};

const opsId = (state, list) => ({
    id: state.operations.id + 1,
    list
});

function opSetter({ state, payload }) {
    return function setOp({ type, nullValue }) {
        const opsList = state.operations.list;
        const isLast = () => (state.last) ? state.last.is(type) : false;
        const lastPayload = () => new Operation(type, payload);

        if (isEqual(payload, nullValue)) {
            return (isLast())
                ? { ...state, last: null }
                : state;
        }
        if (!state.last) return { ...state, last: lastPayload() };
        return (isLast())
            ? { ...state, last: lastPayload() }
            : {
                operations: opsId(state, opsList.concat(state.last)),
                last: lastPayload()
            };
    };
}

const logic = [];
logic.push(createLogic({
    type: values(t),
    process({ getState, action }, dispatch, done) {
        const gState = getState();
        const state = gState.edits.image;
        const setOp = opSetter({ state, payload: action.payload });
        const type = action.type;
        const is = typeInTypes(type);

        let payload = (() => {
            switch (true) {
            case t.FLIP === type:
                return setOp({ type: 'flip', nullValue: false });
            case is(typesBy.type.ROTATE):
                return setOp({ type: 'rotate', nullValue: 0 });
            case is(typesBy.type.RESIZE):
                return setOp({
                    type: 'resize',
                    nullValue: selectors.opsDimensions(gState)
                });
            default:
                return state;
            }
        })();

        let forceRedraw = false;
        const opsList = payload.operations.list;
        if (!is(typesBy.post.TEMP) && !payload.last && opsList.length) {
            forceRedraw = true;
            payload = {
                operations: opsId(payload, opsList.slice(0, -1)),
                last: opsList.slice(-1)[0]
            };
        }

        dispatch(writeAction(type, typesBy)({ image: payload }));

        dispatch(canvases.actions.draw({ force: forceRedraw }));
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic,
    selectors
};
