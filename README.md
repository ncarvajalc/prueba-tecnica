# Prueba técnica Tyba

## Descripción

Este repositorio contiene la solución a la prueba técnica de Tyba. A continuación se describen los pasos para ejecutar la aplicación.

## Requerimientos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/)

## Ejecución

1. Clonar el repositorio
2. Ubicarse en la carpeta raiz del proyecto
3. Es necesario crear un archivo `.env` en la raiz del proyecto con las siguientes variables de entorno. Estas fueron suministradas en el correo de la prueba:

    ```env
    # Postgres
    POSTGRES_USER
    POSTGRES_PASSWORD
    POSTGRES_DB
    POSTGRES_HOST
    POSTGRES_PORT

    # JWT
    JWT_SECRET
    JWT_EXPIRES_IN

    # Places API key
    PLACES_API_KEY
    PLACES_API_URL
    GEO_CODING_API_URL
    ```

4. Ejectuar el siguiente comando:

    ```bash
    docker compose up -d
    ```

5. El servicio estará disponible en la siguiente URL: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
6. Para detener el servicio, ejecutar el siguiente comando:

    ```bash
    docker compose down
    ```

## Documentación

La documentación de la API se encuentra disponible en la siguiente URL: [http://localhost:3000/api](http://localhost:3000/api). Consiste en una documentación de Swagger para facilitar el uso de la API.

## Pruebas

### Pruebas unitarias

Para ejecutar las pruebas unitarias, se debe ejecutar el siguiente comando:

```bash
cd api
npm run test
```

### Pruebas de Postman

Para ejecutar las pruebas de Postman, se debe ejecutar el siguiente comando:

```bash
cd api
npm run test:newman
```

## Oportunidades de mejora

1. Implementar un sistema de caché

    Por cuestiones de tiempo, no se implementó un sistema de caché para almacenar las respuestas de la API. Esto podría reducir el tiempo de respuesta de la API y mejorar la experiencia del usuario.

2. Hacer uso de otras bases de datos

    Por cuestiones de tiempo, se utilizó una base de datos relacional (Postgres) con todos los datos almacenados en una sola base de datos. Para un escenario real, se podría utilizar una base de datos NoSQL como MongoDB para almacenar los datos de las transacciones realizadas y poder filtrarlas de manera más eficiente. En el caso de revocación de tokens, se podría utilizar una base de datos en memoria como Redis.
