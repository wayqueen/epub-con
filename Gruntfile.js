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
        overwrite: true,               // destination directory or file
        replacements: [{
          // remove separated inline tag which should be 
          from: /<\/(b|i)>[ \n\r\t]*<(b|i)>/g,
          to: ''
        }, {
          // remove empty element: p|li|ol|b|i
          from: /<(p|li|ol|b|i)[^>]*>[ \n\r\t]*<\/(p|li|ol|b|i)>/g,
          to: ''
        }, {
          // remove inline style using regex
          from: /(\sstyle=("|\')(.*?)("|\'))([a-z ]*)/g,      
          to: ''
        }, {
          // flatten 2 level of ol
          from: /<(ol)[^>]*>[ \n\r\t]*<(ol)[^>]*>/g,      
          to: '<ol>'
        }, {
          // flatten 2 level of /ol
          from: /<\/(ol)>[ \n\r\t]*<\/(ol)>/g,      
          to: '</ol>'
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
        ],
      },
    },
    compress: {
      main: {
        // compress file as parent-directory-name.epub
        options: {
          archive: '../'+directoryName +'.epub',
          mode: 'zip'
        },
        files: [
          {src: ['../META-INF/**'], dest: '/'}, // includes files in path
          {src: ['../mimetype'], dest: '/'}, // includes files in path
          {src: ['../OEBPS/**'], dest: '/'}, // includes files in path
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

