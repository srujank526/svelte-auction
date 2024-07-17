import io from 'socket.io-client';

const socket = io('https://svelte-auction-backend.vercel.app/');

export default socket;