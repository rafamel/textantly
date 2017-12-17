'use strict';
const { spawn } = require('child_process');

function run(command) {
    return new Promise((resolve, reject) => {
        console.log('Running', command, '\n');
        const args = command.split(' ');
        command = args.shift();
        const p = spawn(command, args);
        p.stdout.on('data', (data) => { console.log(String(data)); });
        p.stderr.on('data', (data) => { console.error(String(data)); });
        p.on('close', (code) => {
            if (code) reject(Error());
            else {
                console.log('\n')
                resolve();
            }
        });
    });
}

module.exports = async (reactScripts) => {
    await run(`npm remove ${reactScripts}`);
    await run(`npm install ${reactScripts}`);
};
