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
    const ownerSource = fs.readFileSync(path.join(root, 'owner-cache.js'), 'utf8');
    const messageSource = fs.readFileSync(path.join(root, 'message-cache.js'), 'utf8');
    const invalidationSource = fs.readFileSync(path.join(root, 'message-invalidation.js'), 'utf8');
    const sendLockSource = fs.readFileSync(path.join(root, 'message-send-lock.js'), 'utf8');
    async function makeWindow() {
      const win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
      windows.push(win);
      await win.loadFile(path.join(root, 'index.html'));
      await win.webContents.executeJavaScript(`(() => { const exports = {}; ${mergeSource}\n globalThis.friendMerge = exports; })()`);
      await win.webContents.executeJavaScript(`(() => { const exports = {}; const require = () => globalThis.friendMerge; ${source}\n globalThis.ImDatabase = exports.ImDatabase; })()`);
      await win.webContents.executeJavaScript(`(() => {
        const exports = {}; const require = name => name === './imDatabase' ? { ImDatabase } : {
          isLocalAccountCurrent: async scope => globalThis.activeSession === scope.sessionVersion,
          readLocalAccountSnapshot: async () => ({ accountId: 'account-c', sessionVersion: globalThis.activeSession }),
          resolveLocalAccountId: async () => 'account-c',
        };
        globalThis.activeSession = 1; ${friendSource}\n globalThis.friendCache = exports;
      })()`);
      await win.webContents.executeJavaScript(`(() => {
        const exports = {}; const require = name => name === './imDatabase' ? { ImDatabase } : {
          isLocalAccountCurrent: async scope => globalThis.activeSession === scope.sessionVersion,
          readLocalAccountSnapshot: async () => ({ accountId: 'account-c', sessionVersion: globalThis.activeSession }),
          resolveLocalAccountId: async () => 'account-c',
        }; ${ownerSource}\n globalThis.ownerCache = exports;
      })()`);
      await win.webContents.executeJavaScript(`(() => {
        const exports = {}; const require = name => name === './imDatabase' ? { ImDatabase } :
          name === '../../apis/enums' ? { MessageStateEnums: { Ok: 1, Sending: 2, Error: 4 } } : friendCache;
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
        await friendCache.saveCachedFriends(scope, [{ id: 'cached-friend', ownerId: 1, score: 9, destination: { name: 'cached' }, lastMessage: { id: 10, content: 'hello' } }]);
        await friendCache.saveCachedFriends(scope, [{ id: 'cached-friend', ownerId: 1, score: 8, destination: { code: 'code' } }]);
        await friendCache.saveCachedFriends(scope, [{ id: 'no-score', ownerId: 1 }]);
      })()`);
      await first.webContents.executeJavaScript(`(async () => {
        const scope = await ownerCache.readOwnerScope();
        await ownerCache.saveCachedOwners(scope, [{ id: 7, name: 'owner-c' }, { id: 8, name: 'second' }]);
        await ownerCache.saveCurrentOwner(scope, 8);
      })()`);
      await first.webContents.executeJavaScript(`(async () => {
        const scope = { accountId: 'account-d', ownerId: 1, sessionVersion: 1 };
        await messageCache.saveCachedMessages(scope, 'chat', Array.from({ length: 12 }, (_, n) => ({ id: n + 1, content: { text: 'm' + n } })));
        await messageCache.markHistoryComplete(scope, 'chat');
        await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'outbox', state: 2, content: { text: 'unsent' } });
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
        return { ids: cached.map(x => x.id), name: cached[0]?.destination?.name, score: cached[0]?.score, lastId: cached[0]?.lastMessage?.id, detail: detail?.destination?.name, stale };
      })()`);
      if (JSON.stringify(cacheResult) !== JSON.stringify({ ids: ['cached-friend'], name: 'cached', score: 8, lastId: 10, detail: 'cached', stale: true })) throw new Error(`friend cache failed ${JSON.stringify(cacheResult)}`);
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
        const messages = await db.readMessages(a, 's', 10); const cursor = await db.readMessageCursor(a, 's'); db.close();
        const scope = { accountId: 'account-d', ownerId: 1, sessionVersion: 1 };
        const cached = await messageCache.readCachedMessages(scope, 'chat', 10);
        const pending = await messageCache.readPendingMessages(scope, 'chat');
        const ownerScope = await ownerCache.readOwnerScope();
        const owners = await ownerCache.readCachedOwners(ownerScope);
        await messageCache.saveCachedMessages(scope, 'chat', [{ id: 13, clientMessageId: 'outbox', content: { text: 'unsent' } }]);
        let rejected = false;
        try { await messageCache.savePendingMessage(scope, 'chat', { clientMessageId: 'outbox', state: 4, error: 'late' }); } catch { rejected = true; }
        await messageCache.deletePendingMessage(scope, 'chat', 'outbox');
        const confirmed = await messageCache.readCachedMessagesByIds(scope, 'chat', [13]);
        return { count: messages.length, id: messages[1]?.serverId, cursor, cached: cached.length, complete: await messageCache.readHistoryComplete(scope, 'chat'), pending: pending.map(x => [x.clientMessageId, x.state]), confirmed: confirmed.length, remaining: (await messageCache.readPendingMessages(scope, 'chat')).length, rejected, owners: owners.owners.map(x => x.id), currentOwner: owners.currentOwnerId };
      })()`);
      if (JSON.stringify(result) !== JSON.stringify({ count: 2, id: 10, cursor: 'cursor-1', cached: 10, complete: true, pending: [['outbox', 4]], confirmed: 1, remaining: 0, rejected: true, owners: [7, 8], currentOwner: 8 })) throw new Error(`restart failed ${JSON.stringify(result)}`);
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
