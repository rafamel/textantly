import { createMuiTheme } from 'material-ui/styles';
import teal from 'material-ui/colors/teal';
import blueGrey from 'material-ui/colors/blueGrey';

export default createMuiTheme({
    palette: {
        primary: { main: teal[500] },
        secondary: { main: blueGrey[500] }
    },
    typography: {
        fontFamily: '"Roboto","Helvetica Neue",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
        fontSize: 14,
        h1: {
            fontSize: '3.75rem',
            fontWeight: 300,
            lineHeight: 1.1
        }
    }
});
