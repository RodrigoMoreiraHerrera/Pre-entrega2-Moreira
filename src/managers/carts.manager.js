import fs from "node:fs";
import { v4 as uuid } from "uuid";

class CartManager {
    path;
    carts = [];



    constructor({ path }) {
        this.path = path;

        if (fs.existsSync(path)) {
                    try {
                        this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
                    } catch (error) {
                        this.carts = [];
                    }
                } else {
                    this.carts = [];
                }
            }

        async create() {
            const id = uuid();
            const products = [];
            const cart = { id, products };
            this.carts.push(cart);
            try {
                await this.saveOnFile();
                return cart;
            } catch (error) {
                console.error("Error al crear el carrito");
            }
        }

        async getCarts () {
            return this.carts;
        }

        async getById({ id }) {
            return this.carts.find((cart) => cart.id === id);
        }

        async postById ({ id, productId, quantity }) {
            const cart = this.carts.find((cart) => cart.id === id);
            if (!cart) {
                return null;
            }


            const product = cart.products.find((product) => product.id === productId);
            if (product) {
                product.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }


            try {
                await this.saveOnFile();
                return cart;
            } catch (error) {
                console.error("Error al guardar el carrito");
            }
        }

            
        
        async saveOnFile() {
                try {
                    await fs.promises.writeFile(
                        this.path,
                        JSON.stringify(this.carts, null, 2));
                } catch (error) {
                    console.error("Error al guardar el archivo");
                }
            }
}

export const cartManager = new CartManager({ path: "./src/data/carrito.json" }); 