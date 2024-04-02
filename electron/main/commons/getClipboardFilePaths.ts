import fs from 'fs-extra';
import { readFilePaths } from 'electron-clipboard-ex';

export const getClipboardFilePaths = (): string[] => {
  const filePaths = readFilePaths();
  return filePaths;
};

export const getFileInfo = () => {
  var stats = fs.statSync('myfile.txt');
  var fileSizeInBytes = stats.size;
  return stats;
};


