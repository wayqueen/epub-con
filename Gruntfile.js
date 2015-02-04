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
        src: ['../result/OEBPS/*.xhtml'],     // only search on xhtml files
        overwrite: true,               // destination directory or file
        replacements: [{
          // combine multiple inline tag as 
          from: /<\/(b|i)>[ \n\r\t]*<\1>/g,
          to: ''
        }, {
          from: /<(p|li|ol|b|i( |>))[^>]*?>[ \n\r\t]*<\/\1>/g,
          to: ''
        }, {
          // remove inline style using regex
          from: /(\sstyle=("|\')(.*?)("|\'))([a-z ]*)/g,      
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
      workFiles: {
        files: [
          {expand: true, cwd: '../', src: ['META-INF/**'], dest: '../result/'},
          {expand: true, cwd: '../', src: ['OEBPS/**'], dest: '../result/'},
          {expand: true, cwd: '../', src: ['mimetype'], dest: '../result/'},
        ]
      },
      styles: {
        files: [
          {expand: true, src: ['OEBPS/*'], dest: '../result/', filter: 'isFile'},
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
          {expand: true, cwd: '../result/', src: ['./META-INF/**'], dest: '/'},
          {expand: true, cwd: '../result/', src: ['./OEBPS/**'], dest: '/'},
          {expand: true, cwd: '../result/', src: ['./mimetype'], dest: '/'}
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
    'copy:workFiles',
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

