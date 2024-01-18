const multer = require("multer");
// const path = require("path");
const responseCode = require("../utils/responseCode");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/files/"),
  filename: (req, file, cb) => {
    
    // const uniqueName = `${Date.now()}-${Math.round(
    //   Math.random() * 1e9
    //   )}${path.extname(file.originalname)}`;
    const uniqueName = file.originalname;
      
      cb(null, uniqueName);
      if (!req.body.selfie) req.body.selfie = [];

      if (file.fieldname === "selfie") {
        req.body.selfie.push(uniqueName);
      }
      
      if (!req.body.pics) req.body.pics = [];
      
      if (file.fieldname === "pics") {
        req.body["pics"].push(uniqueName);
      }
      
      req.body = JSON.parse(JSON.stringify(req.body))
  },
});


const multerInstance = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
}).fields([
  { name: "pics", maxCount: 4 },
  { name: "selfie", maxCount: 2 },
]);

exports.handleImageFile = (req, res, next) => {
  multerInstance(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .set({ "Content-Type": "application/json" })
          .send({
            status: "LIMIT_UNEXPECTED_FILE",
            message: error,
            data: {},
          })
          .status(responseCode.conflict);
      } else if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .set({ "Content-Type": "application/json" })
          .send({
            status: "VALIDATION_ERROR",
            message: error,
            data: {},
          })
          .status(responseCode.conflict);
      }
      return res
        .set({ "Content-Type": "application/json" })
        .status(responseCode.internalServerError)
        .json({
          status: "MULTER_ERROR",
          message: error,
          data: {},
        });
    } else if (error) {
      return res
        .set({ "Content-Type": "application/json" })
        .status(responseCode.internalServerError)
        .json({
          status: "MULTER_ERROR",
          message: error,
          data: {},
        });
    }
    next();
  });
};
