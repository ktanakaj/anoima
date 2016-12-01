/**
 * @file webpack設定スクリプト。
 */
module.exports = {
    entry: './src/app/main.ts',
	output: {
		path: __dirname + '/src',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ["", ".ts", ".tsx", ".js"]
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: "ts-loader" }
		]
	},
	externals: {
		"moment": "moment",
	},
	watchOptions: {
		poll: 1000
	}
};