# Dashboard

EPITECH project planned to be a usable dashboard tailored to our need.  

## Technical stack

- expressjs
- reactjs
- mysql
- JWT

Why? Ease of use.

## Widgets

- weather
- my

## Frontend .env.local
The frontend needs a .env.local to work formated as the .env.local.exemple in which you need to put in your youtube api key.  
To get your youtube api key, you need to:  
- go to [Google Cloud Console](https://console.cloud.google.com/)
- create a new project
- enable the YouTube Data API
- create API KEY
- copy it in your .env.local file

## Github commits

This dashboard has a widget for github commits requiering the use of a fine-grained PAT.
To generate the PAT:
- go to [github](https://github.com)
- click on your profile picture
- click on "Settings"
- click on "Developer settings"
- click on "Personal access tokens" then "Fine-grained token"
- click on "Generate new token"
- give it a name
- select the scope `repo:content read`
- click on "Generate token"
- copy your token into the box asking for it
