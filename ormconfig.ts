import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import { Location } from "./src/location/location.entity";

const config: PostgresConnectionOptions = {
    type: "postgres",
    database: "weather_db",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    entities: [Location],
    synchronize: true
}

export default config;