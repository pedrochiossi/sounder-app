[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![Stargazers][stars-shield]][stars-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<br />
<p align="center">
  <a href="https://sounder-app.herokuapp.com">
    <img src="client/public/images/android-chrome-192x192.png" alt="Logo" width="80" height="80">
  </a>
  <h2 align="center">sounder-app</h2>
  
  <p align="center">
   An awesome song-discovery and playlist-generator web application!
   <br />
    <a href="https://sounder-app.herokuapp.com">View Demo</a>
    ·
    <a href="https://github.com/pedrochiossi/sounder-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/pedrochiossi/sounder-app/issues">Request Feature</a>
  </p>
</p>

## About The Project
<br />

[![Product Name Screen Shot][product-screenshot]](https://sounder-app.herokuapp.com)

**Sounder-app** is a full-stack web application that uses the Spotify-Web-API to provide song recomendations based on the user's liked songs library. 

With an intuitive flow and a tinder-like interface, the user can hear new track recomendations and personalize it by liking or disliking it. Additionally, the user is able to add all their liked songs to a new playlist and listen in their Spotify account.

### Built with

* [Express](https://expressjs.com)
* [Spotify-Web-Api](https://developer.spotify.com/documentation/web-api/)
* [Passport](http://www.passportjs.org)
* [Mongodb](https://www.mongodb.com)
* [React](https://reactjs.org/)

<!-- GETTING STARTED -->
## Getting Started
This project can be run on a local server or deployed to heroku or other platforms. To successfully run it locally, you will need to install node.js, npm  and mongodb in your machine and set up some environment variables:

### Installation

1. Register an application in Spotify and get a client_ID and a client_secret at [https://developer.spotify.com](https://developer.spotify.com)
2. Add as redirect uris both http://localhost:PORT/auth/spotify/callback (for development) and <production_domain>/auth/spotify/callback (for deploy).
3. Clone the repo
```sh
git clone https:://github.com/pedrochiossi/sounder-app.git
```
4. Install NPM packages
```sh
npm install
```
or
```sh
yarn
```
5. Create a `.env` file and enter your spotify client ID and Client Secret, Callback URL as:
```
APPKEY='ENTER YOUR CLIENT_ID'
APPSECRET='ENTER YOUR CLIENT_SECRET'
CALLBACKURI='ENTER SPOTIFY CALLBACK URL FOR AUTH'
```
6. Enter a PORT and a mongodb URI in `.env` as:
```
PORT=8888
MONGODB_URI=mongodb://localhost/sounderApp
CLIENT_URL=http://localhost:3000
```
## Running

* On development, run `npm run dev` or `yarn dev`.
* On production, make sure you build react with `cd client && yarn build`  
* and run `npm start` or `yarn start`.

<!-- USAGE EXAMPLES -->
## How to use

<p align="center">
  <img src="client/public/images/sounder_demo.gif">
</p>

* Click on the image to play or pause the 30s audio preview
* Like or dislike it to fetch a new song
* You can listen all your liked tracks again and add them to a new playlist


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Material-UI](https://material-ui.com/)
* [color-thief](https://github.com/lokesh/color-thief)
* [freefrontend](https://freefrontend.com/css-music-players/)
* [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
* [passport-spotify](https://github.com/JMPerez/passport-spotify)
* [LGK Music Player](https://codepen.io/lgkonline/pen/BQdeyZ)


[issues-shield]: https://img.shields.io/github/issues-closed/pedrochiossi/sounder-app
[issues-url]: https://github.com/pedrochiossi/sounder-app/issues
[stars-shield]: https://img.shields.io/github/stars/pedrochiossi/sounder-app?style=social
[stars-url]: https://github.com/pedrochiossi/sounder-app/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/pedrochiossi/sounder-app
[contributors-url]: https://github.com/pedrochiossi/sounder-app/graphs/contributors
[license-shield]: https://img.shields.io/github/license/pedrochiossi/sounder-app
[license-url]: https://github.com/pedrochiossi/sounder-app/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/pedrochiossi
[product-screenshot]: /client/public/images/screenshot_chrome_sounder.png

