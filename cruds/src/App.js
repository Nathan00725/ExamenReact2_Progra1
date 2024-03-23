import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './fondo.css';

function App() {
  const [categoria, setCategoria] = useState([]);
  const [nueva_Categoria, setNueva_Categoria] = useState({ name: "", image: "" });
  const [editar_categoria, setEditar_Categoria] = useState(null);
  const [exitomensaje, setexitoMensaje] = useState("");
  const [errormensaje, seterrorMensaje] = useState("");

  useEffect(() => {
    axios.get('https://api.escuelajs.co/api/v1/categories')
      .then(response => {
        setCategoria(response.data instanceof Array ? response.data : []);
      })
      .catch(error => {
        seterrorMensaje('Error al hacer su busqueda o en borrar');
      });
  }, []);

  
  const clearAlerts = () => {
    setexitoMensaje('');
    seterrorMensaje('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    clearAlerts();
    if (editar_categoria) {
    setEditar_Categoria({ ...editar_categoria, [name]: value });
    } else {
      setNueva_Categoria({ ...nueva_Categoria, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearAlerts();
    if (editar_categoria) {
      axios.put(`https://api.escuelajs.co/api/v1/categories/${editar_categoria.id}`, editar_categoria)
        .then(response => {
          setCategoria(categoria.map(category => (category.id === editar_categoria.id ? response.data : category)));
          setEditar_Categoria(null);
          setexitoMensaje('Se actualizo con exito la categoria ');
        })
        .catch(error => {
          seterrorMensaje('Error al actualizar la categoria ');
        });
    } else {
      axios.post('https://api.escuelajs.co/api/v1/categories/', nueva_Categoria)
        .then(response => {
          setCategoria([...categoria, response.data]);
          setNueva_Categoria({ name: "", image: "" });
          setexitoMensaje('Se ingreso con exito');
        })
        .catch(error => {
          seterrorMensaje('Error al ingresar la cateogira');
        });
    }
    
  };

  const handleElimiar = (id) => {
    clearAlerts();

    axios.delete(`https://api.escuelajs.co/api/v1/categories/${id}`)
      .then(() => {
        setCategoria(categoria.filter(category => category.id !== id));
        setexitoMensaje('La categoria se pudo borrar con exito');
      })
      .catch(error => {
        seterrorMensaje('No se pudo borrar la categoria');
      });
  };

  const handleEditar = (category) => {
    clearAlerts();
    setEditar_Categoria(category);
    setNueva_Categoria({ name: category.name, image: category.image });
  };


  return (
    <div className="container">
      <h1 style={{ color: 'red' }}>Categorías</h1>
      {exitomensaje && <div className="alert alert-success">{exitomensaje}</div>}
      {errormensaje && <div className="alert alert-danger">{errormensaje}</div>}
      <div className="card mb-3 p-3 bg-light" style={{ maxWidth: '540px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" className="form-control" id="name" name="name" value={nueva_Categoria.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL:</label>
            <input type="text" className="form-control" id="image" name="image" value={nueva_Categoria.image} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="btn btn-custom">Agregar Categorias</button>
        </form>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {categoria.map(category => (
          <div className="col" key={category.id}>
            <div className="card h-100">
              <img src={category.image} className="card-img-top" alt={category.name} style={{ objectFit: 'cover', height: '200px' }} />
              <div className="card-body">
                {editar_categoria && editar_categoria.id === category.id ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="editName">Nombre:</label>
                      <input type="text" className="form-control" id="editName" name="name" value={editar_categoria.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="editImage">Photo (URL):</label>
                      <input type="text" className="form-control" id="editImage" name="image" value={editar_categoria.image} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn btn-custom">Guardar</button>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">{category.name}</h5>
                    <button className="btn btn-custom me-2" onClick={() => handleEditar(category)}>Editar</button>
                    <button className="btn btn-custom-delete" onClick={() => handleElimiar(category.id)}>Elimiar</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;