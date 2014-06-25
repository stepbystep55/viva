// node r.js -o build.js
({
  appDir: './'
  , baseUrl: 'js'
  , dir: './dist'
  , modules: [
    {
      name: "main"
    }
  ]
  , fileExclusionRegExp: /^(r|build)\.js$/
  , optimizeCss: 'standard'
  , removeCombined: true
  , paths: {
    jquery: 'lib/jquery.min.2.0.3'
    , underscore: 'lib/underscore.min.1.5.1'
    , processing: 'lib/processing-api.min.1.4.8'
  }
  , shim: {
    underscore: {
      exports: '_'
    }
    ,processing: {
      exports: 'Processing'
    }
  }
})
