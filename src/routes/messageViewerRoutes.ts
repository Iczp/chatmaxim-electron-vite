import { RouteRecordRaw } from 'vue-router';
import { ChatObjectTypeEnums } from '../apis/enums';

export const messageViewerRoutes: RouteRecordRaw[] = [
  {
    // path: ':messageId(\\d+)/pdf',
    path: 'pdf',
    name: 'message-viewer-pdf',
    meta: {
      title: 'pdf',
    },
    component: () => import('../views/message-viewer/PdfViewer.vue'),
    props: true,
  },
];
