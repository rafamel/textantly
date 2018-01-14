#!/usr/bin/env node
'use strict';
const yargs = require('yargs');
const chalk = require('chalk');
const clear = require('clear');
const chokidar = require('chokidar');
const { spawn } = require('child_process');

const argv = yargs
    .alias('w', 'watch')
    .describe('w', 'Dir/s to watch')
    .alias('r', 'run')
    .describe('r', 'Command/s to run')
    .alias('rd', 'rundaemon')
    .describe('rd', 'Secondary daemon to maintain open')
    .help('help')
    .showHelpOnFail(true)
    .argv;

const watch = !process.env.CI && !process.env.CHECKS;

if (!argv.r) argv.r = ['npm start'];
if (!Array.isArray(argv.r)) argv.r = [argv.r];
if (!argv.w) argv.w = ['./src'];
if (!Array.isArray(argv.w)) argv.w = [argv.w];
if (argv.rd && Array.isArray(argv.rd)) argv.rd = argv.rd.slice(-1)[0];
if (argv.rd && !watch) {
    argv.r.push(argv.rd);
    delete argv.rd;
}

let isPending;
let toDraw = { r: '', rd: '' };
const cleanDraw = () => { toDraw = { r: '', rd: '' }; };
let stopper = runner();

if (watch) {
    setInterval(() => {
        if (isPending) {
            isPending = false;
            draw();
        }
    }, 500);

    const watcher = chokidar.watch(argv.w);
    watcher.on('ready', function() {
        watcher.on('all', function() {
            if (stopper) stopper();
            cleanDraw();
            stopper = runner();
        });
    });

    if (argv.rd) {
        const args = argv.rd.split(' ');
        const current = args.shift();
        const p = spawn(current, args);
        p.stdout.on('data', chalker('rd'));
        p.stderr.on('data', chalker('rd'));
        p.on('close', (code) => {
            const msg = `${current} exited with code ${code}`;
            toDraw.rd += '\n' + (code) ? chalk.red(msg) : chalk.green(msg);
        });
    }
}

function draw() {
    clear();
    if (watch) console.log(chalk.green(`Watching ${argv.w.join(', ')}`));
    if (argv.rd) console.log(chalk.green(`Secondary open daemon ${argv.rd}`));
    console.log(chalk.green(`Running ${argv.r.join(' && ')}\n`));

    if (argv.rd) {
        console.log(chalk.blue(`${argv.rd}:`));
        console.log(`${toDraw.rd || ''}\n`);
        console.log(chalk.blue(`${argv.r.join(' && ')}:`))
    }
    console.log(toDraw.r || '');
};

function chalker(property) {
    return (data) => {
        data = data
            .toString()
            .split('\n')
            .map(line => {
                return line
                    .split(' ')
                    .map((x,i) => {
                        return (x.match(/^(error|err!?)$/i))
                            ? chalk.red(x)
                            : x;
                    })
                    .join(' ');
            })
            .join('\n');
        toDraw[property] += data;
        if (watch) isPending = true;
        else draw();
    };
}

function runner() {
    const running = {};
    const run = (pending) => {
        const current = pending.shift();
        const args = current.split(' ');
        const p = spawn(args.shift(), args);
        running.p = p;
        p.stdout.on('data', chalker('r'));
        p.stderr.on('data', chalker('r'));
        p.on('close', (code) => {
            const msg = `${current} exited with code ${code}`;
            console.log((code) ? chalk.red(msg) : chalk.green(msg));
            if (!running.stop && !code && pending.length) {
                run(pending);
            } else if (!watch) process.exit(code);
        });
    }
    run(argv.r.concat());
    return function stopper() {
        running.stop = true;
        running.p.kill();
    };
};
