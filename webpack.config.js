
//导入path模块，nodejs自带核心模块
let path = require('path');
//导入分离css插件
let miniCssExtractPlugin = require('mini-css-extract-plugin')
//导入处理html模板插件
let htmlWebpackPlugin = require('html-webpack-plugin')
//配置css分离插件
let mini_css_extract_plugin = new miniCssExtractPlugin({
    filename: '[name].min.css'// 重命名分离后的css文件
})
//实例化html模板
let html_webpack_plugin = new htmlWebpackPlugin({
    template: './home.html',//模板路径
    inject: 'body',//将生成打包好的脚本放在body标签之前显示

    /*true: 将生成的js插入到body结束标签之前, 默认为 true
    false: 没有插入生成的js
    head: 将生成的js插入在head结束标签之前
    body: 等同于 true
    */

    //压缩最小化
    minify: {
        removeComments: true,//是否移除注释
        removeAttributeQuotes: true,//是否移除标签属性的引号(双引号或者单引号)
        collapseWhitespace: true,// 是否移除html文件的空白符
    },
    //输出重命名
    filename: 'home.html'
})
//暴露配置文件
module.exports = {
    //配置模式 (开发模式 development，生产模式(项目上线) production)
    mode: 'development',
    // 配置入口
    entry: {
        //myhome键名将会作为打包输出的文件名称
        home: './js/home.js',
        utils: './js/utils.js',
        rem: './js/rem.js'
    },
    //配置出口 
    output: {
        path: path.resolve(__dirname + '/static'),//输出路径
        filename: '[name].min.js'//输出文件重命名, [name]就是配置入口文件的键名myhome，myapp，默认就是[name]
    },
    // 配置loader
    module: {
        //定义loader规则
        rules: [
            //处理css样式
            {
                //匹配css文件规则
                test: /\.css$/,
                //使用loader
                use: [
                    // { loader: 'style-loader' },//将样式添加到页面的style标签中
                    { loader: miniCssExtractPlugin.loader },//分离一个独立css文件
                    { loader: 'css-loader' }
                ]
            },
            //处理less
            {
                test: /\.less$/,
                use: [
                    // {loader: 'style-loader'},
                    { loader: MIN_CSS_EXTRACT_PLUGIN.loader },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            },
            //处理图片路径
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: { imit: 1000 }//将小于等于1000B大小的图片转换为base64
                }]
            },
            //处理html模板
            {
                test: /\.html?$/,
                use: [{ loader: 'html-withimg-loader' }]
            }
        ]
    },
    //配置插件  
    plugins: [
        mini_css_extract_plugin,//调用分离css插件
        html_webpack_plugin//调用html模板插件
    ],
    //配置本地服务器
    devServer: {
        host: '127.0.0.1',//服务器地址
        port: 8001,//端口
        open: 'true'//自动打开浏览器
    }
}