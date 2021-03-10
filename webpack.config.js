const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: path.resolve(__dirname, './client'),
        historyApiFallback: true
    },
    entry: {
        popup: path.resolve(__dirname, "client/src/index-js/index-popup.js"),
        options: path.resolve(__dirname, "client/src/index-js/index-options.js"),
        foreground: path.resolve(__dirname, "client/src/index-js/index-foreground.js")
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                {
                                    'plugins': ['@babel/plugin-proposal-class-properties']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 1,
                      modules: true
                   }
                 }
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader",
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[hash]-[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'idx-popup.html',
            template: 'client/src/index-html/idx-popup.html',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            filename: 'idx-options.html',
            template: 'client/src/index-html/idx-options.html',
            chunks: ['options']
        }),
        // !comment out when shipping to production
        // new HtmlWebpackPlugin({
        //     filename: 'idx-foreground.html',
        //     template: 'client/src/index-html/idx-foreground.html',
        //     chunks: ['foreground']
        // }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'client/src/manifest.json', to: '[name].[ext]' },
                { from: 'client/src/index-js/index-background.js', to: '[name].[ext]' },
                { from: 'client/src/inject_script.js', to: '[name].[ext]' },
                          ]
        }),
        new CleanWebpackPlugin()
    ]
}

