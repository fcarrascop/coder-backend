class ProductManager {
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const verificarCode = this.products.some((item)=> item.code == code);
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
            this.products.push(producto)
        }
    }

    getProduct() {
        console.log(this.products)
    }

    getProductById(id_item) {
        let  item = (this.products.find((item) => item.id === id_item)) ? console.log((this.products.find((item) => item.id === id_item))) : console.log("Not found")
        
    }
}

const Manejador = new ProductManager;


Manejador.addProduct("Televisión", "Televisión de alta fidelidad", 129990, "television.cl", 12233445, 10);
Manejador.getProduct();
Manejador.getProductById(2);