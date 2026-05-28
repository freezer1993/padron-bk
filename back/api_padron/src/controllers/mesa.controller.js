const { connect } = require('../config/conexion')
const { logger } = require('../config/loggin')
const NAMESPACE = 'mesa.controller'
let sql, conn;

exports.insertaMesa = async (req, res) => {
    try {
        conn = await connect();
        await conn.query('BEGIN')
        const params = [
            req.body.local,
            req.body.mesa,
            req.body.orden,
            req.body.user
        ]
        sql = `INSERT INTO public."CargaMesas"(
                                            "Local", 
                                            "Mesa", 
                                            "Orden", 
                                            "User")
                    VALUES ($1, $2, $3, $4)`;
        const respuesta = await conn.query(sql, params)
        const sql2 = `SELECT c."Local",
                             c."Mesa",
                             c."Orden",
                             c."User"
                         FROM public."CargaMesas" c
                         WHERE c."User" = ${req.body.user}`;
        const respuesta2 = await conn.query(sql2)
        await conn.query('COMMIT')
        res.status(200).send({ outResponse: 'OK', data: respuesta2.rows });
    } catch (error) {
        await conn.query('ROLLBACK')
        logger.error(`${NAMESPACE}: ${error}`);
        res.status(403).send({ outError: error });
    } finally {
        if (conn != null)
            conn.end()
    }
}