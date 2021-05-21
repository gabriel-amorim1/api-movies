import 'reflect-metadata';
import app from './app';

import './database/connection';
import './containers';

const PORT = process.env.PORT || 3333;

async function startServer() {

    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Service running on port ${PORT}`);
    });
}

startServer();
