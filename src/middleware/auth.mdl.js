const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const makeMongoDbServiceUser = require("../services/mongoDbService")({
  model: User,
});

exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  const isRegReq = String(req.originalUrl).endsWith("app/user") && req.method == "POST";
  if (!token) {
    return res.set({ "Content-Type": "application/json" }).status(401).send({
      status: 'UNAUTHORIZED',
      message: 'You are not authorized to access the request',
      data: {},
    })
  }
  jwt.verify(token, process.env.SECRET_STRING, async (err, decodedToken) => {
    if (err) {
      return res.set({ "Content-Type": "application/json" }).status(401).send({
        status: 'UNAUTHORIZED',
        message: 'You are not authorized to access the request',
        data: {},
      })
    }
    const email = decodedToken.email;
    const user = await makeMongoDbServiceUser.getSingleDocumentByQuery({ email: email });
    if (user && !isRegReq) {
      req.user = user;
      next();
    } else if (isRegReq && !user) {
      req.user = email;
      next();
    } else if (!isRegReq && !user) {
      return res.set({ "Content-Type": "application/json" }).status(401).send({
        status: 'BAD_REQUEST',
        message: 'You are not registered user.',
        data: {},
      })
    } else {
      return res.set({ "Content-Type": "application/json" }).status(401).send({
        status: 'BAD_REQUEST',
        message: 'you are already registered.',
        data: {},
      })
    }
  });
};
