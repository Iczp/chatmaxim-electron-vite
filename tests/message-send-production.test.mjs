import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function createSender() {
  const requests = [];
  const service = args => { requests.push(args); return Promise.resolve({ id: 55 }); };
  const dependencies = {
    ulid: { ulid: () => 'new-id' },
    '../apis': { MessageSenderService: { sendContent: service, sendUploadFile: service } },
    '../apis/enums': { MessageStateEnums: { Sending: 2 } },
    '../stores/imStore': { useImStore: () => ({ generateMessageId: () => 7, setMaxMessageId() {}, setLastMessageForSender() {} }) },
    '../stores/progressStore': { useProgressStore: () => ({ set() {} }) },
    './utils': { formatMessage: ({ items }) => items, isImageMime: () => false, isVideoMime: () => false, isAudioSuffix: () => false },
  };
  const source = fs.readFileSync(new URL('../src/commons/sendMessage.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => dependencies[name], Date, console, setTimeout });
  return { send: exports.sendMessage, requests };
}

test('失败后重试发送使用原来的客户端消息 ID', async () => {
  const { send, requests } = createSender();
  let pending;
  await new Promise((resolve, reject) => {
    send({ sessionUnitId: 'unit', messageType: 1, content: { text: 'test' }, clientMessageId: 'original-id',
      onBefore: async input => { pending = input; }, onSuccess: resolve, onError: reject });
  });
  assert.equal(pending.clientMessageId, 'original-id');
  assert.equal(requests[0].requestBody.clientMessageId, 'original-id');
});

test('附件重试把原客户端 ID 和文件传给上传接口', async () => {
  const { send, requests } = createSender();
  const file = { name: 'example.bin', type: 'application/octet-stream' };
  await new Promise((resolve, reject) => {
    send({ sessionUnitId: 'unit', messageType: 5, content: {}, file, clientMessageId: 'original-id',
      onSuccess: resolve, onError: reject });
  });
  assert.equal(requests[0].clientMessageId, 'original-id');
  assert.equal(requests[0].file, file);
});
