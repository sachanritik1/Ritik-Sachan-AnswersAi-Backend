# Setup Guide

    - clone repo locally.
    - Use latest node version. If doesn't work try node version `v20.15.1`.
    - run `npm install`.
    - make .env file referencing .env.example and fill all the environment variables (use PostgreSQL).
    - apply database migration using `npx prisma migrate deploy` command.
    - run `npm run dev` and your development server is up and running.

# Docker setup

    - Do the above setup
    - create a docker image using `docker build -t <image-name>:<tag> <path-to-dockerfile-directory> --target <dev/prod>` command.
    - now run the docker image using `docker run -p 8000:8000 my-app` command.
