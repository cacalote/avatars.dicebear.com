import * as express from 'express';
import * as Canvas from 'canvas';
import * as Chance from 'chance';
import * as fs from 'fs';

import config from './config';
import v1 from './v1/';

let app = express();

app.use(express.static('./node_modules/@dicebear/avatars/docs/'));
app.use('/dist/', express.static('./node_modules/@dicebear/avatars/dist/'));

app.use(v1);

app.listen(config.port, function () {
  console.log('Example app listening on port '+config.port);
});
