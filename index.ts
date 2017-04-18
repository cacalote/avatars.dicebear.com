import * as express from 'express';
import * as Canvas from 'canvas';

import Avatars from '@dicebear/avatars';
import maleSpriteSet from '@dicebear/avatars/lib/spriteSets/male';
import femaleSpriteSet from '@dicebear/avatars/lib/spriteSets/female';

let app = express();
let spriteSets: { [index: string]: Avatars } = {
    male: new Avatars(maleSpriteSet),
    female: new Avatars(femaleSpriteSet)
}

app.get('/:seed/:spriteSet/:size/', function (req, res, next) {
    if (parseInt(req.params.size) < 20) {
        res.status(400).send('Minimum size of 20px.');
        next();

        return;
    }

    if (parseInt(req.params.size) > 200) {
        res.status(400).send('Maximum size of 200px.');
        next();

        return;
    }

    if (!spriteSets[req.params.spriteSet]) {
        res.status(400).send('Invalid sprite set. Available: '+Object.keys(spriteSets).join(', '));
        next();

        return;
    }

    if (!req.params.seed) {
        res.status(400).send('Invalid seed');
        next();

        return;
    }

    spriteSets[req.params.spriteSet].create(req.params.seed, (err, canvas) => {
        if (err) {
            next(err);

            return;
        }

        let buffer = canvas.toBuffer();
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        });

        res.end(buffer);
    }, { size: parseInt(req.params.size) });
});

let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
