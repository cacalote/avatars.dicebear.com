import * as path from 'path';

export default {
    port: process.env.PORT || 3000,
    public: path.resolve(__dirname, '..', 'public'),
    cacheControl: 'public, max-age=' + (60 * 60 * 24 * 30)
};
