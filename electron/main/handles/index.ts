import { IpcHandle } from './IpcHandle';

// 获取继承自 IpcHandle 的所有非抽象子类
function getSubClasses(baseClass: typeof IpcHandle): (typeof IpcHandle)[] {
  const subClasses: (typeof IpcHandle)[] = [];
  for (const property in globalThis) {
    const potentialSubClass = (globalThis as any)[property];
    console.log('potentialSubClass',property, potentialSubClass);
    if (
      typeof potentialSubClass === 'function' &&
      potentialSubClass.prototype instanceof baseClass &&
      potentialSubClass !== baseClass &&
      !potentialSubClass.prototype.hasOwnProperty('constructor')
    ) {
      subClasses.push(potentialSubClass);
    }
  }
  return subClasses;
}

export const installAllIpcHandle = () => {
  // 调用每个子类的 install 方法
  const subClasses = getSubClasses(IpcHandle);

//   console.log('installAllIpcHandle', subClasses);


//   subClasses.forEach(subClass => {
//     const instance = new subClass();

//     console.log('instance', instance);

//     instance.install();
//   });
};
