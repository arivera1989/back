import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from "socket.io"
import { router as vistasRouter} from './routes/viewRouter.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import docRoutes from './routes/docRoutes.js';
import { getProductsPlain, deleteProduct, createProduct } from './controllers/productController.js';
import mongoose from 'mongoose';


const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.static("./src/public"))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/docs', docRoutes);
app.use("/", vistasRouter);
app.use((req, res, next) => {
    res.status(404).json({ 
        error: "Ruta no encontrada", 
        requestedUrl: req.originalUrl, 
        method: req.method,
        docs: "/api/docs"
    });
});



const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${PORT}`);
});


const io = new Server(server);

io.on("connection", async (socket) => {
    console.log(`Cliente websocket conectado con id ${socket.id}`);
    try {
        const req = { query: { limit: null } };
        const products = await getProductsPlain(req);
        socket.emit("listaProductos", products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
    
    socket.on("eliminarProducto", async (idProducto) => {
        try {
            const req = { params: { pid: idProducto } };
            const res = {
                status: (code) => ({
                    json: (data) => ({ code, data }),
                }),
            };
            const result = await deleteProduct(req, res);
    
            if (result.code === 404) {
                socket.emit("productoNoEncontrado", { id: idProducto, error: result.data.error });
            } else {
                socket.emit("productoEliminado", { id: idProducto, success: result.data.success });
                const updatedReq = { query: { limit: null } };
                const updatedProducts = await getProductsPlain(updatedReq);
                socket.emit("listaProductos", updatedProducts);
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("errorEliminacion", { id: idProducto, error: "Error en el servidor al eliminar el producto" });
        }
    });

    socket.on("guardarProducto", async (data) => {
        try {
            const req = {body: data};
            const res = {status: (statusCode) => ({
                            json: (responseData) => {
                            socket.emit("productoGuardado", { success: true, product: responseData });
                    }
                })
            };
            await createProduct(req, res);
            const updatedReq = { query: { limit: null } };
            const updatedProducts = await getProductsPlain(updatedReq);
            socket.emit("listaProductos", updatedProducts);
        } catch (error) {
            socket.emit("productoGuardado", { success: false, error: error.message });
        }
    });
});

const conectarMD=async()=>{
    try {
        await mongoose.connect(
            "mongodb+srv://backendcoder:mQNE9C3X0rAlgYQV@cluster0.3lruu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            {
                dbName: "entregafinal"
            }
        )
        console.log("Conectado a MongoDB Atlas");
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}

conectarMD();