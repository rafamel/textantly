import PropTypes from 'prop-types';
import { selectorWithType } from '../../utils/withState';
import engine from 'engine';

const selectors = {};
// selectors.rotate = selectorWithType({
//     propType: PropTypes.number.isRequired,
//     select: [
//         state => state.edits.image.last
//     ],
//     result: (lastOp) => {
//         return (lastOp && lastOp.type === 'rotate')
//             ? lastOp.value
//             : 0;
//     }
// });

// selectors.opsDimensions = selectorWithType({
//     propType: PropTypes.shape({
//         width: PropTypes.number.isRequired,
//         height: PropTypes.number.isRequired
//     }).isRequired,
//     select: [
//         state => state.canvases.source,
//         state => state.edits.image.operations.list
//     ],
//     result: (source, opsList) => {
//         return (!source)
//             ? { width: 0, height: 0 }
//             : engine.getDimensions(
//                 { width: source.width, height: source.height },
//                 opsList
//             );
//     }
// });

export default selectors;
