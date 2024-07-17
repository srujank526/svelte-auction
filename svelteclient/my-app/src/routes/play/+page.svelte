<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import {users} from "../../store/store.js"
    import socket from "../../lib/index.js"
    
    let player,set,nextbidAmount;
    let currentBid = {user:null, bidAmount:null,sold:false} 

    
    socket.on('resSet',(set)=>{
        console.log(set)
    })
    socket.on('resPlayer',(data)=>{
        player = data
        nextbidAmount = player.basePrice
    })
    socket.on('currentBid',(data)=>{
        currentBid.user = data.user
        currentBid.bidAmount = data.bidAmount
    })
    socket.on('bid-is-with',(data)=>{
        currentBid.user = data.socketId
        currentBid.bidAmount = data.amount
        nextbidAmount=nextBid()
        console.log(currentBid)
    })
    socket.on('playerSoldTo',data=>{
        currentBid.user = data.user
        currentBid.bidAmount = data.bidAmount
        currentBid.sold = true
    })

    function getSet(){
        socket.emit('reqSet',users[0]?.roomId)
        socket.on('resSet',(set)=>{
        })
    }

    function getPlayer(){
        socket.emit('reqPlayer',users[0]?.roomId)
    }

    function nextBid(){
        if(currentBid.user){
            if(currentBid.bidAmount < 200) return currentBid.bidAmount+10
            if(currentBid.bidAmount<1000) return currentBid.bidAmount+20
            return currentBid.bidAmount + 25
        }
        return currentBid.bidAmount
    }

    function placeBid(){
        socket.emit('bidPlaced',{socketId:socket.id,amount:nextbidAmount})
    }

    function sellPlayer(){
        socket.emit('playerSoldTo',currentBid)
    }

    $:bidText = currentBid.sold?`${player.name} Sold to ${currentBid.user} at ${currentBid.bidAmount}`:(currentBid.bidAmount ?`current bid at ${currentBid.bidAmount}L`: "draw a player to get the base price")
    $:nextBidText = nextbidAmount? `bid ${nextbidAmount}L`:'bid button'
</script>

<h1>Play tab</h1>
<h3>{player?.name || 'Player Name.....(Draw a player)'}</h3>
<h4>{bidText}</h4>
<button on:click={getSet}>change set</button>
<button on:click={getPlayer}>change player</button>
<ul>
    {#each $users as user}
    <li key={user.socket}>{user.name}</li>
    <button on:click={placeBid} class:hidden={user.socket != socket.id || currentBid.user==socket.id}>{nextBidText}</button>
    {/each}
</ul>
<button on:click={sellPlayer}>sell player</button>


<style>
    .hidden{
        display: none;
    }
</style>