import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from "morgan";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const app = express();
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));
const PORT = process.env.PORT || 5010;
dotenv.config();
connectDB();

app.use(express.json());
initCors();

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
})

const __dirname = path.resolve(); //as we using es module so this line needed(not need at commonjs)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


app.get('/', (req, res) => {
  res.send('API is running......');
});


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`));


function initCors () {
  if(process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
      res.header("Access-Control-Allow-Headers","*");
      res.header("Access-Control-Allow-Methods","*");
      next();
    });
  } else {
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Headers","*");
      // res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      res.header("Access-Control-Allow-Methods","*");
      next();
    });
  }
}
