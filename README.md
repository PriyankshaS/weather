[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Prerequisites
Node.js (v16 or higher)
NestJS (v8 or higher)
WeatherAPI.com API Key (You need to sign up and get a free API key)

Clone to this repo : https://github.com/PriyankshaS/weather


## Setup env file with database

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=your_weather_db
CACHE_TTL=600000 # 10 minutes
WEATHER_API_KEY=your_api_key
WEATHER_API_URL=http://api.weatherapi.com/v1


## Compile and run the project

Docker Compose (Optional)
To managing your containers with Docker Compose, for running PostgreSQL for your NestJS app:

The nestjs-app service depends on the postgres service and connects to it via postgres:5432 (service name as the hostname).

Run the application using Docker Compose:

```bash
$ docker-compose up
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
