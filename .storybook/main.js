const path = require('path');
module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        'storybook-dark-mode',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
    ],
    framework: '@storybook/vue',
    core: {
        builder: '@storybook/builder-webpack5'
    },
    webpackFinal: async (config) => {

        // Use Sass loader for vuetify components
        config.module.rules.push({
            test: /\.s(a|c)ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../'),
        });

        // config.module.rules.push({
        //   test: /\.(png|jpg)$/,
        //   use: ['file-loader'],
        //   include: path.resolve(__dirname, '../'),
        // });

        config.module.rules.push({
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, '../src'),
                },
            },
        });

        // Return the altered config
        return config;
    },
}
