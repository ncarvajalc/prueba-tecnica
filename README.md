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

5. El servicio estará disponible en la siguiente URL: [http://localhost:3000](http://localhost:3000)

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
