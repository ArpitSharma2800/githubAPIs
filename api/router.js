const {
    serverCheck,
    repository,
    repoGraphQL,
    repoGraphQLSingle
} = require("./controller");

const router = require("express").Router();

router.get("/check", serverCheck);
router.get("/repo", repository);
router.post("/repoGraph", repoGraphQL);
router.get("/repoGraphSingle/:query", repoGraphQLSingle);



module.exports = router;