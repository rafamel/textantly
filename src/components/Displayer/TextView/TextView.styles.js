const schemes = {
    dark: {
        background: 'rgba(0,0,0,0.7)',
        text: '#f2f2f2'
    },
    light: {
        background: 'rgba(255,255,255,0.3)',
        text: '#150f05'
    }
};

export default {
    root: {
        fontSize: 0,
        position: 'relative',
        display: 'inline-block',
        margin: 'auto'
    },
    contain: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column'
    },
    text: {
        fontFamily: ({ fontFamily }) => fontFamily,
        fontWeight: ({ fontWeight }) => fontWeight,
        color: ({ colorScheme }) => schemes[colorScheme].text,
        textAlign: ({ alignment }) => alignment,
        '&::selection': {
            background: 'transparent'
        }
    },
    overlay: {
        position: 'absolute',
        display: 'block',
        overflow: 'hidden',
        zIndex: 1,
        background: ({ colorScheme }) => schemes[colorScheme].background
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
    },
    line: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: '8.5%',
        width: '30%',
        margin: '0 auto',
        '& > span': {
            position: 'absolute',
            width: '100%',
            display: 'block',
            top: 0,
            left: 0,
            right: 0,
            '&:before, &:after': {
                content: '""',
                position: 'absolute',
                display: 'block',
                left: 0,
                right: 0,
                opacity: 0.7
            },
            '&:before': {
                top: 0,
                height: '22%'
            },
            '&:after': {
                bottom: 0,
                height: '40%'
            }
        },
        '&:first-child': {
            top: 0,
            bottom: 'auto',
            '& > span': {
                bottom: 0,
                top: 'auto',
                '&:before': {
                    bottom: 0,
                    top: 'auto'
                },
                '&:after': {
                    top: 0,
                    bottom: 'auto'
                }
            }
        },
        '&.ln-dark > span': {
            '&:before, &:after': { background: schemes.dark.text }
        },
        '&.ln-light > span': {
            '&:before, &:after': { background: schemes.light.text }
        }
    }
};
