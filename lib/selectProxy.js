import checkProxy from "proxy-check";
import getProxies from "get-free-https-proxy";

export const selectProxy = () =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const proxies = await getProxies();
        let workingProxy;
        console.log(`Fetched ${proxies.length} proxies`);
        for (let proxy of proxies) {
          let isWorking;
          await checkProxy({
            host: proxy.host,
            port: proxy.port,
          })
            .then(() => {
              console.log(`Proxy server ${proxy.host}:${proxy.port} works`);
              isWorking = true;
            })
            .catch(() => {
              console.log(
                `Proxy server ${proxy.host}:${proxy.port} does not work`
              );
              isWorking = false;
            });
          if (isWorking) {
            workingProxy = proxy;
            break;
          }
        }
        if (workingProxy) {
          return resolve(workingProxy);
        }
        reject(new Error("Couldn't find any working proxy server"));
      } catch (err) {
        reject(err);
      }
    })();
  });
