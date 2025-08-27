import  express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { PORT, URL } from "./utils/constant";
import { mainRouter } from "./routes/route";
import registerCrons from "./cron-jobs/index.cron";

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
