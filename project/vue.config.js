const Timestamp = new Date().getTime();
const webpack = require("webpack");

module.exports = {
    // 设置打包文件相对路径
    publicPath: "./",
    // 构建时输出的目录
    outputDir: 'dist',
    // 构建时静态资源目录
    assetsDir: 'static',
    // 构建时入口页面
    indexPath: 'index.html',
    // 关闭生产环境的 source map, 设置为 false 以加速生产环境构建 (注：辅助测试用)
    productionSourceMap: false,
    //保存时是否用eslint-loader检查
    lintOnSave: true,

    configureWebpack: {
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `[name].${Timestamp}.js`,
            chunkFilename: `[name].${Timestamp}.js`
          },
          // lodash插件
          plugins: [
            new webpack.ProvidePlugin({
              Lodash: "lodash",
              _: "lodash"
            })
          ]
    },

     //跨域代理服务器配置
    runtimeCompiler: true,
    devServer: {
        port: '8888',
        proxy: {
            "/api": {
                target: "http://edu.jxrisesun.com/webapi-service", //对应自己的接口
                changeOrigin: true,
                ws: true,        //如果要代理 websockets，配置这个参数
                secure: false,  // 如果是https接口，需要配置这个参数
                pathRewrite: {
                "^/apis": ""
                }
            }
        }
    }
}