import express from 'express';
import __dirname from './utils/utils.js'
import handlebars from 'express-handlebars';
import cors from 'cors';
import path from 'path';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import { productsUpdated, chat } from './utils/socketUtils.js';
import displayRoutes from 'express-routemap';
import mongoose from 'mongoose';

const PORT = 8080;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());

const MONGO = "mongodb+srv://LucasBazzini:Lucas30ago03..@cluster.ccdvok9.mongodb.net/?retryWrites=true&w=majority"
const connection = mongoose.connect(MONGO)

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/files', express.static(path.join(__dirname, './public')));

app.use('/api/alive', (req, res) => {
    res.status(200).json({ status: 1, message: 'Servidor conectado' });
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);

const serverHttp = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Escuchando en el puerto :  ${PORT}`)
});

const io = new Server(serverHttp);

app.set('io', io);

io.on('connection', socket => {
    console.log('Cliente conectado con el id : ', socket.id);
    productsUpdated(io);
    chat(socket, io);
});