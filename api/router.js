const {
    serverCheck,
    repository,
    repoGraphQL
} = require("./controller");

const router = require("express").Router();

router.get("/check", serverCheck);
router.get("/repo", repository);
router.get("/repoGraph/:query", repoGraphQL);



module.exports = router;