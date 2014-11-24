module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    assemble: {
      options: {
        assets: 'assets',
        plugins: ['permalinks'],
        partials: ['docs/**/*.md'],
        layout: ['layouts/default.hbs'],
        data: ['data/*.{json,yml}']
      },
      site: {
        src: ['./*.hbs'],
        dest: './',
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

  // Load assemble plugin
  grunt.loadNpmTasks('assemble');

  // Default task(s).
  grunt.registerTask('default', ['assemble']);
};
