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
    cd taskManager
    ```

2. **Create environment variable files:**
    - Copy the example environment files and edit as needed:
      ```bash
        cp backend/.env.example backend/.env.local
        cp frontend/.env.example frontend/.env
      ```
    - Update the `.env` files with your configuration.

3. **Start the application with Docker Compose:**
    ```bash
    docker-compose up
    ```

The backend and frontend will be available at their respective ports (see `docker-compose.yml`).

## Project Structure

```
/backend   # Express + TypeScript + MongoDB API
/frontend  # React + Vite + Tailwind CSS + Radix UI
```

## Customization

- Configure environment variables in `.env` files for both backend and frontend as needed.

## License

MIT