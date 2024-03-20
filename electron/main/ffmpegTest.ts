import { env } from './env';
import { join } from 'node:path';
export const ffmpegTest = () => {
  var ffmpeg = require('fluent-ffmpeg');
  // console.log('ffmpeg', ffmpeg);

  const dirname = env.isDev ? '../../' : '';
  // 指定 ffmpeg 二进制文件的路径
  const ffmpegPath = join(__dirname, dirname, 'node_modules', 'ffmpeg-static', 'ffmpeg');

  console.error('ffmpegPath:', ffmpegPath);

  ffmpeg.setFfmpegPath(ffmpegPath);

  // 执行一个简单的命令，比如获取 ffmpeg 的版本信息
  ffmpeg.getAvailableEncoders((err, encoders) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Encoders:', 'ok');
    }
  });
  let outputDir = `C:\\Users\\ZP\\Videos\\output`;
  let inputDir = `C:\\Users\\ZP\\Videos\\`;
  let inputPath = 'C:\\Users\\ZP\\Videos\\2.7.mp4';
  let outputPath = 'C:\\Users\\ZP\\Videos\\2.7____1.mp4';
  const gifPath = join(outputDir, '2.7.gif');
  const inputFilePath = join(inputDir, 'VID_20240317_160514.mp4');
  const compressedFilePath = join(outputDir, 'compressedVideo.mp4');
  const snapshotFilePath = join(outputDir, '/');
  const gifFilePath = join(outputDir, 'output.gif');

  ffmpeg.ffprobe(inputFilePath, function (err, metadata) {
    console.log('metadata', metadata);
  });

  ffmpeg(inputFilePath)
    // 压缩视频
    .videoCodec('libx264') // 使用 H.264 编码器
    .audioCodec('aac') // 使用 AAC 音频编码器
    .outputOptions('-preset veryfast') // 使用 veryfast 预设进行快速压缩
    .output(compressedFilePath)
    // .size('?x240')
    .on('end', () => {
      console.log('end generated video');
    })
    .on('error', err => {
      console.error('error:', err);
    })
    .run();
  ffmpeg(inputFilePath)
    // 获取视频快照
    .screenshots({
      timestamps: ['0.01', '50%'], // 获取视频的中间快照
      folder: snapshotFilePath,
      filename: 'snapshot-%s.png',
      size: '?x360',
    })
    // // 获取 GIF 图片
    // .fps(10) // 设置 GIF 的帧率为 10
    // .size('?x240') // 设置 GIF 的尺寸为 320x240
    // .duration(5) // 设置输出 GIF 的时长为 5 秒
    // .output(gifFilePath)
    // 获取 GIF 图片
    .output(gifFilePath)
    // .duration(5) // 仅使用前 5 秒
    // .fps(10) // GIF 的帧率为 10 帧/秒
    // .size('?x240') // 设置 GIF 的尺寸为 320x240
    .outputOptions('-vf', 'fps=5,scale=-1:240:flags=lanczos')
    // .format('gif')

    .on('end', () => {
      console.log('end generated gif/snapshot');
    })
    .on('error', err => {
      console.error('error:', err);
    })
    .run();

  // var command = ffmpeg(inputPath)
  //   .videoCodec('libx264')
  //   .audioCodec('libmp3lame')
  //   .on('start', function () {
  //     console.log('start');

  //     // Send SIGSTOP to suspend ffmpeg
  //     // command.kill('SIGSTOP');

  //     // doSomething(function() {
  //     //   // Send SIGCONT to resume ffmpeg
  //     //   command.kill('SIGCONT');
  //     // });
  //   })
  //   .on('error', err => {
  //     console.log('err: ', err);
  //   })
  //   .save(outputPath);
};
