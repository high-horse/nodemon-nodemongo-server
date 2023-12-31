const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./app');

const server = http.createServer(app);

// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.write("<h1>Hello world</h1>");
//     res.end();
// });

server.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(404);
    res.json({
        error: {
            message : err.message,
        }
    });
})