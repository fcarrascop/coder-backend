const fs = require("fs");

class ProductManager {
    constructor() {
        this.products = (fs.readFileSync("./ProductManager/productos.json")) ? JSON.parse(fs.readFileSync("./ProductManager/productos.json")) : [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const verificarCode = this.products.some((item)=> item.codigo == code);
        if (verificarCode) {
            console.log("Código ya existente")
        }
        else {
            const id_producto = this.products.length + 1;
            let producto = {
                id : id_producto,
                tituto: title,
                descripcion: description,
                precio: price,
                imagen: thumbnail,
                codigo: code,
                disponibilidad: stock
            }
            this.products.push(producto);
            fs.writeFileSync("./ProductManager/productos.json", JSON.stringify(this.products));

        }
    }

    getProduct() {
        console.log(this.products)
    }

    getProductById(id_item) {
        let  item = (this.products.find((item) => item.id === id_item)) ? console.log((this.products.find((item) => item.id === id_item))) : console.log("Not found")
    }

    deleteProduct(id_item) {
        let items = this.products.filter((item) => item.id != id_item);
        this.products = items;
        fs.writeFileSync("./ProductManager/productos.json", JSON.stringify(items));
    }

    updateProduct(id_item, title, description, price, thumbnail, code, stock) {
        let  item = (this.products.find((item) => item.id == id_item))
        if (item) {

            let producto = {
                id : id_item,
                tituto: title,
                descripcion: description,
                precio: price,
                imagen: thumbnail,
                codigo: code,
                disponibilidad: stock
            };
            this.deleteProduct(id_item);
            this.products.push(producto);
            fs.writeFileSync("./ProductManager/productos.json", JSON.stringify(this.products));
        }
        else {
            console.log("Item no encontrado.")
        }
    }
}

const manejoArchivos = new ProductManager;

//manejoArchivos.addProduct("Televisión", "Televisión de alta fidelidad", 129990, "television.cl", 12233445, 10);
//manejoArchivos.deleteProduct(1);
//manejoArchivos.getProductById(2);
//manejoArchivos.updateProduct(1,"Computador", "Computadora apple", 1119000, "apple.com", 1203, 3);
