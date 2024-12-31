import { exec } from "child_process";

// Function to scan the document using NAPS2
export const scanDocument = (
  outputFilePath: string,
  options: { format?: string; dpi?: number; scannerName?: string }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { format = "pdf", dpi = 300, scannerName } = options;

    // Possible paths for the NAPS2 console executable
    const naps2Paths = [
      "C:\\Program Files\\NAPS2\\naps2.console.exe",        // 64-bit installation
      "C:\\Program Files (x86)\\NAPS2\\naps2.console.exe",   // 32-bit installation
    ];

    let command = "";
    let found = false;

    // Check each possible path and build the command when the executable is found
    for (let i = 0; i < naps2Paths.length; i++) {
      const currentPath = naps2Paths[i];

      // If the executable is found in one of the paths, run the command
      command = `"${currentPath}" -o "${outputFilePath}" -f ${format} --dpi ${dpi}`;

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

      found = true;
      break;
    }

    // If no executable is found, reject with an error message
    if (!found) {
      reject("Error: NAPS2 executable not found. Please check the installation path.");
    }
  });
};
