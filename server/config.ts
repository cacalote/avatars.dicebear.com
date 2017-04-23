import * as path from 'path';

export default {
    port: process.env.PORT || 3000,
    public: path.resolve(__dirname, '..', 'public'),
    httpCaching: '30d',
    maxSize: 200,
    minSize: 20
};
