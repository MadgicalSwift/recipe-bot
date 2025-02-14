#  Food Magic Bot

 Welcome to Food Magic Bot, your ultimate AI cooking companion! Whether you have a few ingredients at home or a specific dish in mind, this bot helps you discover the perfect recipe in seconds
 1. Ingredient-Based Recipes: Enter the ingredients you have, and the bot will suggest delicious recipes you can make with them.
 2. Dish-Specific Recipe Search: Looking for a specific dish? Get the best recipes and cooking tips instantly.
 3. YouTube Video Integration: The bot fetches relevant YouTube video links, so you can follow step-by-step instructions visually.

# Prerequisites
Before you begin, ensure you have met the following requirements:

* Node.js and npm installed
* Nest.js CLI installed (npm install -g @nestjs/cli)
* DynomoDB database accessible

## Getting Started
### Installation
* Fork the repository
Click the "Fork" button in the upper right corner of the repository page. This will create a copy of the repository under your GitHub account.


* Clone this repository:
```
https://github.com/madgicaltechdom/chatbot-nestjs-boilerplate.git
```
* Navigate to the Project Directory:
```
cd recipe-bot
```
* Install Project Dependencies:
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Add the following environment variables:

```bash

youtube_apiKey=youtube_apikey
youtube_url=youtube_url
API_URL = api_url
BOT_ID = bot_id
API_KEY = api_key
USERS_TABLE=user_table
REGION= region
ACCESS_KEY_ID = access_key_id
SECRET_ACCESS_KEY = secret_access_key
BOT_NAME = bot_name
SUGGEST_RECIPE_URL = suggest_recipe_url
SPECIFIC_RECIPE_URL = specific_recipe_url
FOLLOW_UP_URL= follow_up_url
RECIPE_COVERSATION_URL = recipe_conversation_url
```
# API Endpoints
```
POST api/message: Endpoint for handling user requests. 
Get/api/status: Endpoint for checking the status of  api
```
# folder structure

```bash
src/
├── app.controller.ts
├── app.module.ts
├── main.ts
├── chat/
│   ├── chat.service.ts
│   └── chatbot.model.ts
├── common/
│   ├── exceptions/
│   │   ├── custom.exception.ts
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   ├── log.helper.ts
│   │   └── log.middleware.ts
│   └── utils/
│       └── date.service.ts
├── config/
│   └── database.config.ts
├── i18n/
│   ├── en/
│   │   └── localised-strings.ts
│   └── hi/
│       └── localised-strings.ts
├── localization/
│   ├── localization.service.ts
│   └── localization.module.ts
│
├── message/
│   ├── message.service.ts
│   └── message.service.ts
└── model/
│   ├── user.entity.ts
│   ├──user.module.ts
│   └──query.ts
└── swiftchat/
    ├── swiftchat.module.ts
    └── swiftchat.service.ts

```

# Link
* [Documentation](https://app.clickup.com/43312857/v/dc/199tpt-7824/199tpt-19527)

