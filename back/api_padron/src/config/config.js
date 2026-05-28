const dotenv = require('dotenv').config()
const { logger } = require('./loggin')
const fs = require('fs')
const NAMESPACE = 'config'

var PUERTO;
let sessionFile;

const ENVIROMENT = process.env.NODE_ENV;
const BD = process.env.BD;
const PORTBD = process.env.PORT_BD;
const PASSDB = process.env.PASS_DB;
const HOST = process.env.HOST_BD;
const API_KEY = process.env.KEY;
const IV = process.env.IV;

logger.info(`${NAMESPACE} - Conectado en ambiente de ${ENVIROMENT}.`)

if (ENVIROMENT == 'production') {
    PUERTO = process.env.PORTPROD;
} else {
    PUERTO = process.env.PORTQAS;
}

//generar archivo de manejo de tokens y usuarios
const createSessionsFileIfNotExists = function (file) {
    sessionFile = file;
    if (!fs.existsSync(sessionFile)) {
        try {
            fs.writeFileSync(sessionFile, JSON.stringify([]));
            logger.info(`${NAMESPACE} - CREATE-SESSION-FILE: Sessions file created successfully.`)
        } catch (err) {
            logger.error(`${NAMESPACE} - CREATE-SESSION-FILE: Failed to create sessions file: ${err}`)
        }
    } else {
        if (ENVIROMENT == 'production') {
            fs.writeFileSync(sessionFile, JSON.stringify([]));
        }
    }
}

const setSessionsFile = function (sessions) {
    fs.writeFile(sessionFile, JSON.stringify(sessions), function (err) {
        if (err) {
            logger.error(`${NAMESPACE} - SET-SESSION-FILE: Failed to create sessions file: ${err}`)
        }
    });
}

const getSessionsFile = function () {
    return JSON.parse(fs.readFileSync(sessionFile));
}

module.exports = {
    PUERTO,
    ENVIROMENT,
    API_KEY,
    IV,
    BD,
    PORTBD,
    PASSDB,
    HOST,
    createSessionsFileIfNotExists,
    setSessionsFile,
    getSessionsFile
};