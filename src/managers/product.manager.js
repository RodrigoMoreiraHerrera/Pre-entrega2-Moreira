import fs from "node:fs";
import { v4 as uuid } from "uuid";

class ProductManager {
    path;
    products = [];

    constructor({ path }) {
        this.path = path;

        if (fs.existsSync(path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
        }
    }
    ///////////////////////////////////////
    async getAll() {
        return this.products;
    }
    //////////////////////////////////////
    async getById({ id }) {
        return this.products.find((product) => product.id === id);
    }
    //////////////////////////////////////////////////////
    async create({ title, description, code, price, status = true, stock, category }) {                                                //! cambiar parametros a los que se requieren
        const id = uuid();
        // VALIDACIONES?
        /*      if (this.products.some((p) => p.id === id)) {
            return null;
        }*/

        const product = { id, title, description, code, price, status, stock, category };                                          //! cambiar parametros a los que se requieren

        this.products.push(product);

        try {
            await this.saveOnFile();
            return product;
        } catch (error) {
            console.error("Error al crear el producto");
        }
    }
    //////////////////////////////////////////////////
    async update({ id, title, description, code, price, status, stock, category }) {                                           //! cambiar parametros a los que se requieren
        const product = this.products.find((p) => p.id === id);

        if (!product) { return null; }

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.code = code ?? product.code;
        product.price = price ?? product.price;
        product.status = status ?? product.status;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;

        const index = this.products.findIndex((p) => p.id === id);
        this.products[index] = product;

        try {
            await this.saveOnFile();
            return product;
        } catch (error) {
            console.error("Error al actualizar el archivo");
        }
    }
    ////////////////////////////////////////////////
    async delete({ id }) {
        const product = this.products.find((p) => p.id === id);

        if (!product) { return null; }

        const index = this.products.findIndex((p) => p.id === id);
        this.products.splice(index, 1);

        try {
            await this.saveOnFile();
            return product;
        } catch (error) {
            console.error("Error al eliminar el archivo");
        }
    }
    ///////////////////////////////////////////////////
    async saveOnFile() {
        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, 2));
        } catch (error) {

            console.error("Error al guardar el archivo");
        }
    }

}

export const productManager = new ProductManager({ path: "./src/data/productos.json" }); 