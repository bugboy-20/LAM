addEventListener(
  "networkStatusChange",
  (resolve, reject, args) => {
    console.log("networkStatusChange");
    try {
      const info = CapacitorDevice.getNetworkStatus();
      console.log(JSON.stringify(info));
      resolve(info);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  }
);
