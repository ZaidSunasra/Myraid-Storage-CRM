import  express from "express";
import { PORT } from "./utils/constant";
import { mainRouter } from "./routes/route";

const app = express();

app.use(express.json());
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})
