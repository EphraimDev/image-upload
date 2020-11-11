import express from 'express';

import routes from './routes';

const app = express();

// app.use(express.static('images/full'));/
app.use(express.static(__dirname + '/images'));
app.get('/', (req, res) => {
    res.status(200).send('Hello world');
});
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

export default app;