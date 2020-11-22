 # CRUD API with Express - MongoDB
Restful api.

### Installation
Pull the repository 
```bash
npm install
cp .env.example .env
npm run serve
```
- Install NodeJS, MongoDB
- Install `npm`
- Rename `.env.example` to `.env`
- Edit variables in `.env`
- Run `npm install`
- Start MongoDB
- Start Redis - for Cache 
- Run `npm run serve`
- Check `http://localhost:3333/api/v1/status` to see it works

### Database
- Seed DB by running routes `http://localhost:3333/api/v1/users/seed` `http://localhost:3333/api/v1/tickets/seed`
