import { Loader, app } from './app.js';
import dotenv from "dotenv";
dotenv.config();


(async () => {
    await Loader();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log("Server running successfully on port", PORT);
    });
})();