const webpack = require("webpack");
const path = require("path");
const Timestamp = new Date().getFullYear();

function resolve(dir) {
    return path.join(__dirname, dir);
  }

module.exports = {
    // 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
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

    // 允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: config => {
        // alias 自定义路径
        config.resolve.alias
        .set("@", resolve("src"))
        .set("@images", resolve("src/assets/images"))

        // 移除 prefetch 插件
        config.plugins.delete("prefetch");
        // 移除 preload 插件，避免加载多余的资源
        config.plugins.delete("preload");
    },

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