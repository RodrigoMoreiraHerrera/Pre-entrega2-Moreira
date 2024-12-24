import express from "express";

import { prodructsRoute } from "./routes/products.routes.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/products", prodructsRoute);
//app.use("/api/carts", cartsRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});






