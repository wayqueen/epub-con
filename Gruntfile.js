'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-text-replace');

  var directory = __dirname.split('/');
  directory = directory.reverse();
  var directoryName = directory[1];

  grunt.initConfig({
    replace: {
      epub: {
        src: ['../OEBPS/*.xhtml'],     // only search on xhtml files
        overwrite: true,            // destination directory or file
        replacements: [{
          from: '</b><b>',                                    // remove bugging </b><b>
          to: ''
        }, {
          from: /(\sstyle=("|\')(.*?)("|\'))([a-z ]*)/g,      // remove inline style using regex
          to: ''
        }]
      }
    },
    prettify: {
      options: {
        "indent": 2,
        "indent_char": " ",
        "indent_scripts": "normal",
        "wrap_line_length": 0,
        "brace_style": "collapse",
        "preserve_newlines": true,
        "max_preserve_newlines": 1,
        "unformatted": [
          "a",
          "code",
          "pre"
        ]
      },
      // Prettify a directory of files 
      all: {
        expand: true,
        cwd: '../OEBPS/',
        ext: '.xhtml',
        src: ['*.xhtml'],
        dest: '../OEBPS/'
      },
    },
    copy: {
      styles: {
        files: [
          // includes files within path
          {expand: false, src: ['OEBPS/*'], dest: '../', filter: 'isFile'},
          // {expand: true, src: ['excercises.css'], dest: '../OEBPS/', filter: 'isFile'},
        ],
      },
    },
    compress: {
      main: {
        options: {
          archive: '../'+directoryName +'.epub',
          mode: 'zip'
        },
        files: [
          {src: ['../META-INF/**'], dest: '/'}, // includes files in path
          {src: ['../mimetype'], dest: '/'}, // includes files in path
          {src: ['../OEBPS/**'], dest: '/'}, // includes files in path
          // {src: ['path/**'], dest: 'internal_folder2/'}, // includes files in path and its subdirs
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
          // {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    },
    watch: {
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: true
        },
        files: [
          'OEBPS/*.css',
          'OEBPS/*.xhtml',
        ]
      }
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'dev'
  ]);
  grunt.registerTask('dev', [
    'replace:epub',
    'prettify',
    'copy:styles'
  ]);
  grunt.registerTask('update', [
    'copy:styles'
  ]);
  grunt.registerTask('build', [
    'compress'
  ]);
};

