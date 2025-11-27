import  express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { PORT, URL } from "./utils/constant.js";
import { mainRouter } from "./routes/route.js";
import registerCrons from "./cron-jobs/index.cron.js";

const app = express();

registerCrons();
app.use(cors({
    origin: URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieparser());
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})
