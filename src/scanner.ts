import { exec } from "child_process";
import * as fs from "fs"
import * as os from 'os';
import * as path from "path"; // This is the correct import syntax for 'path'

// import path from "path";
import { promisify } from "util";

// Convert fs.unlink (to delete file) to a promise-based function
const unlinkAsync = promisify(fs.unlink);

// Function to scan the document using NAPS2
export const scanDocument = (
  options: { format?: string; dpi?: number; scannerName?: string }
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const { format = "pdf", dpi = 300, scannerName } = options;

    // Generate a temporary file path in the system's temporary directory
    const tempFilePath = path.join(os.tmpdir(), `scanned-document-${Date.now()}.pdf`);

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
      command = `"${currentPath}" -o "${tempFilePath}" -f ${format} --dpi ${dpi}`;

      if (scannerName) {
        command += ` --scanner "${scannerName}"`;
      }

      exec(command, async (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr || error.message}`);
        } else {
          // Once scanning is successful, read the file and return it as a buffer
          try {
            const fileBuffer = fs.readFileSync(tempFilePath);

            // Delete the temporary file after reading
            await unlinkAsync(tempFilePath);

            resolve(fileBuffer);
          } catch (readError : any) {
            reject(`Error reading temporary file: ${readError.message}`);
          }
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
