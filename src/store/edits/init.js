import Historian from '../historian';
import typesActions, { typeInTypes } from '../utils/types-actions';

const typesPre = 'EDITS';
const { types, actions } = typesActions({
    pre: typesPre,
    types: ['OVERWRITE', 'WRITE_HARD', 'WRITE_SKIP', 'WRITE_TEMP']
});
const historian = Historian({ key: '_history' });

function writeAction(type, typesBy) {
    const is = typeInTypes(type);
    return (is(typesBy.post.TEMP))
        ? actions.writeTemp
        : actions.writeHard;
}

export {
    historian,
    typesPre,
    types,
    actions,
    writeAction
};
