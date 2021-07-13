const {
    serverCheck,
    repository
} = require("./controller");

const router = require("express").Router();

router.get("/check", serverCheck);
router.get("/repo", repository);

module.exports = router;