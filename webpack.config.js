const path = require("path");

module.exports = {
    entry: path.join(__dirname, "/client/src/index.jsx"),
    output: {
        path: path.join(__dirname, "/client/dist/js"),
        filename: "app.js",
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, "/client/src"),
                // loader: "babel",
                loader: "babel-loader",
                query: {
                    presets: ["react", "es2015"],
                    plugins: ["transform-class-properties"],
                },
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
        ],
    },
    watch: true,
};
