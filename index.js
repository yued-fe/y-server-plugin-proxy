'use strict';
require('colors');

const url = require('url');

const proxy = require('express-request-proxy');

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

      app.all(routePath, function (req, res, next) {
        if (res.sendMock) {
          res.sendMock().catch(next);
        } else {
          const proxyOptions = Object.assign({
            url: `${proxyServer}${req.path}`,
          }, defaultProxyOptions);

          // 打 log
          const urlObj = url.parse(`${proxyServer}${req.path}`, true, true);
          urlObj.query = Object.assign({}, proxyOptions.query, req.query);
          console.log('[Proxy]:'.green, `"${url.format(urlObj)}"`);

          proxy(proxyOptions)(req, res, next);
        }
      });
    });
  };
};
