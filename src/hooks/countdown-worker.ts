self.onmessage = (event) => {
  if (event.data.type === 'start') {
    let countDown = event.data.countDown;

    if ((self as any).timerId) {
      clearInterval((self as any).timerId);
    }

    (self as any).timerId = setInterval(() => {
      countDown -= 1000;
      if (countDown <= 0) {
        clearInterval((self as any).timerId);
        self.postMessage({ type: 'complete', countDown: 0 });
      } else {
        self.postMessage({ type: 'tick', countDown });
      }
    }, 1000);
  }
};
