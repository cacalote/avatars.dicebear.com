import * as express from 'express';
import * as Chance from 'chance';

let ms = require('ms');

import Avatars from '@dicebear/avatars';
import maleSpriteSet from '@dicebear/avatars/lib/spriteSets/male';
import femaleSpriteSet from '@dicebear/avatars/lib/spriteSets/female';

import config from '../config';

let spriteSets: { [index: string]: Avatars } = {
    male: new Avatars(maleSpriteSet),
    female: new Avatars(femaleSpriteSet)
}

let router = express.Router();

router.get(/\/v1\/([^/]+)\/([^/]*)\/(\d+)\.png/, function (req, res, next) {
    let spriteSet = req.params[0];
    let seed = req.params[1];
    let size = req.params[2];

    if (parseInt(size) < config.minSize) {
        res.status(400).send('Minimum size of '+config.minSize+'px.');
        next();

        return;
    }

    if (parseInt(size) > config.maxSize) {
        res.status(400).send('Maximum size of '+config.maxSize+'px.');
        next();

        return;
    }

    if (!spriteSets[spriteSet]) {
        res.status(400).send('Invalid sprite set. Available: '+Object.keys(spriteSets).join(', '));
        next();

        return;
    }

    let chance = new Chance(seed);

    spriteSets[spriteSet].create(chance, { size: parseInt(size) }, (err, canvas) => {
        if (err) {
            next(err);

            return;
        }

        let buffer = canvas.toBuffer(undefined, 9);

        res.status(200);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=' + (ms(config.httpCaching) / 1000));
        res.end(buffer);
    });
});

export default router;
