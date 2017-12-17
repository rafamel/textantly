const path = require('path');
const readDir = require('fs-readdir-recursive');

const testDir = path.join(__dirname, '../test');

readDir(testDir).forEach(testFile => {
    describe(testFile, () => {
        require(path.join(testDir, testFile));
    });
});
