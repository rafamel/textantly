import { createMuiTheme } from 'material-ui/styles';
import createBreakpoints from 'material-ui/styles/createBreakpoints';
import teal from 'material-ui/colors/teal';
import blueGrey from 'material-ui/colors/blueGrey';

const breakpoints = createBreakpoints({});
export default createMuiTheme({
    breakpoints: {
        values: {
            ...breakpoints.values,
            md: 920
        },
        _q: {
            mobile: '@media (max-width:919.5px)',
            desktop: '@media (min-width:920px)'
        }
    },
    palette: {
        primary: {
            main: teal[500],
            pastel: '#65b0a7'
        },
        secondary: { main: blueGrey[500] }
    },
    typography: {
        fontFamily: '"Roboto","Helvetica Neue",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
        fontSize: 14
    }
});
