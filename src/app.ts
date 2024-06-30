import express from "express";
import router from "./routers/datas-route.js";

const app = express();
const PORT = 8000;

app.use(express.json())

app.use('/expense', router)



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
