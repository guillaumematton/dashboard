# Dashboard

EPITECH project planned to be a usable dashboard tailored to our need.  

## Technical stack

- expressjs
- reactjs
- mysql
- JWT

ExpressJs: Fast, REST API and lightweight
ReactJs: Responsive
MySql: Simple and effective
JWT: Useful for the authentification page


## Widgets

- weather
- clock
- youtube
- github
- google maps (planned)

## Frontend .env.local
The frontend needs a .env.local to work formated as the .env.local.exemple in which you need to put in your youtube api key.  
To get your youtube api key, you need to:  
- go to [Google Cloud Console](https://console.cloud.google.com/)
- create a new project
- Go to "API et services"
- Search "Youtube Data API v3"
- Activate it
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
- copy your token into the .env.local file

## Google maps APIs

- Go to [Google Maps Platform](https://developers.google.com/maps/documentation/javascript/demo-key)
- click on "Get a Demo Key"
- copy api key into the .env.local file


## API used and explanation

### Time API

Get the current time of a specific timezone:  
https://timeapi.io/api/time/current/zone?timeZone=${timezone}  

The timezone is the region you live in followed by the major city nearby.  
Exemple: In France, you would enter Europe/Paris  

### Weather API

Get the current meteo:  
https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Paris  

The latitude and longitude are derived from the position the browser gives.  
As such, no input is required for the parameters.  

### Github API

Get the latest repos by recent push order:  
https://api.github.com/user/repos?per_page=100&page=${page}&sort=pushed  

The per page defines the number of repos you want to get.  
The page defines the page you want to get.  
The sort defines the order of the repos. In this case, we want the repos sorted by the push date.  

Get the latest commits:  
https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&per_page=${limit}`  

Repo owner is the user who owns the repo.  
Repo name is the user who made the commit.  
Limit is the number of commits you want to get.  

### Youtube API

Get the live:  
https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&maxResults=1&order=date&key=${apiKey}  

Channel id is the id of the channel you want to fetch from.  
Event type is to say wether to fetch a live or videos.  
Type is the format we want. Here we want the video so the type is video.  
Max results is the number of results we want to get.  
Order is the order of the results. Here we want the results sorted by date.  
Key is the API key you get from the Google Cloud Console.  


### Google Maps API

Get the map:
https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${API_KEY}

encodeURIComponent is the place that will be shown by default
API_KEY is the API key you get from the Google Maps Platform. 