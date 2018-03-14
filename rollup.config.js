import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'float.js',
    output: {
        file: 'float.min.js',
        format: 'umd',
        name: 'Float',
    },
    plugins: [
        babel(),
        uglify(),
    ]
};