import * as path from 'path';

export default {
    port: process.env.PORT || 3000,
    public: path.resolve(__dirname, '..', 'public'),
    httpCaching: '1y',
    maxSize: 200,
    minSize: 20
};
