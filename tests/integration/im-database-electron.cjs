const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2];
const phase = process.argv[3];
app.setPath('userData', path.join(root, 'profile'));
app.whenReady().then(async () => {
  const windows = [];
  try {
    const source = fs.readFileSync(path.join(root, 'database.js'), 'utf8');
    const mergeSource = fs.readFileSync(path.join(root, 'friend-merge.js'), 'utf8');
    const friendSource = fs.readFileSync(path.join(root, 'friend-cache.js'), 'utf8');
    const friendInvalidationSource = fs.readFileSync(path.join(root, 'friend-invalidation.js'), 'utf8');
    const ownerSource = fs.readFileSync(path.join(root, 'owner-cache.js'), 'utf8');
    const messageSource = fs.readFileSync(path.join(root, 'message-cache.js'), 'utf8');
    const attachmentSource = fs.readFileSync(path.join(root, 'attachment-store.js'), 'utf8');
    const invalidationSource = fs.readFileSync(path.join(root, 'message-invalidation.js'), 'utf8');
    const sendLockSource = fs.readFileSync(path.join(root, 'message-send-lock.js'), 'utf8');
    async function makeWindow() {
      const win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
      windows.push(win);
      await win.loadFile(path.join(root, 'index.html'));
      await win.webContents.executeJavaScript(`(() => { const exports = {}; ${mergeSource}\n globalThis.friendMerge = exports; })()`);
      await win.webContents.executeJavaScript(`(() => { const exports = {}; const require = () => globalThis.friendMerge; ${source}\n globalThis.ImDatabase = exports.ImDatabase; })()`);
      await win.webContents.executeJavaScript(`(() => { const exports = {}; ${friendInvalidationSource}\n globalThis.friendInvalidation = exports; })()`);
      await win.webContents.executeJavaScript(`(() => {
        const exports = {}; const require = name => name === './imDatabase' ? { ImDatabase } : name === './friendInvalidation' ? friendInvalidation : {
          isLocalAccountCurrent: async scope => globalThis.activeSession === scope.sessionVersion,
          readLocalAccountSnapshot: async () => ({ accountId: 'account-c', sessionVersion: globalThis.activeSession }),
          resolveLocalAccountId: async () => 'account-c',
        };
        globalThis.activeSession = 1; ${friendSource}\n globalThis.friendCache = exports;
      })()`);
      await win.webContents.executeJavaScript(`(() => { const exports = {}; const require = () => friendCache; ${attachmentSource}\n globalThis.attachmentStore = exports; })()`);
      await win.webContents.executeJavaScript(`(() => {
        const exports = {}; const require = name => name === './imDatabase' ? { ImDatabase } : {
          isLocalAccountCurrent: async scope => globalThis.activeSession === scope.sessionVersion,
          readLocalAccountSnapshot: async () => ({ accountId: 'account-c', sessionVersion: globalThis.activeSession }),
          resolveLocalAccountId: async () => 'account-c',
        }; ${ownerSource}\n globalThis.ownerCache = exports;
      })()`);
      await win.webContents.executeJavaScript(`(() => {
        const exports = {}; const require = name => name === './imDatabase' ? { ImDatabase } :
          name === '../../apis/enums' ? { MessageStateEnums: { Ok: 1, Sending: 2, Error: 4 } } : name === './attachmentStore' ? attachmentStore : friendCache;
        ${messageSource}\n globalThis.messageCache = exports;
      })()`);
      await win.webContents.executeJavaScript(`(() => { const exports = {}; ${invalidationSource}\n globalThis.invalidation = exports; })()`);
      await win.webContents.executeJavaScript(`(() => { const exports = {}; ${sendLockSource}\n globalThis.sendLock = exports; })()`);
      return win;
    }
    const first = await makeWindow();
    if (phase === 'write') {
      await first.webContents.executeJavaScript(`(async () => {
        const db = await ImDatabase.open();
        const a = { accountId: 'account-a', ownerId: 1 };
        await db.saveOwners('account-a', [{ ...a, raw: { name: 'owner' } }], 1);
        await db.upsertFriends(a, [{ ...a, id: 'f1', score: 5, raw: { name: 'friend' } }]);
        const syncScope = { accountId: 'sync-account', ownerId: 2 };
        await db.upsertFriends(syncScope, [{ ...syncScope, id: 'f', score: 100, raw: { score: 100, sorting: 0, ticks: 100 } }]);
        let rolledBack = false;
        try { await db.applyFriendChanges(syncScope, [
          { ...syncScope, id: 'f', score: 110, raw: { score: 110, sorting: 0, ticks: 110 } },
          { ...syncScope, id: 'missing', raw: { name: 'no-score' } },
        ], 110); } catch { rolledBack = true; }
        if (!rolledBack || await db.readFriendChangesTicks(syncScope) !== 100 || (await db.readFriend(syncScope, 'f')).score !== 100) throw new Error('friend change rollback failed');
        await db.applyFriendChanges(syncScope, [{ ...syncScope, id: 'f', score: 110, raw: { score: 110, sorting: 0, ticks: 110 } }], 110);
        await db.applyFriendChanges(syncScope, [], 105);
        if (await db.readFriendChangesTicks(syncScope) !== 110) throw new Error('friend change cursor regressed');
        await db.setHistoryComplete(a, 's', true);
        await db.upsertMessage({ ...a, sessionUnitId: 's', localId: 'local', clientMessageId: 'client', score: 1, state: 'sending', raw: { text: 'hello' } });
        await db.upsertMessage({ ...a, sessionUnitId: 's', localId: 'server', clientMessageId: 'client', serverId: 10, score: 10, state: 'sent', raw: { text: 'hello' } });
        await db.applyMessageMutations(a, 's', [{ messageId: 20, syncVersion: '2', isDeleted: true }], 'cursor-1');
        await db.upsertMessage({ ...a, sessionUnitId: 's', localId: 'later', serverId: 20, score: 20, state: 'sent', raw: {} });
        const ids = await db.readMessageServerIds(a, 's', 0, 10);
        if (JSON.stringify(ids) !== '[10,20]') throw new Error('deleted messages missing from calibration');
        await db.applyMessageMutations(a, 's', [{ messageId: 20, syncVersion: '3', isDeleted: false }], null, true);
        if ((await db.readMessages(a, 's', 10)).length !== 2 || await db.readMessageCursor(a, 's') !== 'cursor-1') throw new Error('calibration failed');
        await db.applyMessageMutations(a, 's', [{ messageId: 20, syncVersion: '4', isDeleted: true }], 'cursor-1');
        let mutationFailed = false;
        try { await db.applyMessageMutations(a, 's', [
          { messageId: 10, syncVersion: '3', isDeleted: true },
          { messageId: 11, syncVersion: '3', isDeleted: true, bad() {} },
        ], 'incorrect-cursor'); } catch { mutationFailed = true; }
        if (!mutationFailed) throw new Error('expected failed mutation transaction');
        let failed = false;
        try { await db.upsertFriends(a, [{ ...a, id: 'bad1', score: 1, raw: {} }, { ...a, id: 'bad2', score: 2, raw: { fn() {} } }]); } catch { failed = true; }
        if (!failed) throw new Error('expected failed transaction');
        db.close();
      })()`);
      const second = await makeWindow();
      await second.webContents.executeJavaScript(`globalThis.friendEvents = []; friendInvalidation.onFriendsChanged(event => friendEvents.push(event)); true;`);
      await first.webContents.executeJavaScript(`(async () => { globalThis.releaseLock = await sendLock.acquireMessageSendLock(1, 1, 'chat', 'same'); return true; })()`);
      const denied = await second.webContents.executeJavaScript(`(async () => {
        try { await sendLock.acquireMessageSendLock(2, 1, 'chat', 'same'); return false; } catch { return true; }
      })()`);
      if (!denied) throw new Error('duplicate send lock accepted');
      await first.webContents.executeJavaScript(`releaseLock(); true;`);
      await second.webContents.executeJavaScript(`(async () => { globalThis.releaseLock = await sendLock.acquireMessageSendLock(1, 1, 'chat', 'same'); return true; })()`);
      await second.webContents.executeJavaScript(`releaseLock(); true;`);
      const temporary = await makeWindow();
      await temporary.webContents.executeJavaScript(`(async () => { await sendLock.acquireMessageSendLock(1, 1, 'chat', 'closed'); return true; })()`);
      temporary.destroy();
      const recovered = await first.webContents.executeJavaScript(`(async () => {
        const deadline = Date.now() + 3000;
        do {
          try { const release = await sendLock.acquireMessageSendLock(1, 1, 'chat', 'closed'); release(); return true; }
          catch { await new Promise(resolve => setTimeout(resolve, 20)); }
        } while (Date.now() < deadline);
        return false;
      })()`);
      if (!recovered) throw new Error('closed window did not release send lock');
      await second.webContents.executeJavaScript(`globalThis.invalidationEvents = []; invalidation.onMessageChanged(event => invalidationEvents.push(event)); true;`);
      await first.webContents.executeJavaScript(`invalidation.notifyMessageChanged({ ownerId: 1, sessionUnitId: 'chat', sessionVersion: 1, clientMessageId: 'outbox' });`);
      const events = await second.webContents.executeJavaScript(`(async () => {
        const deadline = Date.now() + 3000;
        while (!invalidationEvents.length && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
        return invalidationEvents;
      })()`);
      if (JSON.stringify(events) !== JSON.stringify([{ ownerId: 1, sessionUnitId: 'chat', sessionVersion: 1, clientMessageId: 'outbox' }])) throw new Error(`window notification failed ${JSON.stringify(events)}`);
      await Promise.all([first, second].map((win, index) => win.webContents.executeJavaScript(`(async () => {
        const db = await ImDatabase.open();
        await db.upsertMessage({ accountId: 'account-a', ownerId: 1, sessionUnitId: 's', localId: 'race-' + ${index}, clientMessageId: 'race-client', score: 30, state: 'sending', raw: {} });
        db.close();
      })()`)));
      await first.webContents.executeJavaScript(`(async () => {
        const scope = await friendCache.readFriendScope(1);
        await friendCache.saveCachedFriends(scope, [{ id: 'cached-friend', ownerId: 1, score: 9, sorting: 0, ticks: 9, destination: { name: 'cached' }, lastMessage: { id: 10, content: 'hello' } }]);
        await friendCache.saveCachedFriends(scope, [{ id: 'cached-friend', ownerId: 1, score: 8, sorting: 0, ticks: 8, destination: { code: 'code' } }]);
        await friendCache.saveCachedFriends(scope, [{ id: 'cached-friend', ownerId: 1, score: 7, destination: { code: 'partial' } }]);
        await friendCache.saveCachedFriends(scope, [{ id: 'cached-friend', ownerId: 1, destination: { description: 'no-score update' } }]);
        await friendCache.saveCachedFriends(scope, [{ id: 'no-score', ownerId: 1 }]);
        const sync = await friendCache.openFriendChangesStore(scope);
        await sync.apply([{ id: 'cached-friend', ownerId: 1, score: 11, sorting: 0, ticks: 11 }], 11);
      })()`);
      const friendEvents = await second.webContents.executeJavaScript(`(async () => {
        const deadline = Date.now() + 3000;
        while (friendEvents.length < 5 && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
        const scope = await friendCache.readFriendScope(1);
        const row = await friendCache.readCachedFriend(scope, 'cached-friend');
        return { events: friendEvents, description: row?.destination?.description };
      })()`);
      if (friendEvents.events.length !== 5 || friendEvents.events.some(event => JSON.stringify(event) !== JSON.stringify({ ownerId: 1, sessionVersion: 1, ids: ['cached-friend'] })) || friendEvents.description !== 'no-score update') throw new Error(`friend notification failed ${JSON.stringify(friendEvents)}`);
      await first.webContents.executeJavaScript(`(async () => {
        const scope = await ownerCache.readOwnerScope();
        await ownerCache.saveCachedOwners(scope, [{ id: 7, name: 'owner-c' }, { id: 8, name: 'second' }]);
        await ownerCache.saveCurrentOwner(scope, 8);
      })()`);
      await first.webContents.executeJavaScript(`(async () => {
        const scope = { accountId: 'account-d', ownerId: 1, sessionVersion: 1 };
        const changingFile = { name: 'changing.bin', type: 'application/octet-stream', size: 1, lastModified: 1,
          stream: () => new ReadableStream({ start(controller) { globalThis.activeSession = 2; controller.enqueue(new Uint8Array([1])); controller.close(); } }) };
        let interrupted = false;
        try { await attachmentStore.savePendingAttachment(scope, 'chat', 'changing', changingFile); } catch { interrupted = true; }
        globalThis.activeSession = 1;
        let removed = false;
        try { await attachmentStore.readPendingAttachment(scope, 'chat', 'changing', { name: 'changing.bin', type: 'application/octet-stream', size: 1, lastModified: 1 }); } catch { removed = true; }
        if (!interrupted || !removed) throw new Error('stale attachment was not removed');
        await messageCache.saveCachedMessages(scope, 'chat', Array.from({ length: 12 }, (_, n) => ({ id: n + 1, content: { text: 'm' + n } })));
        await messageCache.markHistoryComplete(scope, 'chat');
        await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'outbox', state: 2, content: { text: 'unsent' } });
        const file = new File(['attachment data'], 'photo.png', { type: 'image/png', lastModified: 1234 });
        const meta = await attachmentStore.savePendingAttachment(scope, 'chat', 'file-outbox', file);
        await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'file-outbox', state: 2, file, localAttachment: meta, content: { path: 'blob:temporary', fileName: 'photo.png' } });
        const confirmMeta = await attachmentStore.savePendingAttachment(scope, 'chat', 'file-confirmed', file);
        await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'file-confirmed', state: 2, file, localAttachment: confirmMeta, content: { path: 'blob:temporary' } });
        const missingMeta = await attachmentStore.savePendingAttachment(scope, 'chat', 'file-missing', file);
        await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'file-missing', state: 2, file, localAttachment: missingMeta, content: {} });
        await attachmentStore.deletePendingAttachment(scope, 'chat', 'file-missing');
      })()`);
      const messageResult = await second.webContents.executeJavaScript(`(async () => {
        const scope = { accountId: 'account-d', ownerId: 1, sessionVersion: 1 };
        const recent = await messageCache.readCachedMessages(scope, 'chat', 10);
        const older = await messageCache.readCachedMessages(scope, 'chat', 30, { score: 3, id: '\u0000' });
        return { recent: recent.map(x => x.id), older: older.map(x => x.id), complete: await messageCache.readHistoryComplete(scope, 'chat') };
      })()`);
      if (JSON.stringify(messageResult) !== JSON.stringify({ recent: [3,4,5,6,7,8,9,10,11,12], older: [1,2], complete: true })) throw new Error(`message cache failed ${JSON.stringify(messageResult)}`);
      const cacheResult = await second.webContents.executeJavaScript(`(async () => {
        const scope = await friendCache.readFriendScope(1);
        const cached = await friendCache.readCachedFriends(scope, 10);
        const detail = await friendCache.readCachedFriend(scope, 'cached-friend');
        globalThis.activeSession = 2;
        let stale = false;
        try { await friendCache.readCachedFriends(scope, 10); } catch { stale = true; }
        return { ids: cached.map(x => x.id), name: cached[0]?.destination?.name, score: cached[0]?.score, lastId: cached[0]?.lastMessage?.id, detail: detail?.destination?.name, description: detail?.destination?.description, stale };
      })()`);
      if (JSON.stringify(cacheResult) !== JSON.stringify({ ids: ['cached-friend'], name: 'cached', score: 11, lastId: 10, detail: 'cached', description: 'no-score update', stale: true })) throw new Error(`friend cache failed ${JSON.stringify(cacheResult)}`);
      const result = await second.webContents.executeJavaScript(`(async () => {
        const db = await ImDatabase.open(); const a = { accountId: 'account-a', ownerId: 1 };
        const friends = await db.readFriends(a, 10); const messages = await db.readMessages(a, 's', 10);
        const other = await db.readFriends({ accountId: 'account-b', ownerId: 1 }, 10);
        const cursor = await db.readMessageCursor(a, 's'); const loadedAll = await db.isHistoryComplete(a, 's');
        const owners = await db.readOwners('account-a'); const otherOwners = await db.readOwners('account-b');
        const friend = await db.readFriend(a, 'f1'); db.close();
        return { friends: friends.map(x => x.id), friend: friend?.id, messages: messages.map(x => [x.clientMessageId, x.serverId ?? null]), other: other.length, cursor, loadedAll, currentOwner: owners.currentOwnerId, otherOwnerCount: otherOwners.owners.length };
      })()`);
      if (JSON.stringify(result) !== JSON.stringify({ friends: ['f1'], friend: 'f1', messages: [['race-client', null], ['client', 10]], other: 0, cursor: 'cursor-1', loadedAll: true, currentOwner: 1, otherOwnerCount: 0 })) throw new Error(`unexpected result ${JSON.stringify(result)}`);
    } else {
      const result = await first.webContents.executeJavaScript(`(async () => {
        const db = await ImDatabase.open(); const a = { accountId: 'account-a', ownerId: 1 };
        const messages = await db.readMessages(a, 's', 10); const cursor = await db.readMessageCursor(a, 's');
        const friendTicks = await db.readFriendChangesTicks({ accountId: 'sync-account', ownerId: 2 }); db.close();
        const scope = { accountId: 'account-d', ownerId: 1, sessionVersion: 1 };
        const cached = await messageCache.readCachedMessages(scope, 'chat', 10);
        const pending = await messageCache.readPendingMessages(scope, 'chat');
        const fileItem = pending.find(x => x.clientMessageId === 'file-outbox');
        const confirmationItem = pending.find(x => x.clientMessageId === 'file-confirmed');
        const missingItem = pending.find(x => x.clientMessageId === 'file-missing');
        const attachmentText = await fileItem?.file?.text();
        messageCache.clearAttachmentPreviews(1);
        const sameSessionPreview = await (await fetch(fileItem.content.path)).text();
        messageCache.clearAttachmentPreviews(2);
        let revoked = false;
        try { await fetch(fileItem.content.path); } catch { revoked = true; }
        let isolated = false;
        try { await attachmentStore.readPendingAttachment({ ...scope, accountId: 'other-account' }, 'chat', 'file-outbox', fileItem.localAttachment); } catch { isolated = true; }
        const dbCheck = await ImDatabase.open();
        const storedFile = await dbCheck.readMessageByClientId(scope, 'chat', 'file-outbox');
        dbCheck.close();
        await messageCache.deletePendingMessage(scope, 'chat', 'file-outbox');
        await attachmentStore.deletePendingAttachment(scope, 'chat', 'file-outbox');
        await messageCache.deletePendingMessage(scope, 'chat', 'file-missing');
        await messageCache.saveCachedMessages(scope, 'chat', [{ id: 14, clientMessageId: 'file-confirmed', content: { url: '/remote' } }]);
        let cleaned = false;
        try { await attachmentStore.readPendingAttachment(scope, 'chat', 'file-confirmed', confirmationItem.localAttachment); } catch { cleaned = true; }
        const confirmedFile = await messageCache.readCachedMessageByClientId(scope, 'chat', 'file-confirmed');
        const ownerScope = await ownerCache.readOwnerScope();
        const owners = await ownerCache.readCachedOwners(ownerScope);
        await messageCache.saveCachedMessages(scope, 'chat', [{ id: 13, clientMessageId: 'outbox', content: { text: 'unsent' } }]);
        let rejected = false;
        try { await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'outbox', state: 4, error: 'late' }); } catch { rejected = true; }
        await messageCache.deletePendingMessage(scope, 'chat', 'outbox');
        const confirmed = await messageCache.readCachedMessagesByIds(scope, 'chat', [13]);
        return { count: messages.length, id: messages[1]?.serverId, cursor, friendTicks, cached: cached.length, complete: await messageCache.readHistoryComplete(scope, 'chat'), pending: pending.filter(x => x.clientMessageId === 'outbox').map(x => [x.clientMessageId, x.state]), confirmed: confirmed.length, remaining: (await messageCache.readPendingMessages(scope, 'chat')).length, rejected, owners: owners.owners.map(x => x.id), currentOwner: owners.currentOwnerId, attachmentText, name: fileItem?.file?.name, preview: fileItem?.content?.path?.startsWith('blob:'), storedPath: storedFile?.raw?.content?.path ?? null, isolated, cleaned, confirmedFileId: confirmedFile?.id, confirmedFileMeta: confirmedFile?.localAttachment ?? null, missing: !missingItem?.file && missingItem?.state === 4 && !!missingItem?.error, sameSessionPreview, revoked };
      })()`);
      if (JSON.stringify(result) !== JSON.stringify({ count: 2, id: 10, cursor: 'cursor-1', friendTicks: 110, cached: 10, complete: true, pending: [['outbox', 4]], confirmed: 1, remaining: 0, rejected: true, owners: [7, 8], currentOwner: 8, attachmentText: 'attachment data', name: 'photo.png', preview: true, storedPath: null, isolated: true, cleaned: true, confirmedFileId: 14, confirmedFileMeta: null, missing: true, sameSessionPreview: 'attachment data', revoked: true })) throw new Error(`restart failed ${JSON.stringify(result)}`);
    }
    console.log(`DB_INTEGRATION_OK:${phase}`);
  } catch (error) {
    console.error('DB_INTEGRATION_ERROR', error);
    process.exitCode = 1;
  } finally {
    windows.forEach(win => { if (!win.isDestroyed()) win.destroy(); });
    app.quit();
  }
}).catch(error => { console.error(error); app.exit(1); });
