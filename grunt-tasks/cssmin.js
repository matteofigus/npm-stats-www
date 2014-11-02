
var task = {
    css: {
        options: {
            keepSpecialComments: 0
        },
        files: [{
            expand: true,
            cwd: 'public/',
            src: ['bundle.css'],
            dest: 'public/min'
        }]
    }
};

module.exports = task;