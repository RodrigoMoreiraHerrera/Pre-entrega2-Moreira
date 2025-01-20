import { Router } from "express";
import { productManager } from "../managers/product.manager.js";
import { io } from "../server.js";

export const productsRoute = Router();

productsRoute.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "error al obtener los productos" });
    }
});

productsRoute.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.getById({ id });

        if (!product) {
            return res.status(404).json({ error: "producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: `error al obtener el productos id: ${id} ` });
    }
});

productsRoute.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;

    try {
        const product = await productManager.create({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        });
        
        io.emit("new-product", product);

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "error al guardar el producto" });
    }
});

productsRoute.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;
    try {
        const product = await productManager.update({
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        });
        if (!product) {
            return res.status(404).json({ error: "producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "error al actualizar el producto" });
    }
});

productsRoute.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.delete({ id });
        if (!product) {
            return res.status(404).json({ error: "producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "error al eliminar el producto" });
    }
});
