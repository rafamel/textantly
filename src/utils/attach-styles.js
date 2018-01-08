import { jss } from 'react-jss';

export default function attachStyles(styles, updateObj) {
    let sheet = jss.createStyleSheet(styles);
    if (updateObj) sheet = sheet.update(updateObj);
    return sheet.attach().classes;
};
