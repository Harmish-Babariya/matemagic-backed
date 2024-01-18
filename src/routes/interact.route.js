const express = require("express");
const { interactController } = require("../controller/v1/interact/index")

const router = express();

router.post("/:action/:id", interactController);

module.exports = router;