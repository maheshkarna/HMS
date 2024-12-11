app.serialHelper = {
  baudRate: 9600,
  portObj: null,
  getSerialPort: async () => {
    await navigator.serial.requestPort();
  },
  readFromSerialPort: async () => {
    try {
      let port;
      if (app.serialHelper.portObj == null) {
        port = await app.serialHelper.getSerialPort();
        app.serialHelper.portObj = port;
        console.log(port);
        await port.open({ baudRate: app.serialHelper.baudRate });
      }
      const decoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(decoder.writable);
      const inputStream = decoder.readable;
      const reader = inputStream.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          console.log(value + "\n");
        }
        if (done) {
          console.log("[readLoop] DONE", done);
          reader.releaseLock();
          break;
        }
      }
      reader.cancel();
      await readableStreamClosed.catch(() => {
        /* Ignore the error */
      });
      app.serialHelper.closeSerialPort();
    } catch (error) {
      console.log(error);
    }
  },
  writeToSerialPort: async () => {
    try {
      let port;
      if (portObj == null) {
        port = await app.serialHelper.getSerialPort();
        portObj = port;
        await port.open({ baudRate: app.serialHelper.baudRate });
      }

      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      const writer = textEncoder.writable.getWriter();
      await writer.write("open gate");
      writer.close();
      await writableStreamClosed;
      app.serialHelper.closeSerialPort();
    } catch (error) {
      console.log(error);
    }
  },
  closeSerialPort: async () => {
    let port;
    if (portObj == null) {
      port = await app.serialHelper.getSerialPort();
      portObj = port;
    }
    await port.close();
  },
};
