import "reflect-metadata";
import { Container } from 'inversify';
import { ConfigService, MongoService } from './services';

var container = new Container();
container.bind<ConfigService>(ConfigService).toSelf();
container.bind<MongoService>(MongoService).toSelf();
export default container;