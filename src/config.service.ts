import { injectable } from "inversify";

@injectable()
export class ConfigService {

    public connectionString = 'mongodb://localhost:27017/local';
    public urlsCollectionName = 'urls';

    public configProcess(process: NodeJS.Process): NodeJS.Process {
        if (process.env.NODE_ENV === 'development') {
            process.env.PORT = 8999;
        }
        return process;
    }
}