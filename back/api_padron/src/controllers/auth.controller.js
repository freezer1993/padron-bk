const { logger } = require('../config/loggin')
const { connect } = require('../config/conexion')
const { API_KEY, setSessionsFile, getSessionsFile } = require('../config/config')
var jwt = require("jsonwebtoken")
const NAMESPACE = 'auth.controller'

let conn, sql;

exports.validarUser = async (req, res) => {
    var user = req.body.usuario;
    var pass = req.body.password;

    if (!user) {
        return res.status(403).send({ outError: "User Not found." });
    }
    if (!pass) {
        return res.status(403).send({ outError: "Password Not found." });
    }
    conn = await connect();
    if (conn != null) {
        //verificamos el usuario y la contraseña
        sql = `SELECT u."Nombre",
                      u."Apellido",
                      u."CedIdentidad",
                      u."CodLocal",
                      u."CodMesa",
                      u."CodUsuario"
                 FROM public."Usuarios" u
                WHERE upper(u."NombreUsuario") = upper('${user}') 
                  AND upper(u."Pass") = upper('${pass}')`;
        conn
            .query(sql)
            .then((result) => {
                console.log();
                if (result.rowCount > 0) {
                    var token = jwt.sign({ id: user }, API_KEY, {
                        algorithm: "HS256",
                        expiresIn: 86400 // 24 hours
                    });
                    const savedSessions = getSessionsFile(); //traemos las sesiones guardadas
                    savedSessions.push({
                        user: user,
                        token: token
                    });
                    setSessionsFile(savedSessions);
                    res.status(200).send({ outResponse: 'OK', token: token, usuario: user, data: result.rows });
                }else{
                    res.status(403).send({outError: 'Error en usuario o contraseña'});
                }
            })
            .catch((error) => {
                logger.error(`${NAMESPACE}: ${error}`);
                res.status(403).send({ outError: error });
            })
            .finally(() => {
                if (conn != null)
                    conn.end()
            })
    } else {
        res.status(403).send({ outError: 'Ocurrio error al intentar conectarse' });
    }
}

exports.validaToken = async (req, res) => {
    res.status(200).send({ outResponse: 'OK' });
}

exports.logout = async (req, res) => {
    splitSessions(req.token);
    res.status(200).send();
}

function splitSessions(token) {
    const savedSessions = getSessionsFile();
    for (var i = 0; i <= savedSessions.length; i++) {
        const sessionIndex = savedSessions.findIndex(sess => sess.token == token);
        if (sessionIndex != -1) {
            savedSessions.splice(sessionIndex, 1);
        }
    }
    setSessionsFile(savedSessions);
}