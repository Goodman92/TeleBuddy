var elixir = require('laravel-elixir');
var webpack = require('webpack')
require('laravel-elixir-webpack-ex');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('app.scss', 'public/css/app.css');

    mix.webpack(
        {
            app: 'main.ts',
            vendor: 'vendor.ts'
        },
        {
            module: {
                loaders: [
                    {
                        test: /\.ts$/,
                        loader: 'ts-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.html$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /\.scss$/,
                        loaders: ["raw", "sass"]
                    }
                ]
            },
            plugins: [
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'app',
                    filename: 'app.js',
                    minChunks: 5,
                    chunks: [
                        'app'
                    ]
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    filename: 'vendor.js',
                    minChunks: Infinity
                }),
                new webpack.ProvidePlugin({
                    '__decorate': 'typescript-decorate',
                    '__extends': 'typescript-extends',
                    '__param': 'typescript-param',
                    '__metadata': 'typescript-metadata'
                })
            ],
            resolve: {
                extensions: ['', '.js', '.ts']
            },
            debug: true,
            devtool: 'source-map'
        },
        'public/js',
        'resources/assets/typescript'
    );

    //ruutti public
    mix.version([
        'css/app.css', 
        'js/app.js',
        'js/vendor.js',
        'js/all.js',
        'css/all.css'
    ]);
    // totaa?
    mix.scripts([
        'public/js/vendor.js',
        'public/js/app.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ], 'public/js','./');
    //    ], 'public/js/all.js', 'public/js','./');
    mix.styles([
        'css/app.css',
    ], 'public/css/all.css', 'public/css');

    mix.browserSync({
        files: [
            "public/js/*",
            "public/css/*"
        ],
        proxy: "localhost:8000"
    });

    mix.copy('node_modules/font-awesome/fonts','public/build/fonts')
    mix.copy('resources/assets/images', 'public/images');

});
