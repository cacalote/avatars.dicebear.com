import * as express from 'express';
import * as Canvas from 'canvas';
import toBuffer from 'blob-to-buffer';
import Avatars from '@dicebear/avatars';
import maleSpriteSet from '@dicebear/avatars/lib/spriteSets/male';
import femaleSpriteSet from '@dicebear/avatars/lib/spriteSets/female';

let app = express();
let spriteSets = {
    male: maleSpriteSet,
    female: femaleSpriteSet
}

app.get('/:seed/:spriteSet/:size/', function (req, res, next) {
    if (parseInt(req.param('size')) < 20) {
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

    var avatars = new Avatars(spriteSets[req.params.spriteSet], {
        size: parseInt(req.params.size)
    });

    avatars.create(req.params.seed, (err, image) => {
        if (err) {
            next(err);

            return;
        }

        let canvasElement: HTMLCanvasElement = new Canvas();
        canvasElement.width = image.width;
        canvasElement.height = image.height;

        canvasElement.getContext('2d').drawImage(image, 0, 0);

        let buffer = canvasElement.toBuffer();
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        });

        res.end(buffer);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
