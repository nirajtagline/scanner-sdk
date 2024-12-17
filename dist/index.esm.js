import { exec } from 'child_process';

const scanDocument = (outputFilePath, options) => {
    return new Promise((resolve, reject) => {
        const { format = "pdf", dpi = 300, scannerName } = options;
        // Command to trigger NAPS2 CLI
        let command = `"C:\\Program Files\\NAPS2\\NAPS2.Console.exe" -o "${outputFilePath}" -f ${format} --dpi ${dpi}`;
        if (scannerName) {
            command += ` --scanner "${scannerName}"`;
        }
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr || error.message}`);
            }
            else {
                resolve(`Document scanned successfully: ${outputFilePath}`);
            }
        });
    });
};

export { scanDocument };
