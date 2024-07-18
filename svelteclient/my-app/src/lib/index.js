import io from 'socket.io-client';

const socket = io('https://svelte-auction-backend.onrender.com/');
// const socket = io('https://svelte-auction-backend-bvoownn1m-srujank526s-projects.vercel.app/');

export default socket;
