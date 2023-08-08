require('dotenv').config();
import { ExtendedClient } from './structures/Client';
import dbConnect from './assets/utils/mongoose';

export const client = new ExtendedClient();
dbConnect.init();

client.start();