function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeoutId: number | null|NodeJS.Timeout = null;
  
    return function(...args: Parameters<T>): void {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
  
      timeoutId = setTimeout(() => {
        func(...args);
        timeoutId = null;
      }, wait);
    };
  }
  
  // 使用示例
//   const myFunction = debounce((message: string) => {
//     console.log(message);
//   }, 2000);
  
export {debounce}