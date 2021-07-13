const {
    repoSearch
} = require("./service");

module.exports = {
    serverCheck: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Server running .."
        });
    },
    //all repository
    repository: async (req, res) => {
        const {
            keyword,
            created,
            stars,
            language,
            forks,
            license
        } = req.query;
        const request = req.query
        // console.log(req.query)
        if (keyword == null) {
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
        var urlString = `?q=${keyword}`
        await Object.keys(request).forEach((key, i) => {
            if (i == 0) {
                console.log(key);
            } else {
                urlString = urlString.concat(`+${key}:${request[key]}`)
            }
        });
        console.log(urlString);
        data = {
            urlString
        };
        repoSearch(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Error Message",
                });
            }
            return res.status(200).json({
                success: true,
                results
            });
        });
    },
    //all issues
    // issues: async (req, res) => {
    //     const {
    //         keyword,
    //         comments,
    //         state,
    //         label,
    //         updated,
    //     } = req.query;
    //     // console.log(req.query)
    //     if (keyword == null) {
    //         return res.status(500).json({
    //             success: 0,
    //             message: "Error Message",
    //         });
    //     }
    //     urlString = ''
    //     array = [keyword, created, language, stars, forks, license]
    //     await array.forEach((key, i) => {
    //         if (key != null) {
    //             if (key == keyword) {
    //                 urlString = `?q=${keyword}`
    //             } else if (key == created) {
    //                 urlString = `?q=${keyword}+created:${created}`
    //             } else if (key == language) {
    //                 urlString = `?q=${keyword}+created:${created}+language:${language}`
    //             } else if (key == stars) {
    //                 urlString = `?q=${keyword}+created:${created}+stars:${stars}+language:${language}`
    //             } else if (key == forks) {
    //                 urlString = `?q=${keyword}+created:${created}+stars:${stars}+forks:${forks}+language:${language}`
    //             } else if (key == license) {
    //                 urlString = `?q=${keyword}+created:${created}+stars:${stars}+forks:${forks}+language:${language}+license:${license}`
    //             }
    //         }
    //     })
    //     data = {
    //         urlString
    //     };
    //     repoSearch(data, (err, results) => {
    //         if (err) {
    //             console.log(err);
    //             return res.status(500).json({
    //                 success: 0,
    //                 message: "Error Message",
    //             });
    //         }
    //         return res.status(200).json({
    //             success: true,
    //             results
    //         });
    //     });
    // },

}