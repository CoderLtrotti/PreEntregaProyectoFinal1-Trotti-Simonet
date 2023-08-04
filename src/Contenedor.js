import fs from 'fs/promises';

export default class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
    this.nextProductId = 1;
    this.initialize();
  }

  async initialize() {
    try {
      const fileContent = await fs.readFile(this.nombreArchivo, 'utf-8');
      if (fileContent.trim() === '') {
        // Si el archivo está vacío, lo inicializamos con un arreglo vacío
        await fs.writeFile(this.nombreArchivo, '[]', 'utf-8');
      }
    } catch (error) {
      // Si el archivo no existe, lo creamos con un arreglo vacío
      await fs.writeFile(this.nombreArchivo, '[]', 'utf-8');
    }
  }


  async save(object) {
    try {
      const data = await this.getAll();
      const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
      const newObj = { ...object, id: newId };
      data.push(newObj);
      await fs.writeFile(this.nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
      return newId;
    } catch (error) {
      console.error('Error al guardar el objeto:', error);
      return -1;
    }
  }

  async getById(id) {
    try {
      const data = await this.getAll();
      const object = data.find((obj) => obj.id === id);
      return object || null;
    } catch (error) {
      console.error('Error al obtener el objeto por ID:', error);
      return null;
    }
  }

  async getAll() {
    try {
      const fileContent = await fs.readFile(this.nombreArchivo, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error al obtener todos los objetos:', error);
      return [];
    }
  }

  async deleteById(id) {
    try {
      const data = await this.getAll();
      const newData = data.filter((obj) => obj.id !== id);
      await fs.writeFile(this.nombreArchivo, JSON.stringify(newData, null, 2), 'utf-8');
      return "Producto eliminado";
    } catch (error) {
      console.error('Error al eliminar el objeto por ID:', error);
      return "Error al eliminar el producto";
    }
  }

  async updateById(id, updatedObject) {
    try {
      const data = await this.getAll();
      const index = data.findIndex((obj) => obj.id === id);
      if (index !== -1) {
        data[index] = { ...updatedObject, id };
        await fs.writeFile(this.nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
        return true;
      } else {
        return false; // El objeto con el ID dado no existe
      }
    } catch (error) {
      console.error('Error al actualizar el objeto por ID:', error);
      return false;
    }
  }
  async deleteAll() {
    try {
      await fs.writeFile(this.nombreArchivo, '[]', 'utf-8');
    } catch (error) {
      console.error('Error al eliminar todos los objetos:', error);
    }
  }
}

// Ejemplo de uso
async function test() {
  try {
    const contenedor = new Contenedor('productos.json');

    async function testUpdate() {
      try {
        // Guardar un nuevo objeto en el contenedor
        const productId = await contenedor.save({
          title: 'Producto de prueba',
          price: 10,
          stock: 50,
        });

        // Obtener el objeto por su ID
        const product = await contenedor.getById(productId);

        console.log('Objeto original:');
        console.log(product);

        // Actualizar el objeto
        const updatedProduct = { ...product, price: 15, stock: 40 };
        const result = await contenedor.updateById(productId, updatedProduct);

        if (result) {
          console.log('Objeto actualizado correctamente.');
        } else {
          console.log('No se pudo actualizar el objeto. El ID no existe.');
        }

        // Obtener el objeto actualizado
        const updatedProduct2 = await contenedor.getById(productId);

        console.log('Objeto actualizado:');
        console.log(updatedProduct2);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    await testUpdate();


    const productId1 = await contenedor.save({ 
      title: 'Camiseta', 
      description: 'Una camiseta de algodón cómoda y ligera',
      code: 'CAM001',
      price: 20,
      status: true,
      stock: 100,
      category: 'Ropa',
      thumbnails: ['ruta_imagen1.jpg', 'ruta_imagen1_small.jpg'],
    });

    const productId2 = await contenedor.save({ 
      title: 'Pantalón', 
      description: 'Un pantalón de mezclilla para uso diario',
      code: 'PAN001',
      price: 40,
      status: true,
      stock: 50,
      category: 'Ropa',
      thumbnails: ['ruta_imagen2.jpg', 'ruta_imagen2_small.jpg'],
    });

    const productId3 = await contenedor.save({ 
      title: 'Zapatos', 
      description: 'Zapatos deportivos para correr y hacer ejercicio',
      code: 'ZAP001',
      price: 50,
      status: true,
      stock: 30,
      category: 'Calzado',
      thumbnails: ['ruta_imagen3.jpg', 'ruta_imagen3_small.jpg'],
    });

    console.log(await contenedor.getAll());

    // Eliminar un objeto por su ID
    const deleteResult = await contenedor.deleteById(productId1);
    console.log(deleteResult); // Imprimirá "Producto eliminado" o "Error al eliminar el producto"
    console.log("Producto Eliminado");

    console.log("Lista de objetos después de eliminar:");
    console.log(await contenedor.getAll());
  } catch (error) {
    console.error('Error:', error);
  }
}

test();