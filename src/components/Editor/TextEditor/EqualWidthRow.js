import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';
import ResizeObserver from 'resize-observer-polyfill';

function attachStyles(styles, updateObj) {
    let sheet = jss.createStyleSheet(styles);
    if (updateObj) sheet = sheet.update(updateObj);
    return sheet.attach().classes;
}

const fullWidthStyles = {
    root: {
        display: 'block'
    },
    column: {
        width: '100%'
    }
};

const columnStyles = {
    root: {
        display: 'flex'
    },
    column: {
        width: ({n}) => `${100 / (n)}%`,
        padding: ({separation}) => `0 ${separation / 2 }px`,
        '&:first-child': {
            paddingLeft: 0
        },
        '&:last-child': {
            paddingRight: 0
        }
    }
};

class EqualWidthRow extends React.Component {
    constructor(props) {
        super(props);

        const separation = props.lateralSeparation || 0;
        const n = props.children.length;
        this.totalMinWidth = (props.colMinWidth)
            ? (props.colMinWidth * n) + (separation * (n - 1))
            : 0;
        this.classes = {
            fullWidth: attachStyles(fullWidthStyles),
            columns: attachStyles(columnStyles, { n, separation })
        };
    }
    static propTypes = {
        // Props
        children: PropTypes.array.isRequired,
        lateralSeparation: PropTypes.number,
        colMinWidth: PropTypes.number,
        onModeChange: PropTypes.func
    };
    state = {
        mode: 'none'
    };
    setRootNode = (ref) => {
        this.rootNode = ref;
    };
    measure = (width) => {
        const clientWidth = width || this.rootNode.clientWidth;
        if (clientWidth === 0) return;

        const mode = (clientWidth < this.totalMinWidth)
            ? 'fullWidth'
            : 'columns';
        if (this.state.mode === mode) return;

        this.setState({ mode });
        if (this.props.onModeChange) this.props.onModeChange(mode);
    };
    componentDidMount() {
        this.measure();
        const ro = new ResizeObserver((entries) => {
            try {
                this.measure(entries[0].contentRect.width);
            } catch (e) { this.measure(); }
        });
        ro.observe(this.rootNode);
    }
    render() {
        const classes = (this.state.mode === 'fullWidth')
            ? this.classes.fullWidth
            : this.classes.columns;
        return (
            <div
                ref={this.setRootNode}
                className={classes.root}
                style={{
                    opacity: (this.state.mode === 'none') ? 0 : 1
                }}
            >
                {this.props.children.map((child, i) => (
                    <div
                        key={`${classes.root}_${i}`}
                        className={classes.column}
                    >
                        {child}
                    </div>
                ))}
            </div>
        );
    }
}

export default EqualWidthRow;
