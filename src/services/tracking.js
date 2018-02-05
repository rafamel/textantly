import Keen from 'keen-tracking';
import config from 'config';

function init() {
    const id = process.env.REACT_APP_KEEN_ID;
    const key = process.env.REACT_APP_KEEN_KEY;
    if (!id || !key) return;

    const client = new Keen({ projectId: id, writeKey: key });
    client.extendEvents(() => ({
        app: {
            version: config.version
        }
    }));
    client.initAutoTracking({
        recordClicks: false,
        recordFormSubmits: false,
        recordPageViews: true,
        recordScrollState: false
    });
}

if (config.tracking) init();
