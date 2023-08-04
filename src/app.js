import express from 'express';
import Contenedor from './Contenedor.js';
import productsRouter from './Routes/productsRouter.js';
import carritosRouter from './Routes/carritosRouter.js';
import Carrito from './carrito.js';
import { Router } from 'express';




const app = express();
const contenedor = new Contenedor('productos.json');
const productosContenedor = new Contenedor('productos.json');
const carritosContenedor = new Carrito('carritos.json'); 


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Ruta para obtener todos los productos
app.get('/productos', async (req, res) => {
  const products = await contenedor.getAll();
  res.json(products);
});

app.get('/productoRandom', async (req, res) => {
  const products = await contenedor.getAll();
  const randomIndex = Math.floor(Math.random() * products.length);
  res.json(products[randomIndex]);
});

app.post('/productos', async (req, res) => {
  const newProduct = req.body;
  const productId = await contenedor.save(newProduct);
  res.json({ id: productId });
});

app.delete('/productos/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const deleteResult = await contenedor.deleteById(productId);
  if (deleteResult === "Producto eliminado") {
    res.json({ message: "Producto eliminado" });
  } else {
    res.status(404).json({ error: "Error al eliminar el producto" });
  }
});



app.use('/api/productos', productsRouter);

// Rutas para los carritos
app.use('/api/carts', carritosRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de productos y carritos!');
});




app.listen(8080, () => {
	console.log('Estoy escuchando el 8080');
});
