class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * Función que eliminar un producto del carrito
     */
     async eliminarProducto(sku, cantidad){
        try {
            const productoEnCarrito = await findProductInCarritoBySku(sku);
            const productoBase = await findProductBySku(sku)

            return new Promise((resolve, reject) => {
                setTimeout(() => {
               
                    if (this.productos.length === 0){
                        reject("Carrito vacío");
                        return;
                    }
                    let precio = productoBase.precio;
                    let categoria = productoBase.categoria;
                   
                    if (productoEnCarrito.cantidad < cantidad) {
                        //si la cantidad es menor a la que se encuentra, solo necesito reducirla
                        productoEnCarrito.cantidad-= cantidad;
                        this.precioTotal = this.precioTotal - (productoEnCarrito.cantidad * precio);
                    } else {
                        //elimino el producto del carrito
                        this.productos = this.productos.filter(x => x.sku !== sku);
                        //disminuyo el importe a pagar
                        this.precioTotal = this.precioTotal - (productoEnCarrito.cantidad * precio);
                        //Elimino la categoría de la lista sii no se encuentra en otro producto en el carrito.
                        if (this.productos.findIndex(x => x.categoria == categoria && x.sku !== sku) < 0) {
                            this.categorias = this.categorias.filter(x => x !== categoria);
                        }
                    }
                    resolve("Producto eliminado...");
                    //Agrego estas líneas para comprobar el resultado
                    console.log("PRODUCTOS AGREGADOS");
                    console.log(this.productos);
                    console.log("CATEGORIAS AGREGADAS");
                    console.log(this.categorias);
                    console.log("TOTAL");
                    console.log(this.precioTotal);
            }, 1500)});
        }
        catch{
            console.log(`No es posible eliminar ${sku}`);
            reject(`Problema al eliminar`);
        }
    }


    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        // Busco el producto en la "base de datos"
        try {
            const producto = await findProductBySku(sku);

            console.log("Producto encontrado", producto);

            let prodUpdate = this.productos.find(x => x.sku == sku );
            if (prodUpdate){
                prodUpdate.cantidad += cantidad;
                this.precioTotal = this.precioTotal + (producto.precio * cantidad);
            } else {
                // Creo un producto nuevo
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad, producto.categoria);
                this.productos.push(nuevoProducto);
                this.precioTotal = this.precioTotal + (producto.precio * cantidad);
                if (!this.categorias.includes(producto.categoria)){
                    this.categorias.push(producto.categoria);
                }
            }
            console.log("PRODUCTOS AGREGADOS");
            console.log(this.productos);
            console.log("CATEGORIAS AGREGADAS");
            console.log(this.categorias);
            console.log("TOTAL");
            console.log(this.precioTotal);
        }
        catch {
            console.log(`NO SE HA ENCONTRADO EL PRODUCTO CON EL CODIGO ${sku} `);
        }
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito
    categoria; // Necesito una referencia a Categoría para el eliminado

    constructor(sku, nombre, cantidad, categoria) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`No se ha encontrado el Producto ${sku}`);
            }
        }, 500);
    });
}

// Función que busca el producto en el carrito
function findProductInCarritoBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = carrito.productos.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`No se ha encontrado el producto ${sku}`);
            }
        }, 500);
    });
}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('ZZZZZZZ', 2);
carrito.agregarProducto('WE328NJ', 3);
carrito.agregarProducto('FN312PPE', 5);
carrito.agregarProducto('PV332MJ', 20);


const promesaEliminarInexistente = carrito.eliminarProducto('XXXXXXPPE', 5)
    .then(x => console.log(`${x}`))
    .catch(err => console.log(err));

const promesaEliminar = carrito.eliminarProducto('FN312PPE', 5)
    .then(x => console.log(`${x}`))
    .catch(err => console.log(err));