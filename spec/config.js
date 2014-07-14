var requirejs = require("requirejs");

requirejs.config({
  // node のモジュールはそのまま
  nodeRequire: require,
  // when spec is excuted, __dirname is the path to spec directory
  baseUrl: __dirname + '/../js'
});
