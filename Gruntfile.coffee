proxy = require('proxy-middleware')
serveStatic = require('serve-static')
httpPlease = require('connect-http-please')
url = require('url')
middlewares = require('./speed-middleware')
middlewares7ways = require('./7ways-middleware');
path = require('path');
webpackConfig = require('./webpack.config');

module.exports = (grunt) ->
  pkg = grunt.file.readJSON('package.json')

  accountName = process.env.VTEX_ACCOUNT or pkg.accountName or 'basedevmkp'

  environment = process.env.VTEX_ENV or 'vtexcommercestable'
  
  secureUrl = process.env.VTEX_SECURE_URL or pkg.secureUrl

  verbose = grunt.option('verbose')

  local = process.env.BUILDLOCAL

  if secureUrl
    imgProxyOptions = url.parse("https://#{accountName}.vteximg.com.br/arquivos")
  else 
    imgProxyOptions = url.parse("http://#{accountName}.vteximg.com.br/arquivos")

  imgProxyOptions.route = '/files'

  # portalHost is also used by connect-http-please
  # example: basedevmkp.vtexcommercestable.com.br
  portalHost = "#{accountName}.#{environment}.com.br"
  portalProxyOptions = url.parse("https://#{portalHost}/")
  portalProxyOptions.preserveHost = true

  rewriteLocation = (location) ->
    return location
      .replace('https:', 'http:')
      .replace(environment, 'vtexlocal')

  config =
    clean:
      main: ['build','build/modules/**']

    copy:
      main:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**', '!**/*.coffee', '!**/*.less', '!sprite/**/*', "!modules/**/*", "!main.js"]
          dest: "build/arquivos"
        ]

    webpack:          
      build: 
        target: 'node'
        entry: ['./src/main.js']
        output:
          path: path.resolve(__dirname, "build/arquivos")
          filename: 'main.js'
        module:
          loaders: [
            test: /\.js?$/,
            exclude: path.resolve(__dirname, "node_modules")
            loader: "babel-loader",
            query: 
              presets:['es2015', 'react']
          ]

    babel: 
      options: 
        sourceMap: true,
        presets: ['env']
      dist:
        files: [
          expand: true
          cwd: 'src/'
          src: ['modules/**/*.js']
          dest: "build/arquivos",
          expand: true
          cwd: 'src/'
          src: ['main.js']
          dest: "build/arquivos/main.js"
        ]

    coffee:
      main:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.coffee']
          dest: "build/"
          ext: '.js'
        ]

    less:
      main:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.less']
          dest: "build/arquivos"
          ext: '.css'
        ]

    cssmin:
      main:
        expand: true
        cwd: 'build/'
        src: ['*.css', '!*.min.css']
        dest: 'build/'
        ext: '.min.css'

    uglify:
      options:
        mangle: false
      main:
        files: [
          expand: true
          cwd: 'build/arquivos'
          src: ['main.js']
          dest: 'build/arquivos'
          ext: '.min.js'
        ]

    sprite:
      all: 
        src: 'src/sprite/*.png'
        dest: 'build/spritesheet.png'
        destCss: 'build/arquivos/sprite.css'

    imagemin:
      main:
        files: [
          expand: true
          cwd: 'build/'
          src: ['**/*.{png,jpg,gif}']
          dest: 'build/'
        ]

    connect:
      http:
        options:
          hostname: "*"
          livereload: true
          port: process.env.PORT || 80
          middleware: [
            middlewares.disableCompression
            middlewares.rewriteLocationHeader(rewriteLocation)
            middlewares.replaceHost(portalHost) 
            middlewares7ways.localHtml(secureUrl,local)
            middlewares.replaceHtmlBody(environment, accountName, secureUrl)
          
            httpPlease(host: portalHost, verbose: verbose)
            serveStatic('./build')
            proxy(imgProxyOptions)
            proxy(portalProxyOptions)
            middlewares.errorHandler
          ]

    watch:
      options:
        livereload: true
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['coffee']
      less:
        options:
          livereload: false
        files: ['src/**/*.less', 'src/**/**/*.less']
        tasks: ['less']
      images:
        files: ['src/**/*.{png,jpg,gif}']
        tasks: ['imagemin']
      css:
        files: ['build/**/*.css']
      main:
        files: ['src/**/*.html', 'src/**/*.js', 'src/**/*.css']
        tasks: ['build']

      grunt:
        files: ['Gruntfile.coffee']
        tasks: ['build']

  tasks =
    # Building block tasks
    build: ['clean', 'copy:main', 'sprite', 'webpack', 'less', 'imagemin', 'uglify']
    min: ['uglify', 'cssmin'] # minifies files
    # Deploy tasks
    dist: ['build', 'min'] # Dist - minifies files
    test: []
    # Development tasks
    default: ['build', 'connect', 'watch']
    devmin: ['build', 'min',
             'connect:http:keepalive'] # Minifies files and serve

  # Project configuration.
  grunt.config.init config
  if grunt.cli.tasks[0] is 'less'
    grunt.loadNpmTasks 'grunt-contrib-less'
  else if grunt.cli.tasks[0] is 'coffee'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
  else
    grunt.loadNpmTasks name for name of pkg.devDependencies when name[0..5] is 'grunt-'
  grunt.registerTask taskName, taskArray for taskName, taskArray of tasks