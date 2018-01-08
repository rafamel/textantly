import { jss } from 'react-jss';
import theme from './theme';

const styles = {
    container: {
        margin: '30px auto 50px',
        maxWidth: 1200,
        padding: '0 15px'
    },
    h1: {
        ...theme.typography.body2,
        margin: '0 0 10px',
        fontSize: '3.7rem',
        fontWeight: 300,
        lineHeight: 1.1
    },
    lead: {
        ...theme.typography.body2,
        marginTop: 0,
        fontSize: 16,
        fontWeight: 300,
        lineHeight: 1.4,
        '@media (min-width: 768px)': {
            fontSize: 21
        }
    }
};

const styleSheet = jss.createStyleSheet(styles).attach();
const classes = styleSheet.classes;
export {
    styleSheet as default,
    styles,
    classes
};
