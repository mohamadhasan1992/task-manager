# Task Manager

A fullstack task management application built with modern technologies.

## Features

- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Frontend:** React (Vite), Tailwind CSS, Radix UI components
- **Dockerized:** Easy deployment with Docker

## Getting Started

### Prerequisites
- [Docker Compose](https://docs.docker.com/compose/)

### Usage

1. **Clone the repository:**
    ```bash
    git clone git@github.com:mohamadhasan1992/task-manager.git
    cd task-manager
    ```

2. **Create environment variable files:**
    - Copy the example environment files and edit as needed:
      ```bash
        cp backend/.env.example backend/.env
        cp frontend/.env.example frontend/.env
      ```
    - Update the `.env` files with your configuration.
    for backend
    ```bash
      # PORT
      PORT =3000

      # DATABASE
      DB_HOST = mongo
      DB_PORT = 27017
      DB_DATABASE = taskManager

      # TOKEN
      SECRET_KEY = secretkeyrandomlygenerated

      # LOG
      LOG_FORMAT = dev
      LOG_DIR = ../logs

      # CORS
      ORIGIN = http://localhost:3000
      CREDENTIALS = true
    ```
    for frontend
    ```bashe
      VITE_APP_API_URL=http://localhost:4000
      VITE_APP_ENABLE_API_MOCKING=false
    ```

3. **Start the application with Docker Compose:**
    ```bash
    docker compose up
    ```

  check the forntend at: [https://localhost:3000](https://localhost:3000)


The backend and frontend will be available at their respective ports (see `docker-compose.yml`).

## Project Structure

```
/backend   # Express + TypeScript + MongoDB API
/frontend  # React + Vite + React-Query + Tailwind CSS + Radix UI
```

## Customization

- Configure environment variables in `.env` files for frontend and `.env` for backend as needed.

