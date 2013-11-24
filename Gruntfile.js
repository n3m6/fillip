module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: ['lib/*.js', 'test/*.js'],
      options: {
        node:     true,
        bitwise:  true,
        browser:  true,
        es5:      true,
        eqeqeq:   true,
        bitwise:  true,
        forin:    true,
        freeze:   true,
        camelcase: true,
        curly:    true,
        eqeqeq:   true,
        nonew:    true,
        plusplus: true,
        quotmark: "single",
        undef:    true,
        immed:    true,
        indent:   2,
        latedef:  true,
        newcap:   true,
        noarg:    true,
        unused:   true,
        regexp:   true,
        strict:   true,
        maxparams: 4,
        maxdepth: 3,
        maxstatements: 10,
        maxcomplexity: 10,
        globals: {
          console: true,
          /* Mocha */
          "describe": false,
          "it":       false,
          "before":   false,
          "beforeEach": false,
          "after":    false,
          "afterEach":  false 
        }
      }
    }

  });

  //load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');

  //register this task
  grunt.registerTask('default', ['jshint']);

};

