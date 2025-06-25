import  express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { PORT } from "./utils/constant";
import { mainRouter } from "./routes/route";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieparser());
app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})
