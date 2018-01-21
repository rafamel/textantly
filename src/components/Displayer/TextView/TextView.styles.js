export default {
    root: {
        fontSize: 0,
        position: 'relative',
        display: 'inline-block',
        margin: 'auto'
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
    contain: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column'
    },
    text: {
        fontFamily: ({ fontFamily }) => fontFamily,
        fontWeight: ({ fontWeight }) => fontWeight,
        color: ({ colorScheme }) => (colorScheme === 'dark')
            ? '#f2f2f2'
            : '#150f05',
        textAlign: ({ alignment }) => alignment,
        '&::selection': {
            background: 'transparent'
        }
    },
    overlayPosition: ({
        overlayWidth, overlayHeight, overlayPosition: position
    }) => {
        const opposites = {
            top: 'bottom', right: 'left', bottom: 'top', left: 'right'
        };
        const positioning = { top: 0, right: 0, bottom: 0, left: 0 };
        positioning[opposites[position]] = 'auto';

        const length = (position === 'top' || position === 'bottom')
            ? { height: `${overlayHeight}%`, width: 'auto' }
            : { width: `${overlayWidth}%`, height: 'auto' };

        return { ...positioning, ...length };
    },
    containPosition: ({ overlayPosition: position }) => {
        return (position === 'top' || position === 'bottom')
            ? { top: '22%', bottom: '22%', left: '4%', right: '4%' }
            : { top: '14%', bottom: '14%', left: '8%', right: '8%' };
    }
};
