import { Loader, app } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    await Loader();

    const REST_PORT = Number(process.env.REST_PORT) || 3003;

    app.listen(REST_PORT, '0.0.0.0', () => {
        console.log('REST server running on port', REST_PORT);
    });

})();