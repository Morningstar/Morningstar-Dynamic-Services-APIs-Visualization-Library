const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const basePath = path.resolve(__dirname, '');
const modulesPath = path.join(basePath, 'node_modules');

module.exports = {
    mode: 'production',
    entry: {
        main: ['./src/mstar-apis-sdk.js'],
        'mstar-apis-sdk': ['./src/mstar-apis-sdk-loader.js'],
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
        }),
    ],
    output: {
        filename: '[name].js',
        library: {
            root: 'MstarApisSdk',
            amd: 'mstar-apis-sdk',
            commonjs: 'mstar-apis-sdk',
        },
        libraryTarget: 'umd',
        path: path.resolve(basePath, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: modulesPath,
                loader: 'babel-loader',
                query: {
                    presets: ['env'],
                },
            },
        ],
    },
};