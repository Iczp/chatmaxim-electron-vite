import { RouteRecordRaw } from 'vue-router';
import { ChatObjectTypeEnums } from '../apis/enums';

export const messageViewerRoutes: RouteRecordRaw[] = [
  {
    path: ':messageId(\\d+)/pdf',
    name: 'message-viewer-pdf',
    meta: {
      title: 'pdf',
    },
    component: () => import('../views/message-viewer/PdfViewer.vue'),
    props: true,
  },
  {
    path: ':messageId(\\d+)/image',
    name: 'message-viewer-image',
    meta: {
      title: 'image',
    },
    component: () => import('../views/message-viewer/ImageViewer.vue'),
    props: true,
  },
  {
    path: ':messageId(\\d+)/video',
    name: 'message-viewer-video',
    meta: {
      title: 'image',
    },
    component: () => import('../views/message-viewer/VideoViewer.vue'),
    props: true,
  },
];
