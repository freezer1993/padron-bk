const { logger } = require('./loggin')
const dotenv = require('dotenv').config()
const { decrypt } = require('./crypto')
const { Client } = require('pg')
const { BD, PORTBD, HOST, PASSDB } = require('./config')
const NAMESPACE = 'conexion'

exports.connect = async function () {
    var decrypted = decrypt(PASSDB);
    let conn;
    const client = new Client({
        user: 'postgres',
        host: HOST,
        database: BD,
        password: decrypted,
        port: PORTBD,
    })
    try {
        await client.connect();
        logger.info(`${NAMESPACE} - Conexión establecida`)
        return client;
    } catch (err) {
        logger.error(`${NAMESPACE} - Error al conectar: ${err}`)
        return null
    }
} 