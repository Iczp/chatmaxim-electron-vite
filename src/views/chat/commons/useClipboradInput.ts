import { WatchStopHandle, onActivated, onDeactivated, onMounted, onUnmounted, watch } from 'vue';
import { useShortcutStore } from '../../../stores/shortcutStore';
import { getClipboradFiles, getClipboradImage } from '../../../ipc/clipboardHelper';
import { useWindowStore } from '../../../stores/windowStore';

export type FormType = 'filesystem' | 'screenshots' | 'drop' | 'clipboard';

export const useClipboradInput = ({
  clipboardImageName,
  change,
}: {
  clipboardImageName: () => string;
  change: ({ files, from }: { files: File[]; from: FormType }) => void;
}) => {
  const windowStore = useWindowStore();
  const shortcutStore = useShortcutStore();

  let stopShortcutWatch: WatchStopHandle | undefined;
  let startShortcutWatch = () => {
    stopShortcutWatch = watch(
      () => shortcutStore['CommandOrControl+V'],
      ticks => {
        console.log('shortcut', ticks);
        const imgFile = getClipboradImage(clipboardImageName());
        if (imgFile) {
          change({ files: [imgFile], from: 'screenshots' });
          return;
        }
        getClipboradFiles().then(files => {
          if (files.length == 0) {
            console.warn('getClipboradFiles', 'files.length==0');
            return;
          }
          change({ files: files, from: 'clipboard' });
        });
        // // 调用函数以获取剪贴板上的文件路径
        // getClipboardFilePaths();
      },
    );
  };

  if (windowStore.isSeparatedChat()) {
    onMounted(() => {
      startShortcutWatch();
    });
    onUnmounted(() => {
      stopShortcutWatch?.();
    });
  } else {
    onActivated(() => {
      startShortcutWatch();
    });
    onDeactivated(() => {
      stopShortcutWatch?.();
    });
  }
};
