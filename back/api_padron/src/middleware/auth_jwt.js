const { logger } = require('../config/loggin')
const { verify } = require('jsonwebtoken')
const { API_KEY, getSessionsFile, setSessionsFile } = require('../config/config')
const NAMESPACE = 'aut_jwt.middleware'

verifyToken = (req, res, next) => {
    const bearerToken = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];

    if (!bearerToken) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    const token = bearerToken.replace('Bearer ', '');
    verify(token, API_KEY, (err, decoded) => {
        if (err) {
            //si salta error en el token lo eliminamos de las sesiones
            const savedSessions = getSessionsFile();
            for (var i = 0; i <= savedSessions.length; i++) {
                const sessionIndex = savedSessions.findIndex(sess => sess.token == token);
                if (sessionIndex != -1) {
                    savedSessions.splice(sessionIndex, 1);
                }
            }
            setSessionsFile(savedSessions);
            //respondemos con 401 Unauthorized
            logger.error(`${NAMESPACE}:  ${err}`);
            return res.status(401).send({
                message: `Unauthorized! ${err}`
            });
        }
        req.token = token
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken
};
module.exports = authJwt;