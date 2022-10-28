<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="https://graphql.org/" target="blank"><img src="https://graphql.org/img/logo.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h1 align="center">AnyList</h1>


## Instalación

```bash
$ yarn install
```

## Configuración

1. Tener Nest CLI instalado
```bash
$ npm i -g @nestjs/cli
```
2. Configurar las variables de entorno en ```.env``` (utiliza ```.env.example``` como plantilla).
```bash
# Ambiente de desarrollo de la app
STATE=
# puerto donde corre la app
PORT=3000
# HOST de la base de datos de Postgres
DB_HOST=localhost
# Puerto de la base de datos de Postgres
DB_PORT=5432
# Nombre de la base de datos de Postgres
DB_NAME=
# Usuario para la conexion a Postgres
DB_USERNAME=
# Contraseña para la conexion a Postgres
DB_PASSWORD=
```

3. Instalar y correr [Docker Desktop](https://www.docker.com/products/docker-desktop/), enseguida correr para levantar la base de datos del proyecto.
```bash
$ docker-compose up -d
```

## Corriendo la app

```bash
# development
$ yarn run start
# watch mode
$ yarn run start:dev
# production mode
$ yarn run start:prod
```

>**Nota:** Acceder a Apollo Studio en http://localhost:3000/graphql para realizar las pruebas.