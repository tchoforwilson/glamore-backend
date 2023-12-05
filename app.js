import express, { json, urlencoded } from 'express';
import swaggerDocs from './swagger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import config from './configurations/config.js';
import globalErrorHandler from './controllers/error.controller.js';
import AppError from './utilities/appError.js';
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js';
import storeRouter from './routes/store.routes.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import reviewRouter from './routes/review.routes.js';
import cartRouter from './routes/cart.routes.js';
import orderRouter from './routes/order.routes.js';
import deliveryRouter from './routes/delivery.routes.js';
import followRouter from './routes/follow.routes.js';
import favoriteRouter from './routes/favorite.routes.js';

// Start express app
const app = express();

// Define server
const server = http.createServer(app);
const io = new Server(server);

// 1) GLOBAL MIDDLEWARES
// Serving static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Cross origin
app.use(cors());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(limiter);
app.disable('x-powered-by'); // less hackers know about our stack

// ROUTES
app.use(`${config.prefix}/auth`, authRouter);
app.use(`${config.prefix}/users`, userRouter);
app.use(`${config.prefix}/categories`, categoryRouter);
app.use(`${config.prefix}/stores`, storeRouter);
app.use(`${config.prefix}/products`, productRouter);
app.use(`${config.prefix}/reviews`, reviewRouter);
app.use(`${config.prefix}/carts`, cartRouter);
app.use(`${config.prefix}/orders`, orderRouter);
app.use(`${config.prefix}/deliveries`, deliveryRouter);
app.use(`${config.prefix}/follows`, followRouter);
app.use(`${config.prefix}/favorites`, favoriteRouter);
// const io = app.get('io');
io.on('connection', (socket) => {
  console.log('Connection established');
});

// INVALID ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Server swaggger documentation
swaggerDocs(app, config.port);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default server;
