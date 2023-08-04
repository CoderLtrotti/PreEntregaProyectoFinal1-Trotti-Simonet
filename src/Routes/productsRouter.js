import Contenedor from '../Contenedor.js';
import express from 'express';
import { Router } from 'express';

const productsRouter = express.Router();
const productosContenedor = new Contenedor('productos.json');

productsRouter.get('/', async (req, res) => {
  try {
    const products = await productosContenedor.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productosContenedor.getById(Number(pid));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  try {
    const newProductId = await productosContenedor.save({
      title,
      description,
      code,
      price: Number(price),
      status: Boolean(status),
      stock: Number(stock),
      category,
      thumbnails,
    });
    res.json({ id: newProductId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  try {
    const product = await productosContenedor.getById(Number(pid));
    if (product) {
      const updatedProduct = {
        ...product,
        title,
        description,
        code,
        price: Number(price),
        status: Boolean(status),
        stock: Number(stock),
        category,
        thumbnails,
      };
      await productosContenedor.updateById(Number(pid), updatedProduct);
      res.json({ message: 'Producto actualizado' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    await productosContenedor.deleteById(Number(pid));
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default productsRouter;