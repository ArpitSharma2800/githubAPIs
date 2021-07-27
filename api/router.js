const {
    serverCheck,
    repository,
    repoGraphQL,
    repoGraphQLSingle,
    soDict,
    topicsDict
} = require("./controller");

const router = require("express").Router();

router.get("/check", serverCheck);
router.get("/repo", repository);
router.post("/repoGraph", repoGraphQL);
router.get("/repoGraphSingle/:query", repoGraphQLSingle);
router.get("/sodictionary", soDict);
router.post("/topicDict", topicsDict)



module.exports = router;