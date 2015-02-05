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
        src: ['../epub-con-result/OEBPS/*.xhtml'],     // only search on xhtml files
        overwrite: true,               // destination directory or file
        replacements: [{
          // combine multiple inline tag as one tag
          from: /<\/(b|i)>[ \n\r\t]*<\1>/g,
          to: ''
        }, {
          // remove empty elememt
          from: /<(p|li|ol|b|i( |>))[^>]*?>[ \n\r\t]*<\/\1>/g,
          to: ''
        }, {
          // remove inline style using regex
          from: /(\sstyle=("|\')(.*?)("|\'))([a-z ]*)/g,
          to: ''
        }, {
          // replace img wrapped with p with the same image wrapped in </div>
          from: /(<p[^>]*?>)[ \n\r\t]*(<img[^>]*?>)[ \n\r\t]*<\/p>/g,
          to: '<div>$2</div>'
        }, {
          // remove layout js
          from: '<script src="JS/layout.js" type="text/javascript"></script>',
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
          {expand: true, cwd: '../', src: ['META-INF/**'], dest: '../epub-con-result/'},
          {expand: true, cwd: '../', src: ['OEBPS/**'], dest: '../epub-con-result/'},
          {expand: true, cwd: '../', src: ['mimetype'], dest: '../epub-con-result/'},
        ]
      },
      styles: {
        files: [
          {expand: true, src: ['OEBPS/*'], dest: '../epub-con-result/', filter: 'isFile'},
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
          {expand: true, cwd: '../epub-con-result/', src: ['./META-INF/**'], dest: '/'},
          {expand: true, cwd: '../epub-con-result/', src: ['./OEBPS/**'], dest: '/'},
          {expand: true, cwd: '../epub-con-result/', src: ['./mimetype'], dest: '/'}
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
    },
    imagemin: {                          // Task
      dynamic: {                         // Another target
        options: {                       // Target options
          // optimizationLevel: 3,
          // svgoPlugins: [{ removeViewBox: false }],
          // use: [mozjpeg()]
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: '../',                   // Src matches are relative to this path
          src: ['OEBPS/assets/images/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: '../epub-con-result/'                  // Destination path prefix
        }]
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
  grunt.registerTask('image', [
    'imagemin'
  ]);
  grunt.registerTask('build', [
    'compress'
  ]);
  grunt.registerTask('epub', [
    'copy:workFiles',
    'replace:epub',
    'prettify',
    'copy:styles',
    'imagemin',
    'compress',
  ]);
};