
const Themes = ['rise', 'outfit','trends', 'harmony','karupatti'];


function getThemesConfig(config, prefix = "") {
  const result = {};
  Themes.forEach((theme) => {
    result[`${prefix}${theme}`] = config(theme);
  });
  return result
}

module.exports = (grunt) => {
  grunt.initConfig({
    copy: getThemesConfig((theme) => ({
      files: [
        {
          expand: true,
          cwd: 'src',
          src: [
            `${theme}/pages/**`,
            `${theme}/layouts/**`,
            `${theme}/partials/**`,
            `${theme}/assets/**`,
          ],
          dest: 'dist/'
        }
      ],
    })),
    sass: getThemesConfig((theme) => ({
      options: {
        style: 'expanded'
      },
      files: [
        {
          expand: true,
          cwd: 'src',
          src: [`${theme}/assets/styles/**/*.scss`],
          dest: 'dist/',
          ext: '.css'
        }
      ]
    })) ,
    watch: {
      ...getThemesConfig((theme) => ({
        files: [
          `src/${theme}/assets/styles/**/*.scss`,
          `src/${theme}/**/*.liquid`
        ],
        tasks: [`sass:${theme}`, `copy:${theme}`],
        options: {
          debounceDelay: 1000,
          spawn: false,
        },
      })),
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  Themes.forEach((theme) => {
    grunt.registerTask(theme, [`watch:${theme}`]);
  });
};
