var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPluginConfigForJS = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
});

var extractStylus = new ExtractTextPlugin('[name].styl');

module.exports = {
    entry: [
        'babel-polyfill',
        './app/index.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: 'index_bundle.js'
    },
    devtool: 'source-map',
    cache: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.styl$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'style-loader!css-loader!stylus-loader'
            },
            // {
            //     test: /\.styl$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: extractStylus.extract(['css', 'stylus'])
            // }
        ]
    },
    plugins: [
        HtmlWebpackPluginConfigForJS
    ],
    stylus: {
        use: [require('nib')(), require('rupture')()],
        import: ['~nib/lib/nib/index.styl', '~rupture/rupture/index.styl']
    }
}
