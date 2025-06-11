import  express from "express";
import { PORT } from "./utils/constant";

const app = express();

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})
