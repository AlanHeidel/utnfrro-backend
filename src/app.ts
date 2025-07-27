import express from 'express';
import { Plato } from './plato.js';
import { TipoPlato } from './plato.js';

const app = express();

app.use(express.json());

const tiposPlatos = [
    new TipoPlato ('1', 'Entrada'),
    new TipoPlato ('2', 'Plato Principal'),
    new TipoPlato ('3', 'Postre'),
    new TipoPlato ('4', 'Bebida'),
]
const platos = [
    new Plato ('1', 'Milanesa a la napolitana', 1500, ['milanesa', 'queso'], tiposPlatos[2],'https://example.com/milanesa.jpg'),
    new Plato ('2', 'Ensalada Caesar', 1200, ['lechuga', 'pollo'], tiposPlatos[1],'https://example.com/ensalada.jpg'),
];


app.get('/api/platos', (req, res) => {
    res.json( {data: platos} );
    }
);

app.get('/api/platos/:id', (req, res) => {
    const plato = platos.find((p) => p.id === req.params.id);
    if (!plato) {
        res.status(404).send('Plato not found');
    }
    res.json( {data: plato} );
    }
);

app.post('/api/platos', (req, res) => {
    const { id, nombre, precio, ingredientes, tipoPlato, imagen } = req.body;
    const nuevoPlato = new Plato(id, nombre, precio, ingredientes, tipoPlato, imagen);
    platos.push(nuevoPlato);
    res.status(201).send( {message: 'Plato creado exitosamente', data: nuevoPlato});
})


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000/');
});