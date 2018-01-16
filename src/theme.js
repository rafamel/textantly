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
        title: {
            fontSize: 20,
            fontWeight: 300,
            lineHeight: 1.1,
            margin: 'auto 0'
        },
        subheading: {
            fontSize: 14,
            fontWeight: 300,
            lineHeight: 1.1,
            margin: '3px 0 1px'
        }
    }
});
