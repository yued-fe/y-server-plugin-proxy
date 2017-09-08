'use strict';
require('colors');

const url = require('url');

const proxy = require('http-proxy-middleware');

/**
 * 请求地址修复中间件
 * SwitchyOmega 将 localsite.com 指向到 locahost:8080 时得到的 url 包含 host,
 * http-proxy-middleware 的 pathRewrite 的 '^/xx' 正则需要 req.originalUrl 不能包含 host
 * 代理之前需要调用此方法对 req.originalUrl 进行修复
 * @param {Request} req 请求实例
 * @param {Resopnse} res 响应实例
 * @param {Function} next 下一步回调
 */
function reqUrlFixMiddleware(req, res, next) {
  req.originalUrl = url.parse(req.originalUrl).path;
  next();
}

/**
 * 请求代理插件
 * @param {Object} options 配置
 * @param {Array} options.proxyPaths 需要代理的路径
 * @param {String} options.proxyServer 代理服务器地址
 * @param {Object} options.proxyOptions 代理配置(express-request-proxy 配置)
 * @param {Object} options.proxyOptions.query 查询参数
 * @param {Object} options.proxyOptions.headers 请求headers
 * @return {Function} 插件安装方法
 */
module.exports = function (options) {
  if (!options || !Array.isArray(options.proxyPaths)) {
    throw new Error('[y-server-plugin-apiproxy]'.red, '"proxyPaths"配置错误');
  }

  const proxyPaths = options.proxyPaths;
  const proxyServer = options.proxyServer;
  const defaultProxyOptions = options.proxyOptions;

  /**
   * 插件安装方法
   * @param {Object} app Express实例
   */
  return function (app) {
    proxyPaths.forEach(function (routePath) {
      console.log('[Proxy]:'.green, `"${routePath}" => "${proxyServer}"`);

      app.all(routePath, reqUrlFixMiddleware, function (req, res, next) {
        if (res.sendMock) {
          res.sendMock().catch(next);
        } else {
          const proxyOptions = Object.assign({
            target: proxyServer,
            changeOrigin: true,
            logLevel: 'warn',
          }, defaultProxyOptions);

          req.query = Object.assign({}, proxyOptions.query, req.query);

          // 打 log
          const urlObj = url.parse(`${proxyServer}${req.path}`, true, true);
          urlObj.query = req.query;
          console.log('[Proxy]:'.green, `"${url.format(urlObj)}"`);

          proxy(proxyOptions)(req, res, next);
        }
      });
    });
  };
};
