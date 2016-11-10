import { injectable } from "inversify";

@injectable()
export class ConfigService {

    public applicationHost = 'https://fcc-bcknd-url-shortener.herokuapp.com';
    public connectionString = 'mongodb://localhost:27017/local';
    public urlsCollectionName = 'urls';

    public configProcess(process: NodeJS.Process): NodeJS.Process {
        this.connectionString = process.env.MONGODB_URI || this.connectionString;

        if (process.env.NODE_ENV === 'development') {
            this.applicationHost = 'http://localhost'
            process.env.PORT = 8999;
        }
        return process;
    }
}