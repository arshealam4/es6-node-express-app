
import mongoose from 'mongoose';
import config from 'config';

mongoose.Promise = Promise;
let db = mongoose.createConnection(String(config.get('mongodb')), {
    useNewUrlParser: true
});

db.on('error', console.error.bind(console, 'connection to DB error: '));
db.once('open', function() {
    console.log('[Server]', 'Connection with MongoDB installed');
});

export default db;
