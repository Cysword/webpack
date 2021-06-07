const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const entries = require("./entries/script.conf.js");
const aliases = require("./aliases/script.conf.js");
const PATHS = require("./paths.js");

module.exports = {
    entry: glob.sync("./assets/javascript/**/index.js").reduce((acc, path) => {
        /**
         * Replace some parts of the found path to create the correct output path
         *
         * For example:
         * `./source/javascript/modules/results/index.js`
         *
         * Will be turned in to
         * `modules/results.js`
         */
        const entry = path.replace("/index.js", "").replace("./assets/javascript/", "");
        acc[entry] = path;
        return acc;
    }, { ...entries }), // spread hard coded entry points as default
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".svg", ".yaml"],
        alias:      {
            ...aliases,
        },
    },
    output: {
        path:          PATHS.appScript,
        filename:      "[name]-[contenthash].js",
        // set public path for the chunk imports
        publicPath:    "script/",
        chunkFilename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test:    /\.jsx?$/,
                exclude: [
                    /node_modules/,
                ],
                loader:  "babel-loader",
                options: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.svg$/,
                use:  ["@svgr/webpack"],
            },
            {
                test:    /\.tsx?$/,
                exclude: [
                    /node_modules/,
                ],
                loader:  "ts-loader",
                options: {
                    transpileOnly: true, // set to true to speed up but you won't get any errors and warnings in the console
                },
            },
            {
                test: /\.ya?ml$/,
                use:  "js-yaml-loader",
            },
        ],
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new WebpackManifestPlugin({
            fileName: "build-manifest-script.json",
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
    ],
    devtool: "eval-source-map",
};
