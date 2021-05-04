const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 设置打包文件相对路径
  publicPath: "./",
  // 关闭生产环境的 source map
  productionSourceMap: false,
  lintOnSave: true,

  chainWebpack: (config) => {
    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@images", resolve("src/assets/images"))
      .set("@css", resolve("src/assets/css"))
      .set("@js", resolve("src/assets/js"))
      .set("@service", resolve("src/service"));

    // 移除 prefetch 插件
    // config.plugins.delete("prefetch");
    // 移除 preload 插件，避免加载多余的资源
    // config.plugins.delete("preload");
  },
  configureWebpack: {
    // output: {
    //   // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
    //   filename: `[name].${Timestamp}.js`,
    //   chunkFilename: `[name].${Timestamp}.js`
    // },
  },

  //跨域代理服务器配置
  runtimeCompiler: true,
  devServer: {
    // disableHostCheck: true,//内网穿透
    // open: process.platform === 'darwin',
    // host: 'localhost',
    port: 8071,
    // open: true, //配置自动启动浏览器
    proxy: {
      "/api": {
        target: "http://cloud.jxrisesun.com/MarketSupervisionApi", //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/apis": "",
        },
      },
    },
  },
};
