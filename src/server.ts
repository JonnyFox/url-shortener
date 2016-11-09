import * as express from 'express';
import * as path from 'path';
import container from './inversify.config';
import { ObjectID } from 'mongodb';
import { MongoService, ConfigService } from './services';

function checkUrl(url: string): boolean {
    if (!url) return false;
    return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
}

function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction): any {
    res.status(err.status || 500)
        .render('error', {
            message: err.message,
            error: err
        });
}

var configService = container.get(ConfigService);

process = configService.configProcess(process);

var app = express();
app.use(errorHandler);
app.use('/new/*', (req, res, next) => {
    let url = req.params[0];
    if (!checkUrl(url)) {
        res.status(404)
            .json({ error: 'Invalid url' });
    } else next();
});
app.get('/new/*', async (req, res, next) => {
    let url = req.params[0];
    try {
        let mongoService = container.get(MongoService);
        let urls = await mongoService.getUrlsCollection();
        let response: Item = {
            original_url: url
        };
        let entries: Item[] = await urls.find(response).toArray();
        if (!entries.length) {
            let opResult = await urls.insert(response);
            response.short_url = <string><any>opResult.insertedId;
        } else {
            await urls.update(response, {
                $set: {
                    original_url: url
                }
            });
            response.short_url = `localhost:8999/go/${(<any>entries[0])._id}`;
        }
        return res.status(200)
            .json(response);
    } catch (err) {
        return next(err);
    }
});
app.get('/go/:id', async (req, res, next) => {
    try {
        let mongoService = container.get(MongoService);
        let urls = await mongoService.getUrlsCollection();
        let entries: Item[] = await urls.find({ _id: new ObjectID(req.params.id )}).toArray();
        if (!entries.length) {
            throw { err: `Unable to find entry _id ${req.params.id}` };
        }
        return res.redirect(entries[0].original_url);
    }
    catch (err) {
        return next(err);
    }
});
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(process.env.PORT);