import { createGlobalStyle } from 'styled-components';

// Color pattern
export const colors = {
  deepBlue: '#252b34',
  skyBlue: '#14BEF0',
  pinkRed: '#B82050',
  red: '#e71d1d',
  darkRed: '#c40d0d',
  green: '#1db954',
  darkGreen: '#109b41',
  likeGreen: '#0dd30d',
};

export const GlobalStyle = createGlobalStyle`

  * {padding: 0; margin: 0;}

  *, *:before, *:after {
    box-sizing: initial;
  }

  html,
  body {
    background-color: #000;
    position: relative;
    font-family: "Roboto", sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Roboto", sans-serif !important;
  }

  p {
    color: white;
  }

  .overflow-hidden {
    overflow: hidden;
  }


  button {
    cursor: pointer;
  }

  .container {
    width: 100%;
    height: 100vh;
    padding-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    cursor: pointer;
  }

  .hidden {
    display: none;
  }

  #bg-before {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: inset 0 0 200px #000;
    filter: blur(15px);
    height: 100%;
  }

  #bg {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    height: 100%
  }

  .btn-section {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 14px 0;
  }

  .open-btn  {
    a {
      position: relative;
      color: white;
      padding: 5px;
      font-size: 0.7em;
      text-decoration: none;
      border-radius: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 30px;

      &:hover {
        background-color: rgb(1, 155, 101);
      }

      &:active {
        box-shadow: none;
      }
    }
  }

  .del-btn {
    a {
      position: relative;
      color: white;
      padding: 5px;
      font-size: 0.7em;
      text-decoration: none;
      border-radius: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      width: 30px;

      &:hover {
        background-color: ${colors.darkRed}
      }

      &:active {
        box-shadow: none;
      }
    }
  }

  .playlist-container {
    margin: 0 auto;
    width: 40%;
  }

  .playlist-cover {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    width: 80px;
    height: 80px;
    border: 1px solid lightgrey;
    margin-right: 20px;
  }

  .playlists-items {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0;
    padding: 20px;
    border: 2px solid ${colors.pinkRed};
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.19);
  }

  .title-header {
    display: block;
    width: 420px;
    margin: 0 auto;
    text-align: center;
    color: white;

    h2 {
      color: ${colors.skyBlue};
      font-size: 2.5em;
      text-align: center;
    }
  }



  .bg-dark {
    background-color: ${colors.deepBlue};
    min-height: 100vh;

    h2, h3 {
      color: white;
    }
  }

  .bg-red:hover {
    color: ${colors.darkRed} !important;
  }

  .playlists-container {
    width: 80%;
    margin: 0 auto;
    padding-top: 80px;
  }

  .track-info, .playlist-info {
    width: 70% !important;
  }


  #user-options a {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
  }

  #playlist-name {
    height: 30px;
    width: 200px;
  }

  @media (min-width: 768px) {

    .desktop-visible {display: block;}
    .mobile-visible {display: none;}

    .playlist-container {
      margin: 0 auto;
      width: 40%;
    }
  }

  @media (max-width: 767px) {

    .desktop-visible {display: none;}
    .mobile-visible {display: block;}

    .tracks-container { width: 100%; }
    #playlist-name { width: 150px; }

    .playlist-container {
      width: 100%;
    }
  }

  .drop-icon {
    margin-right: 20px;
  }


  .img-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }

  .delete-btn {
    border: none;
    background-color: transparent;
    margin-right: 10px;
    &:hover {
      color: red;
    }
  }

  .modal-container-custom {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 50px 0;
  }

  .modal-color-custom {
    background-color: ${colors.deepBlue};
  }

  .confirm-delete-btn {
    background-color: red;
    border-radius: 20px;
    color: white;
    border: none;
    height: 40px;
    width: 150px;
  }

  .cancel-delete-btn {
    border-radius: 20px;
    color: white;
    border: none;
    height: 40px;
    width: 150px;
    background-color: ${colors.green};
  }
`;
