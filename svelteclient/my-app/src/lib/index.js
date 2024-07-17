import io from 'socket.io-client';

const socket = io('https://svelte-auction-backend-7nreeuhqa-srujank526s-projects.vercel.app/api/socket');

export default socket;