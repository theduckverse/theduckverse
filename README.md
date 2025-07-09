
# Duckverse Multiplayer Game

## 🚀 Features
✅ Wallet connection with MetaMask & NFT detection  
✅ Multiplayer arena — see and move with other players live  
✅ Leaderboard support  
✅ Custom art assets (`/assets/arena.png`, `duck.png`)

## Run Locally

### Backend
```
cd duckverse_multiplayer_game
npm install express cors socket.io
node server.js
```
Backend: [http://localhost:3000](http://localhost:3000)

### Frontend
```
cd duckverse_multiplayer_game
python3 -m http.server 8000
```
Frontend: [http://localhost:8000](http://localhost:8000)

## Deploy Online

### Frontend → Netlify or Vercel
Push to GitHub → import into Netlify or Vercel → deploy

### Backend → Render, Railway, or Heroku
Push to GitHub → create a new Node.js web service → deploy
