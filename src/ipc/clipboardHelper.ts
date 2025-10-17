import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';
import { clipboard } from 'electron';
// import fs from 'fs-extra';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export const getClipboardFilePaths = (args?: WindowParams): Promise<string[]> =>
  new Promise<string[]>((resolve, reject) => {
    ipcRenderer
      .invoke('clipboard-filepaths', {})
      .then(filePaths => {
        resolve(filePaths);

        console.log('filePaths', filePaths);
      })
      .catch(reject);
  });

export const getClipboradFiles = async (): Promise<File[]> => {
  const filePaths = await getClipboardFilePaths();
  const files = filePaths.map(filePath => {
    const fileName = path.basename(filePath);
    // const suffix = path.extname(fileName);
    let buffer = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    let file = new File([buffer], fileName, { type: mimeType });
    return file;
  });
  return files;
  // return new Promise<File[]>(async (resolve, reject) => {
  //   getClipboardFilePaths()
  //     .then(filePaths => {
  //       const files = filePaths.map(filePath => {
  //         const fileName = path.basename(filePath);
  //         const suffix = path.extname(fileName);
  //         let buffer = fs.readFileSync(filePath);
  //         const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  //         let file = new File([buffer], fileName, { type: mimeType });
  //         return file;
  //       });
  //       resolve(files);
  //     })
  //     .catch(reject);
  // });
};

export const getClipboradImage = (fileName: string): File | undefined => {
  var image = clipboard.readImage('clipboard');
  console.log('shortcut clipboard:image', image);
  if (image.isEmpty()) {
    return;
  }
  const blob = new Blob([image?.toPNG() as any], { type: 'image/png' });
  var file = new File([blob], fileName, {
    type: 'image/png',
  });
  return file;
};

// import { readFilePaths }  from 'electron-clipboard-ex'
export const uuid = (a: any, b: any) => new Date().getTime().toString();

// export const getClipboardFiles1 = (): string[] => readFilePaths()

// 获取剪贴板上的文件路径
export const getClipboardFiles = (): string[] => {
  let filePaths: any[] = [];
  const fileList = clipboard.readBuffer('FileNameW').toString();

  console.log('Windows fileList', fileList);

  // 判断当前操作系统是否为 MacOS
  const isMacOS = process.platform === 'darwin';

  if (isMacOS) {
    if (clipboard.has('NSFilenamesPboardType')) {
      // 如果剪贴板包含多个文件
      const tagContent = clipboard.read('NSFilenamesPboardType').match(/<string>.*<\/string>/g);
      filePaths = tagContent
        ? tagContent.map(item => item.replace(/<string>|<\/string>/g, ''))
        : [];
    } else {
      // 如果仅有一个文件
      const clipboardImage = clipboard.readImage('clipboard');
      if (!clipboardImage.isEmpty()) {
        // 如果文件是图片类型
        console.log('upload image from clipboard');
        const png = clipboardImage.toPNG();
        const fileInfo = {
          buffer: png,
          mimetype: 'image/png',
          originalname: uuid(8, 16) + '.png',
        };
        filePaths = [fileInfo];
      } else {
        // 读取单个文件
        filePaths = [clipboard.read('public.file-url').replace('file://', '')].filter(item => item);
      }
    }
  } else {
    // 如果是 Windows

    console.log('Windows', clipboard.has('CF_HDROP'));
    if (clipboard.has('CF_HDROP')) {
      // 如果剪贴板包含多个文件
      const rawFilePathStr = clipboard.readBuffer('CF_HDROP').toString('ucs2') || '';
      let formatFilePathStr = [...rawFilePathStr]
        .filter((_, index) => rawFilePathStr.charCodeAt(index) !== 0)
        .join('')
        .replace(/\\/g, '\\');

      const drivePrefix = formatFilePathStr.match(/[a-zA-Z]:\\/);

      if (drivePrefix) {
        const drivePrefixIndex = formatFilePathStr.indexOf(drivePrefix[0]);
        if (drivePrefixIndex !== 0) {
          formatFilePathStr = formatFilePathStr.substring(drivePrefixIndex);
        }
        filePaths = formatFilePathStr
          .split(drivePrefix[0])
          .filter(item => item)
          .map(item => drivePrefix + item);
      }
    } else {
      // 如果是单个文件
      const clipboardImage = clipboard.readImage('clipboard');
      if (!clipboardImage.isEmpty()) {
        // 如果文件是图片类型
        console.log('upload image from clipboard');
        const png = clipboardImage.toPNG();
        const fileInfo = {
          buffer: png,
          mimetype: 'image/png',
          originalname: uuid(8, 16) + '.png',
        };
        filePaths = [fileInfo];
      } else {
        // 读取单个文件
        filePaths = [
          clipboard
            .readBuffer('FileNameW')
            .toString('ucs2')
            .replace(RegExp(String.fromCharCode(0), 'g'), ''),
        ].filter(item => item);
      }
    }
  }

  //   let fileBuffer = fs.readFileSync(filePath)
  // let fileFromItem = new File([fileBuffer], getFileName(filePath), { type: getMimeType(filePath) || 'text/plain' })
  // 保存多个文件
  // for (const filePath of filePaths) {
  //   const fileContent = fs.readFileSync(filePath);
  //   const fileName = path.basename(filePath);
  //   fs.writeFileSync(`path/to/save/${fileName}`, fileContent);
  // }

  console.log('get file path from clipboard:', filePaths);
  return filePaths;
};
