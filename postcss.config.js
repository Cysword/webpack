module.exports = {
    plugins: [
        require("postcss-import")(),
        require("postcss-nested")(),
        require("postcss-custom-properties")({ preserve: false }),
        require("autoprefixer")({ grid: true }),
    ],
};
