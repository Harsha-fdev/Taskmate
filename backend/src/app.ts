import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import route from './routes/userRoutes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',  
    credentials: true,               
  })
);

app.use(express.json({limit:'16kb'}));

app.use(cookieParser());

app.use('/api/v1/users' , route);

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});


export {app};
