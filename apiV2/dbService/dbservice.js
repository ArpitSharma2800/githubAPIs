const pool = require("../../config/db");

module.exports = {
  completedQuery: (data, callBack) => {
    pool.query(
      `INSERT INTO extracteDate (query,cursorValue,hasNextPage,limitremaining,nodeCount, date) VALUES (?,?,?,?,?,?)`,
      [
        data.query,
        data.cursor,
        data.hasLastPage,
        data.limitremaining,
        data.nodeCount,
        data.date,
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          // process.exit(1)
          return callBack(error);
        }
        return callBack(null, results);
        // console.log(data.cursor + "success");
        // process.exit(1)
      }
    );
  },
};
