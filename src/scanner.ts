import { exec } from "child_process";

export const scanDocument = (
  outputFilePath: string,
  options: { format?: string; dpi?: number; scannerName?: string }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { format = "pdf", dpi = 300, scannerName } = options;

    // Command to trigger NAPS2 CLI
    let command = `naps2.console.exe -o "${outputFilePath}" -f ${format} --dpi ${dpi}`;

    if (scannerName) {
      command += ` --scanner "${scannerName}"`;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr || error.message}`);
      } else {
        resolve(`Document scanned successfully: ${outputFilePath}`);
      }
    });
  });
};
