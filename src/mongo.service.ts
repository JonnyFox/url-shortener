import { injectable } from 'inversify';
import { ConfigService } from './config.service';
import * as mongodb from 'mongodb';

@injectable()
export class MongoService {
    constructor(private configService: ConfigService) { }

    public async getUrlsCollection(): Promise<mongodb.Collection> {
        let mongoClient = mongodb.MongoClient;
        let db = await mongodb.MongoClient.connect(this.configService.connectionString);
        return db.collection(this.configService.urlsCollectionName);
    }
}