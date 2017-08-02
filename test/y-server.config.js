'use strict';

const path = require('path');

const apmPlugin = require('../index.js');

module.exports = {
  watch: path.join(__dirname, '../index.js'),
  plugins: [
    apmPlugin({
      apiPaths: ['/majax/*'],

      proxyServer: 'http://m.readnovel.com', // 代理的 server
      proxyOptions: {
        query: {},
        headers: {},
      },

      mockEnable: true, // 是否使用本地模拟数据
      mockDir: path.join(__dirname, './json'), // 模拟数据根目录
      mockResultResolver: path.join(__dirname, './json/resultResolver.js'),
      throwMockError: true,
    }),
  ],
};
