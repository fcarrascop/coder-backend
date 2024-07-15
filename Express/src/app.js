const express = require("express");
const app = express();
const PORT = 8080;

const pm = require("./ProductManager");

let products = new pm();

app.get("/products", (req, res)=>{
    let limit = req.query.limit;
    const productList = products.getProducts();
    if (!limit){
        res.json(productList);
    }
    else{
        if (limit > productList.length){
            res.json(productList);
        }
        else {
            let productsModify = [];
            for (let i=0; i<limit; i++) {
                productsModify.push(productList[i]);
            }
            res.json(productsModify);
        }
    }
})

app.get("/products/:pid", (req,res)=>{
    let pid = parseInt(req.params.pid);
    let list = products.getProductById(pid);
    res.json(list);
})


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en ${PORT}`);
})