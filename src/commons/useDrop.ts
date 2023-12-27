import { ref, watch } from 'vue';

export const useDrop = (
  args: {
    dropHandle?: (e: DragEvent, args: { files?: Array<any>; text?: string }) => void;
    class?: string;
  } = {
    class: 'dragenter',
  },
) => {
  const isDrag = ref(false);

  const dragenter = (e: DragEvent) => {
    // console.log('vDrop dragenter', e);
    e.preventDefault();
    isDrag.value = true;
  };
  const dragleave = (e: DragEvent) => {
    // console.log('vDrop dragleave', e);
    e.preventDefault();
    isDrag.value = false;
  };

  const vDrop = {
    mounted: (el: HTMLElement, binding: any) => {
      console.log('vDrop mounted', el.className);
      //   ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
      el.addEventListener('dragenter', dragenter);
      el.addEventListener('dragover', dragenter);
      el.addEventListener('dragleave', dragleave);
      el.addEventListener('drop', (e: DragEvent) => {
        // e.preventDefault();
        // console.log('drop', e, e.dataTransfer);
        isDrag.value = false;

        const files = [];
        // Print each format files
        for (let i = 0; i < (e.dataTransfer?.files || []).length; i++) {
          files.push(e.dataTransfer?.files[i]);
        }
        const text = e.dataTransfer?.getData('text');

        args?.dropHandle?.call(el, e, { files, text });
        // console.log('vDrop binding', typeof binding, binding);
        binding.value?.call(el, e, { files, text });
        // (binding.value as ((e: DragEvent) => void) | undefined)?.call(el, e);
      });

      watch(isDrag, v => {
        // console.log('isDrag', v);
        const className = args.class;
        if (v) {
          if (!el.className.split(' ').some(x => x == className)) {
            el.className = el.className + ' ' + className;
          }
        } else {
          const names = el.className.split(' ');
          const index = names.findIndex(x => x == className);
          if (index != -1) {
            names.splice(index, 1);
            el.className = names.join(' ');
          }
        }
      });
    },
  };
  return { isDrag, vDrop };
};
