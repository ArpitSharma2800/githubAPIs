var axios = require('axios');

module.exports = {
    repoSearch: (data, callback) => {
        // urlString = `?q=${data.keyword}&type=Repositories&ref=advsearch&l=`;
        urlString = data.urlString;
        var config = {
            method: 'get',
            url: `https://api.github.com/search/repositories${urlString}&type=Repositories&ref=advsearch&l=`,
        };
        axios(config)
            .then(function (response) {
                return callback(null, response.data);
            })
            .catch(function (error) {
                return callback(error);
            });
    }
}