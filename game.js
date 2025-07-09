
let metadata, playerAddress, socket;
const connectBtn = document.getElementById('connect');
const gameContainer = document.getElementById('game-container');

connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  playerAddress = await signer.getAddress();

  const contractAddress = "0xYourContractAddressHere";
  const abi = [
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
    "function balanceOf(address owner) public view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, provider);
  const balance = await contract.balanceOf(playerAddress);
  if (balance.eq(0)) {
    gameContainer.innerHTML = "You don't own a Duck NFT yet!";
    return;
  }

  const tokenId = await contract.tokenOfOwnerByIndex(playerAddress, 0);
  const tokenURI = await contract.tokenURI(tokenId);
  const metadataURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  const res = await fetch(metadataURL);
  metadata = await res.json();

  startGame();
};

function startGame() {
  gameContainer.innerHTML = "";

  socket = io(https://theduckverse-8.onrender.com);

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: { default: 'arcade' },
    scene: { preload, create, update }
  };

  const game = new Phaser.Game(config);
  let players = {};
  let cursors;

  function preload() {
    this.load.image('arena', 'assets/arena.png');
    this.load.image('duck', 'assets/duck.png');
  }

  function create() {
    this.add.image(400, 300, 'arena');

    cursors = this.input.keyboard.createCursorKeys();

    socket.emit('newPlayer', { id: playerAddress, metadata });

    socket.on('state', (serverPlayers) => {
      for (const id in serverPlayers) {
        if (!players[id]) {
          players[id] = this.physics.add.image(serverPlayers[id].x, serverPlayers[id].y, 'duck');
          if (id === playerAddress) {
            players[id].setCollideWorldBounds(true);
          }
        } else {
          players[id].x = serverPlayers[id].x;
          players[id].y = serverPlayers[id].y;
        }
      }
    });
  }

  function update() {
    if (!players[playerAddress]) return;
    const me = players[playerAddress];

    let vx = 0, vy = 0;
    if (cursors.left.isDown) vx = -200;
    if (cursors.right.isDown) vx = 200;
    if (cursors.up.isDown) vy = -200;
    if (cursors.down.isDown) vy = 200;

    me.setVelocity(vx, vy);

    socket.emit('movement', { id: playerAddress, x: me.x, y: me.y });
  }
}
