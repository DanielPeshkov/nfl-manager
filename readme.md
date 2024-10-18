## NFL Manager
### Team Management Software
The crud app for managing NFL teams and players. Utilizes web sockets for live updates to concurrent users.

Installation steps: 
1. Clone the repository
2. Add a .env file with the following parameters:
  - PORT = port for the backend
  - CORS_WHITELIST = port for the angular app (probably http://localhost:4200)
  - DB_PORT = Postgres Database port
  - DB_HOST = Postgres Database host
  - DB_USER = Postgres Database username
  - DB_PASSWORD = Postgres Database password
  - DB_DATABASE = nfl (or your table name)
3. Create a nfl table in your postgres DB
4. Run the load_post.sql script to load the nfl table
5. Run npm install to install dependencies
6. Run npm install -g typescript if you don't have it
7. Run tsc to build the backend api
8. Launch the backend with: node --env-file=.env build/backend/app.js
9. Launch the frontend with: ng serve
10. Navigate to http://localhost:4200 to view the app