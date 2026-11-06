
      try {
        (function r({contextBridge:n,ipcRenderer:s}){if(!s)return;s.on("__ELECTRON_LOG_IPC__",(a,i)=>{window.postMessage({cmd:"message",...i})}),s.invoke("__ELECTRON_LOG__",{cmd:"getOptions"}).catch(a=>console.error(new Error(`electron-log isn't initialized in the main process. Please call log.initialize() before. ${a.message}`)));const o={sendToMain(a){try{s.send("__ELECTRON_LOG__",a)}catch(i){console.error("electronLog.sendToMain ",i,"data:",a),s.send("__ELECTRON_LOG__",{cmd:"errorHandler",error:{message:i==null?void 0:i.message,stack:i==null?void 0:i.stack},errorName:"sendToMain"})}},log(...a){o.sendToMain({data:a,level:"info"})}};for(const a of["error","warn","info","verbose","debug","silly"])o[a]=(...i)=>o.sendToMain({data:i,level:a});if(n&&process.contextIsolated)try{n.exposeInMainWorld("__electronLog",o)}catch{}typeof window=="object"?window.__electronLog=o:__electronLog=o})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    