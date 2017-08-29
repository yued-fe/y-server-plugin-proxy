# y-server-plugin-proxy

y-server-plugin-proxy is a [y-server](https://github.com/yued-fe/y-server) plugin to proxy request.

## Install

```bash
npm install y-server-plugin-proxy
```

## Usage

```javascript
const path = require('path');

const yServer = require('y-server');
const proxyPlugin = require('y-server-plugin-proxy');

yServer({
  plugins: [
    proxyPlugin({
      proxyPaths: ['/majax/*'],
      proxyServer: 'http://m.readnovel.com',
      proxyOptions: {
        query: {},
        headers: {},
      },
    }),
  ],
});
```

## Notes

* `proxyPaths` is the Array which will be proxy.
* `proxyServer` is the proxy server.
* `proxyOptions` is the proxy options (see [express-request-proxy](https://github.com/4front/express-request-proxy)).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
