# Spotify Jukebox

Spotify Jukebox is a free Spotify-powered app that lets your guests choose which music should be played using their smartphones.

This is a fork of the great [Festify App](https://github.com/festify/app). Google Analytics as well as assets which might be related to copyrights (such as the name, icon etc.) have been removed.

## Building

### Dependencies

1. [nodejs](https://nodejs.org), [TypeScript](https://typescriptlang.org) and [yarn](https://yarnpkg.com): This app is written in TypeScript for better scalability and fewer bugs. We use yarn for package management.
1. [Firebase](https://firebase.google.com): This app is built upon Firebase Realtime Database and Firebase Cloud Functions. Set up a _dedicated and paid_ Firebase project. For user management, you need to enable at least [anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth), and if you want cheat-prevention to work, also authentication with GitHub, Facebook, Twitter, and Google+. In that case, you also need to set up and register the respective app / developer accounts with these services.
1. [Spotify](https://beta.developer.spotify.com/): This app plays music from Spotify. Set up a Spotify Developer Application (you need a Spotify Premium account) and configure the OAuth redirect URL. Usually at least `http://localhost:3000` is needed for a dev-environment. 3000 is the port the dev-server started with `yarn serve` runs on, but this can be any port you like, if you configure the dev server accordingly.
1. [Fanart.tv](https://fanart.tv) & [Sentry](https://sentry.io): This app displays Fanart from fanart.tv in the TV Mode and uses Sentry for error reporting. You require an account for both services.

### Environment Files

This app loads configuration variables though JS / TS / JSON files included in the build process. All following paths are relative to the repository root.

-   `src/admins.ts`: A list of allowed admins which may create parties, those emails need to be the email of their Spotify accounts:

    ```js
    export default ['alias@domain.tld'];
    ```

-   `common.config.js`: This file includes common configuration values that don't deserve their own file. Currently this is the Sentry URL and the Fanart.tv API key. It looks like this:

    ```js
    export const FANART_TV_API_KEY = 'FANART_API_KEY_HERE';
    export const SENTRY_URL = 'SENTRY_URL_HERE';
    ```

-   `firebase.config.js`: This file contains a simplified form of the config snippet you get when you add Firebase to a web application.

    ```js
    export default {
        apiKey: 'FIREBASE_API_KEY',
        authDomain: 'FIREBASE_AUTH_DOMAIN',
        databaseURL: 'FIREBASE_DATABASE_URL',
        projectId: 'FIREBASE_PROJECT_ID',
    };
    ```

-   `spotify.config.js`: This file contains the required configuration for authorization with Spotify and playback.

    ```js
    export const CLIENT_ID = 'YOUR_SPOTIFY_APPLICATION_CLIENT_ID';
    ```

-   `functions/service-account.json`: This is the Firebase service account file obtained directly from the web console. You can obtain it by going to Project Settings > Service Accounts > Firebase Admin SDK > Generate new private key.

-   `functions/spotify.config.ts`: This file contains Spotify configuration for the cloud functions.
    ```ts
    export const CLIENT_ID = 'YOUR_SPOTIFY_APPLICATION_CLIENT_ID';
    export const ENCRYPTION_SECRET = 'REFRESH_TOKEN_ENCRYPTION_KEY - PLEASE GENERATE';
    export const CLIENT_SECRET = 'YOUR_SPOTIFY_APPLICATION_CLIENT_SECRET';
    ```

Since all config values (except for the `service-account.json`) are loaded through standard ES modules machinery, building the project will notify you if something is missing.

### Building & Serving Locally

The `package.json` contains all necessary commands for building This app.

-   `build`: Compiles the TypeScript to JS and bundles all JS to a single file. You can then deploy the files in `/build` to a webserver of choice to run this app.
-   `fix`: Attempts to automatically fix linter errors.
-   `lint`: Lints the TS sources with tslint.
-   `prepare-env`: Used in CI environments to load environment files from branch-name-suffixed environment variables.
-   `serve`: Starts the rollup dev-server serving a local instance of this app on port 3000. Also supports live-reloading. Ensure you deploy the project to firebase before using the dev server because this app depends on cloud functions to be present!

### Deployment

1. Deploy the Firebase Realtime Database

```
$ firebase deploy --only database
```

2. Build & Deploy Firebase Functions

```
$ cd functions && yarn deploy
```

3. Build Web App

```
$ yarn build
```

4. Deploy Web App from `./build` to your preferred static host e.g. an S3 Bucket, GitHub Pages, BunnyCDN, Cloudflare, etc.

## License

LGPLv3
