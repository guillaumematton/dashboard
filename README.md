# Dashboard

EPITECH project planned to be a usable dashboard tailored to our need.  

## Installation

This project requires docker and docker-compose to be installed:

On ubuntu:
```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

For other distros, check the official docker site:
https://docs.docker.com/compose/install/linux/

## Launching project

After completing both .env and frontend/.env.local, just run the following command:

```bash
docker-compose up
```

## Technical stack

- expressjs
- reactjs
- mysql
- JWT

[dashboard-stacks](frontend/public/dashboard-stacks.png "Dashboard Stacks")


## Widgets

- weather
- clock
- youtube
- github
- google maps

## Github environment variables

The oauth needs a client id and a client secret:

- Go to [github](https://github.com) and login if not
- click on your profile picture
- click on "Settings"
- click on "Developer settings"
- click on "OAuth app"
- click on "New OAuth app"
- give it a name
- set the homepage as "http://localhost:3000"
- set the callback URL as "http://localhost:8080/auth/github/callback"
- click on "Add a new OAuth app"
- copy your client id and client secret into the .env.local file

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

### Google Maps API

Get the map:
https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${API_KEY}

encodeURIComponent is the place that will be shown by default
API_KEY is the API key you get from the Google Maps Platform. 