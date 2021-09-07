# Github Extraction tool V3.0

## About Github GraphQL API

### https://docs.github.com/en/graphql

### https://docs.github.com/en/graphql/overview/about-the-graphql-api

## Scripts

- extract github data : npm run extractV3
- extract list of languages from extracted github data : npm run langV3
- extract list of topics from extracted github data : npm run topicsV3
- jsonArrayCount : npm run jsonCountV3
- jsonToCSV : npm run jsonToCsvV3
- mergeDictionariers : npm run mergeDictV3

## Flow for extracting and generating tags from extracted data

**Before starting make sure to run npm install**

1. Go to https://docs.github.com/en/graphql/overview/explorer and generate GraphQL query for which data has to be extracted (There is advanced version of github GraphQL already present inside GraphQlQuery.js)
2. Generate as many Github token you can, these token are necessary for extracting data through GitHib GraphQL APIs (https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)
3. Paste Github token inside extractionApi function in https://github.com/ArpitSharma2800/githubAPIs/blob/master/apiV3/service/service.js
4. Inside extraction function in https://github.com/ArpitSharma2800/githubAPIs/blob/master/apiV3/appV3.js replace keyword, number of stars, extraction start and end date, (This function will take time to extract data and it will save extracted file inside https://github.com/ArpitSharma2800/githubAPIs/tree/master/apiV3/SavedFiles)
5. Open extracted file, **CTRL + H** and replace "**][**" with "**,**" this is because extraction concat/append to the existing file.

### apiV3/SavedFiles

All the data is been extracted and saved in either JSON or TXT format is saved inside this folder

### apiV3/CSVResults

This folder contains the CSV files that are converted from JSON saved files

### apiV3/dictionary

This folder contains all the extracted dictionary and merged dictionary files
