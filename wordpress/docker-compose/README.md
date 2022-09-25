# WordPress + Docker Compose 

Simple experiment to try the WordPress UI

Following https://docs.docker.com/samples/wordpress/

REST API reference: https://developer.wordpress.org/rest-api/

## Steps:

1. Install docker-compose, typically via Docker desktop on Mac/Windows https://www.docker.com/products/docker-desktop/

2. Start via the script below and verify that it  runs on `http://localhost:80`

## Scripts

- Start: `docker compose up -d``

- Stop (db will persist): `docker compose down`

- Uninstall (db will be deleted): `docker compose down --volumes`


