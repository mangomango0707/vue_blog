// module.exports = {
//     // 配置跨域代理
//     devServer: {
//         open: true,
//         port: 80,
//         host: '127.0.0.1',
//         // 开启代理服务
//         proxy: {
//             // 请求地址以/api开头使用该代理（可去掉）
//             "/api": {
//                 target: "http://localhost:8081", // api的接口地址
//                 changeOrigin: true, // 是否允许跨域
//                 pathRewrite: {
//                     "/api": "" // 实际不存在这个前缀，重写去掉
//                 }
//             }
//         }
//     }
// }