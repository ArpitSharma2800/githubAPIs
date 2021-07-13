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
    repository: async (req, res) => {
        const {
            keyword,
            created,
            stars,
            language,
            forks,
            license
        } = req.query;
        // console.log(req.query)
        if (keyword == null) {
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
        urlString = ''
        array = [keyword, created, language, stars, forks, license]
        await array.forEach((key, i) => {
            if (key != null) {
                if (key == keyword) {
                    urlString = `?q=${keyword}&type=Repositories&ref=advsearch&l=`
                } else if (key == created) {
                    urlString = `?q=${keyword}+created:${created}&type=Repositories&ref=advsearch&l=`
                } else if (key == language) {
                    urlString = `?q=${keyword}+created:${created}+language:${language}&type=Repositories&ref=advsearch&l=`
                } else if (key == stars) {
                    urlString = `?q=${keyword}+created:${created}+stars:${stars}+language:${language}&type=Repositories&ref=advsearch&l=`
                } else if (key == forks) {
                    urlString = `?q=${keyword}+created:${created}+stars:${stars}+forks:${forks}+language:${language}&type=Repositories&ref=advsearch&l=`
                } else if (key == license) {
                    urlString = `?q=${keyword}+created:${created}+stars:${stars}+forks:${forks}+language:${language}+license:${license}&type=Repositories&ref=advsearch&l=`
                }
            }
        })
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
    }
}