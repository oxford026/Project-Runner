#!/usr/bin/env node
const program = require('caporal');
const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const fs = require('fs');
const { spawn } = require('child_process');


program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
        }
        catch (err) {
            throw new Error(`Could not find the file ${filename}`);
        }

        const start = debounce(() => {
            spawn('node', [name], { stdio: 'inherit' });
        }, 100);

        chokidar
            .watch('.')
            .on('add', start)
            .on('change', () => console.log(`File changed`))
            .on('unlink', () => console.log(`File removed`))
            .on('error', error => console.error(`Watcher error: ${error}`));
    });

    program.parse(process.argv);



// chokidar.watch('.')
// .on('add', start)
// .on('change', () => console.log(`File changed`))
// .on('unlink', () => console.log(`File removed`))
// .on('error', error => console.error(`Watcher error: ${error}`));
