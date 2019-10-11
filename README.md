[![Contributors][contributors-shield]][contributors-url]

<br />
<p align="center">
  <a href="https://sounder-app.herokuapp.com">
    <img src="/public/images/sounder_app_logo.png" alt="Logo" width="80" height="80">
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

<!-- GETTING STARTED -->
## Getting Started
This project can be run on a local server or deployed to heroku or other platforms. To successfully run it locally, you will need to install node.js, npm  and mongodb in your machine and set up some environment variables:

### Installation

1. Register an application in Spotify and get a client_ID and a client_secret at [https://developer.spotify.com](https://developer.spotify.com)
2. Add as redirect uris both http://localhost:PORT/auth/spotify/callback (for development) and <production_domain>/auth/callback (for deploy).
3. Clone the repo
```sh
git clone https:://github.com/pedrochiossi/sounder-app.git
```
4. Install NPM packages
```sh
npm install
```
5. Create a `.env` file and enter your client ID and Client Secret as:
```
APPKEY='ENTER YOUR CLIENT_ID'
APPSECRET='ENTER YOUR CLIENT_SECRET'
```
6. Enter a PORT and a mongodb URI in `.env` as:
```
PORT=8888
MONGODB_URI=mongodb://localhost/sounderApp
```
## Running

* On development, run `npm run dev`.

* On production, run `npm start`.

<!-- USAGE EXAMPLES -->
## How to use

<img src="/public/images/sounder_demo.gif">

* Click on the image to play or pause the 30s audio preview
* Like or dislike it to fetch a new song
* You can listen all your liked tracks again and add them to a new playlist
* If you are a premium user you can play the whole track on the tracks view


[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/pedrochiossi/sounder-app/graphs/contributors
[product-screenshot]: /public/images/screenshot_chrome_sounder.png

