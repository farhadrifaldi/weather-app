# Welcome to my Weather APP

This is a simple weather app that uses the [WeatherApi](https://www.weatherapi.com/) to fetch the current weather and forecast weather and build on [NextJS](https://nextjs.org/) + [AuthJS](https://authjs.dev/) + [PostgreSQL](https://www.postgresql.org/) database. + [Prisma](https://www.prisma.io/) ORM + [Algolia](https://www.algolia.com/) for elastic search

#### Features

- Show Current Weather and Weather forecast
- Search weather based on selected City
- Add current weather City to your favorite (Login needed)

## How to Run

#### Using Docker Compose

- Install `docker` with `docker compose`
- Make sure to fill all variables on .env.example with working API keys

  - use API Key from [WeatherApi](https://www.weatherapi.com/) for `WEATHER_API_KEY`
  - use API Key from [Geocode API](https://geocode.maps.co/) for `GEOCODE_MAPS_API_KEY` (used for reverse geocoding)
  - use API Key from [Algolia](https://www.algolia.com/) for `NEXT_PUBLIC_ALGOLIA_APP_ID` & `NEXT_PUBLIC_ALGOLIA_SEARCHA_API_KEY`

- Make sure port `5432` is not used to run postgreSQL container, if used please update variable `DATABASE_URL` port section to desired port
- after that you can run command

```bash
docker-compose up
```

- Please notes, when you run this way, you can't update the code and expect to see the changes, you need to rebuild the image with `docker-compose up --build` after you update the code.
- If you need to update the code or run in development mode, please follow the instruction below.

#### Using Convensional Way

- Minimum Node for this project is `Node.js 18.17`
- update or copy `.env.example to .env` (this is important!)
- You should have your device postgreSQL use PORT `5432` or update `DATABASE_URL` to your desired port on `.env` file
- Create Database on posgresSQL with name `weather_app`, or you can use other name but you should update `DATABASE_URL`
- make sure postgreSQL user have roles to `CREATE` `UPDATE` Database and have role to use the desired Database
- then you can run command to install all dependencies

```bash
npm install
```

- if you get any error like this

```bash
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
```

use this command instead

```bash
npm install --force
```

- after that you have to run prisma command to generate, migrate the migration & run seeder script to add the user of this project

```bash
npx prisma generate
then
npx prisma migrate dev
then
node ./scripts/seed.mjs
```

- after that you can run command to start the server in development mode

```bash
npm run dev
```

- or run command to start the server in production mode

```bash
npm run build
npm run start
```

#### Predefined account

When you follow the steps above, you should notice, in the step it have command `node ./scripts/seed.js` that script is to store predefined account to database, you can check the predefined account in `./scripts/seed.mjs or you can see it below

```
email: admin@admin.com
password: password
```

Or you can create account when the app is running in `/login` page
