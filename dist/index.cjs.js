'use strict';

var child_process = require('child_process');

const scanDocument = (outputFilePath, options) => {
    return new Promise((resolve, reject) => {
        const { format = "pdf", dpi = 300, scannerName } = options;
        // Command to trigger NAPS2 CLI
        let command = `naps2.console.exe -o "${outputFilePath}" -f ${format} --dpi ${dpi}`;
        if (scannerName) {
            command += ` --scanner "${scannerName}"`;
        }
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr || error.message}`);
            }
            else {
                resolve(`Document scanned successfully: ${outputFilePath}`);
            }
        });
    });
};

exports.scanDocument = scanDocument;
