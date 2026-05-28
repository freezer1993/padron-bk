const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { logger } = require('./config/loggin')
const config = require('./config/config')
const path = require('path')
const dirPath = path.join(__dirname, '/tokens-sessions.json')
const router = require('./routes/routes')


const PORT = config.PUERTO || 3000;
const NAMESPACE = 'server';

//express
const app = express()
app.use(require("morgan")("dev", { "stream": logger.stream }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));
app.use('/padron', router);

//creamos el archivo
config.createSessionsFileIfNotExists(dirPath);

//server run
app.listen(PORT, () => {
    logger.info(`${NAMESPACE} - App listening on port ${PORT}`)
})