const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Contacts API',
        description: 'CSE 341: Week 03 Project2 CRUD Operations'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//Generate Swagger.json before the server starts
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server');
});