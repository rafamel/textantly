export default {
    root: {
        position: 'relative',
        display: 'inline-block',
        margin: 'auto',
        fontSize: 0
    },
    overlay: {
        position: 'absolute',
        display: 'block',
        overflow: 'hidden',
        zIndex: 1,
        background: ({ colorScheme }) => (colorScheme === 'dark')
            ? 'rgba(0,0,0,0.7)'
            : 'rgba(255,255,255,0.3)'
    },
    outer: {
        overflow: 'hidden',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    inner: {
        margin: 'auto'
    },
    text: {
        display: 'block',
        margin: '-0.125em 0 0',
        padding: 0,
        lineHeight: 0.9,
        color: ({ colorScheme }) => (colorScheme === 'dark')
            ? '#f2f2f2'
            : '#150f05',
        fontFamily: ({ fontFamily }) => fontFamily,
        fontWeight: ({ fontWeight }) => fontWeight,
        textAlign: ({ alignment }) => alignment
    },
    overlayPosition: ({ overlayWidth, overlayHeight, overlayPosition }) => {
        const opposites = {
            top: 'bottom', right: 'left', bottom: 'top', left: 'right'
        };
        const position = { top: 0, right: 0, bottom: 0, left: 0 };
        position[opposites[overlayPosition]] = 'auto';

        return position;
    },
    outerPosition: ({ overlayPosition: position }) => {
        return (position === 'top' || position === 'bottom')
            ? {
                top: '22%',
                bottom: '22%',
                left: '4%',
                right: '4%'
            } : {
                top: '14%',
                bottom: '14%',
                left: '8%',
                right: '8%'
            };
    }
};
