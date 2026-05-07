import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: "http://localhost:3001",
    changeOrigin: true,
}));

app.use(createProxyMiddleware({
    pathFilter: '/api/products',
    target: "http://localhost:3002",
    changeOrigin: true,
}));

app.use(createProxyMiddleware({
    pathFilter: '/api/order',
    target: "http://localhost:3003",
    changeOrigin: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
