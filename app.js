import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const app = express();
app.listen(8080, () => console.log('Servidor listo'));

let productos = [
    {
        id: 1,
        nombre: 'Agua',
        descripcion: 'Botella 700ml',
        codigo: 'c137',
        precio: 300,
        stock: 126
    },
    {
        id: 2,
        nombre: 'Chocolate',
        descripcion: 'Botella 700ml',
        codigo: 'b57',
        precio: 400,
        stock: 12256
    },
    {
        id: 3,
        nombre: 'Gaseosa',
        descripcion: 'Con mani',
        codigo: 'h5357',
        precio: 250,
        stock: 355
    },
    {
        id: 4,
        nombre: 'Helado',
        descripcion: 'De agua',
        codigo: 'f288',
        precio: 200,
        stock: 145
    }
]

let counter = 5;

let schema = buildSchema(`
    type Producto{
        id: Int
        nombre: String
        descripcion: String
        codigo: String
        precio: Int
        stock: Int

    }
    type Query{
        productos: [Producto]
        productosById(id:Int): Producto
    }
    type Mutation{
        addProducto(nombre:String, descripcion:String, codigo: String, precio: Int, stock: Int): Producto
        putProducto(id:Int, nombre:String, descripcion:String, codigo: String, precio: Int, stock: Int): Producto
        deleteProducto(id:Int): [Producto]
    }
`)

const root = {
    productos: () => productos,
    productosById: (data) => {
        for (let i=0; i<productos.length; i++) {
            if (productos[i].id === data.id) return productos[i];
        }
        return {}
    },
    addProducto: (data) => {
        let producto = { 'id': counter, 'nombre': data.nombre, 'descripcion': data.descripcion, 'codigo': data.codigo, 'precio': data.precio, 'stock': data.stock}
        productos.push(producto);
        counter++
        return producto;
    },
    putProducto: (data) => {
        let productoDb;
        for (let i=0; i<productos.length; i++) {
            if (productos[i].id === data.id) productoDb = productos[i];
        }
        let producto = { 'id': data.id, 'nombre': data.nombre, 'descripcion': data.descripcion, 'codigo': data.codigo, 'precio': data.precio, 'stock': data.stock}
        let response = Object.assign(productoDb, producto);
        return response;
    },
    deleteProducto: (data) => {
        return productos.filter(producto=> producto.id != data.id);
    }
}

app.use('/test', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))