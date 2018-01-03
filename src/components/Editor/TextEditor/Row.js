import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';

const styles = {
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

class Row extends React.Component {
    static propTypes = {
        children: PropTypes.array.isRequired,
        lateralSeparation: PropTypes.number
    };
    state = {
        classes: {}
    };
    componentWillMount() {
        const { children, lateralSeparation } = this.props;
        const { classes } = jss
            .createStyleSheet(styles)
            .update({
                n: children.length,
                separation: lateralSeparation || 0
            })
            .attach();
        this.setState({ classes });
    }
    render() {
        const { classes } = this.state;
        return (
            <div className={classes.root}>
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

export default Row;
