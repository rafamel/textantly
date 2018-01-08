import React from 'react';
import PropTypes from 'prop-types';
import Tabs from 'material-ui/Tabs';

class VerticalTabs extends React.Component {
    static propTypes = {
        children: PropTypes.array.isRequired,
        onChange: PropTypes.func,
        value: PropTypes.oneOfType(
            [PropTypes.bool, PropTypes.number]
        )
    };
    handleChange = (index) => (e, value) => {
        if (!this.props.onChange || value !== 0) return;
        this.props.onChange(e, index);
    };
    render() {
        const { value, children } = this.props;
        const active = (value === true) ? 0 : value;
        const isActive = (index) => (index === active) ? 0 : false;
        let i = -1;
        return (
            <div>
                {
                    children.map((child) => {
                        if (!child.type || child.type.name !== 'VerticalTab') {
                            return child;
                        }
                        i++;
                        return (
                            <Tabs
                                key={`vertical-tabs-${i}`}
                                indicatorColor="primary"
                                textColor="primary"
                                {...this.props}
                                // eslint-disable-next-line
                                children={undefined}
                                value={isActive(i)}
                                onChange={this.handleChange(i)}
                                fullWidth
                            >
                                { child }
                            </Tabs>
                        );
                    })
                }
            </div>
        );
    }
}

export default VerticalTabs;
