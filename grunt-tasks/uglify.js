var task = {
    scripts: {
        files: [{
            expand: true,
            cwd: 'public/',
            src: ['bundle.js'],
            dest: 'public/min/'
        }]
    }
};

module.exports = task;