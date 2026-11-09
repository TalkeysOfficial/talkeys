const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require('fs');

// log directory path
const logDirectory = path.resolve(__dirname, '../../log');

// ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

module.exports = {
    dev: morgan('dev'),
    combined: morgan('combined', { stream: accessLogStream })
};
