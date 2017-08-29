'use strict';

const path = require('path');

const mockPlugin = require('../../y-server-plugin-mock/index.js');
const proxyPlugin = require('../index.js');

module.exports = {
  watch: path.join(__dirname, '../index.js'),
  plugins: [
    mockPlugin({
      mockEnable: false,
      mockDir: path.join(__dirname, './json'), // 模拟数据根目录
      mockAdapter: require('./json/adapter.js'),
    }),
    proxyPlugin({
      proxyPaths: ['/*'],
      proxyServer: 'http://m.qidian.com', // 代理的 server
      proxyOptions: {
        query: {},
        headers: {},
      },
    }),
  ],
};
