module.exports = {
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/static/dist/contours' : 'http://10.38.2.16:8080',
  outputDir: "../../static/dist/contours",
  indexPath: "../../../main/templates/main/contours-vue.html"
};
