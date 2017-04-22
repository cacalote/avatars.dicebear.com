import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import Avatars from '@dicebear/avatars';
import maleSpriteSet from '@dicebear/avatars/lib/spriteSets/male';
import femaleSpriteSet from '@dicebear/avatars/lib/spriteSets/female';

import config from '../config';

let spriteSets: { [index: string]: Avatars } = {
    male: new Avatars(maleSpriteSet),
    female: new Avatars(femaleSpriteSet)
}

let router = express.Router();

router.get('/v1/:spriteSet/:seed/:size.png', function (req, res, next) {
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

    spriteSets[req.params.spriteSet].create(req.params.seed, { size: parseInt(req.params.size) }, (err, canvas) => {
        if (err) {
            next(err);

            return;
        }

        let buffer = canvas.toBuffer(undefined, 9);

        res.status(200);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', config.cacheControl);
        res.end(buffer);

        let filePath = path.resolve(config.public, './'+req.path);

        mkdirp(path.dirname(filePath), (err) => {
            if (err) {
                console.log(err);
                return;
            }

            fs.writeFile(path.resolve(config.public, './'+req.path), buffer, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    });
});

export default router;