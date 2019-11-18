module.exports = {
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 80
    },
    pages: {
        index: {
            // entry for the page
            entry: 'main.ts'
        }
    }
};
