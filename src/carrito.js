import fs from 'fs/promises';

export default class Carrito {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
    this.nextCartId = 1;
    this.initialize();
  }

  async initialize() {
    try {
      const fileContent = await fs.readFile(this.nombreArchivo, 'utf-8');
      if (fileContent.trim() === '') {
        // Si el archivo está vacío, lo inicializamos con un arreglo vacío
        await fs.writeFile(this.nombreArchivo, '[]', 'utf-8');
      } else {
        // Si el archivo no está vacío, determinamos el próximo ID disponible
        const data = JSON.parse(fileContent);
        if (data.length > 0) {
          this.nextCartId = data[data.length - 1].id + 1;
        }
      }
    } catch (error) {
      // Si el archivo no existe, lo creamos con un arreglo vacío
      await fs.writeFile(this.nombreArchivo, '[]', 'utf-8');
    }
  }

  async save(cart) {
    try {
      const data = await this.getAll();
      const newId = this.nextCartId++;
      const newCart = { ...cart, id: newId };
      data.push(newCart);
      await fs.writeFile(this.nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
      return newId;
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
      return -1;
    }
  }

  async getById(id) {
    try {
      const data = await this.getAll();
      const cart = data.find((c) => c.id === id);
      return cart || null;
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      return null;
    }
  }

  async getAll() {
    try {
      const fileContent = await fs.readFile(this.nombreArchivo, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error al obtener todos los carritos:', error);
      return [];
    }
  }

  async deleteById(id) {
    try {
      const data = await this.getAll();
      const newData = data.filter((c) => c.id !== id);
      await fs.writeFile(this.nombreArchivo, JSON.stringify(newData, null, 2), 'utf-8');
      return "Carrito eliminado";
    } catch (error) {
      console.error('Error al eliminar el carrito por ID:', error);
      return "Error al eliminar el carrito";
    }
  }

  async updateById(id, updatedCart) {
    try {
      const data = await this.getAll();
      const index = data.findIndex((c) => c.id === id);
      if (index !== -1) {
        data[index] = { ...updatedCart, id };
        await fs.writeFile(this.nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
        return true;
      } else {
        return false; // El carrito con el ID dado no existe
      }
    } catch (error) {
      console.error('Error al actualizar el carrito por ID:', error);
      return false;
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.nombreArchivo, '[]', 'utf-8');
    } catch (error) {
      console.error('Error al eliminar todos los carritos:', error);
    }
  }
}