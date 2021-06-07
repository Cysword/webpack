const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entries = require("./entries/style.conf");
const aliases = require("./aliases/style.conf");
const PATHS = require("./paths");

const utilities = require(path.resolve(PATHS.srcStyle, "utilities/_import.js"));

module.exports = {
    entry: glob.sync("./assets/sass/**/index.scss").reduce((acc, path) => {
        /**
         * Replace some parts of the found path to create the correct output path
         *
         * For example:
         * `./source/sass/modules/results/index.scss`
         *
         * Will be turned in to
         * `modules/results.css`
         */
        const entry = path.replace("/index.scss", "").replace("./assets/sass/", "");
        acc[entry] = path;
        return acc;
    }, { ...entries }), // spread hard coded entry points as default
    output: {
        path:     PATHS.appStyle,
        filename: "compiledCSS/[name].js",
    },
    resolve: {
        extensions: [".css", ".scss"],
        alias:      {
            ...aliases,
        },
    },
    optimization: {
        minimize:  true,
        minimizer: [
            new CssMinimizerPlugin({
                test:             /\.css$/g,
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            }),
        ],
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use:  [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader:  "css-loader",
                },
                {
                    loader: "postcss-loader",
                },
                {
                    loader: "sass-loader",
                },
                /**
                 * This will inject several utility files in all files
                 * - variables
                 * - mixins
                 * - functions
                 */
                {
                    loader:  "sass-resources-loader",
                    options: {
                        resources: utilities,
                    },
                },
            ],
        }],
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({
            fileName:   "build-manifest-style.json",
            publicPath: "style/",
        }),
        new MiniCssExtractPlugin({
            filename: "[name]-[contenthash].css",
        }),
        new FileManagerPlugin({
            events: {
                onEnd: [{
                    delete: [
                        // clean default `.js` files that will be output from css extraction
                        path.resolve(PATHS.appStyle, "compiledCSS"),
                    ],
                }],
            },
        }),
    ],
};
