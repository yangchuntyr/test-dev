function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: number;
  let timeoutId: NodeJS.Timeout | number | undefined = undefined;
  //异步请求是否已经完成 如果没有完成 是不能再发起请求的
let isFinish=true;
  function wrapper(...args: Parameters<T>): void {
    if (inThrottle) {
      // 如果在节流时间内，则将函数执行计划设置为下一次执行
      clearTimeout(timeoutId);
    
      let leftTime = limit - (Date.now() - lastFunc);
    
      timeoutId = setTimeout(() => {
        if(!isFinish){
          console.log('请求未完成')
          return
        }
        isFinish=false
        const ret = func(...args);
        if ( ret instanceof Promise) {
          ret.finally(() => {
            isFinish=true
            lastFunc = Date.now();
          })
        } else {
          isFinish=true
          lastFunc = Date.now();
        }


      }, leftTime);
      return;
    }
    // 如果不在节流时间内，则立即执行函数
    func(...args);
    lastFunc = Date.now();
    inThrottle = true;
  }

  return wrapper;
}

export { throttle }
// 使用示例
const myFunction = throttle((message: string) => {
  console.log(message);
}, 2000);

myFunction('Hello'); // 每2秒最多执行一次