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
      const cacheResult = await second.webContents.executeJavaScript(`(async () => {
        const scope = await friendCache.readFriendScope(1);
        const cached = await friendCache.readCachedFriends(scope, 10);
        globalThis.activeSession = 2;
        let stale = false;
        try { await friendCache.readCachedFriends(scope, 10); } catch { stale = true; }
        return { ids: cached.map(x => x.id), name: cached[0]?.destination?.name, score: cached[0]?.score, lastId: cached[0]?.lastMessage?.id, stale };
      })()`);
      if (JSON.stringify(cacheResult) !== JSON.stringify({ ids: ['cached-friend'], name: 'cached', score: 8, lastId: 10, stale: true })) throw new Error(`friend cache failed ${JSON.stringify(cacheResult)}`);
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
        return { count: messages.length, id: messages[1]?.serverId, cursor };
      })()`);
      if (JSON.stringify(result) !== JSON.stringify({ count: 2, id: 10, cursor: 'cursor-1' })) throw new Error(`restart failed ${JSON.stringify(result)}`);
    }
    console.log(`DB_INTEGRATION_OK:${phase}`);
  } catch (error) {
    console.error('DB_INTEGRATION_ERROR', error);
    process.exitCode = 1;
  } finally {
    windows.forEach(win => win.destroy());
    app.quit();
  }
}).catch(error => { console.error(error); app.exit(1); });
