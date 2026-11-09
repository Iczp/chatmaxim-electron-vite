import { MessageSenderService } from '../../src/apis/services/MessageSenderService';
import { OpenAPI } from '../../src/apis/core/OpenAPI';
import { savePendingAttachment, readPendingAttachment } from '../../src/data/local/attachmentStore';

(globalThis as any).runUploadTest = async (baseUrl: string, phase: string) => {
  OpenAPI.BASE = baseUrl;
  const scope = { accountId: 'upload-test', ownerId: 1, sessionVersion: 1 };
  const meta = { name: 'sample.png', type: 'image/png', size: 25, lastModified: 1234 };
  if (phase === 'prepare') {
    const input = new File(['restored attachment bytes'], meta.name, { type: meta.type, lastModified: meta.lastModified });
    await savePendingAttachment(scope, 'unit', 'client-id', input);
    return { prepared: true };
  }
  const restored = await readPendingAttachment(scope, 'unit', 'client-id', meta);
  const response = await MessageSenderService.sendUploadImage({ sessionUnitId: 'unit', clientMessageId: 'client-id', file: restored });
  return { id: response.id, name: restored.name, type: restored.type, size: restored.size };
};
