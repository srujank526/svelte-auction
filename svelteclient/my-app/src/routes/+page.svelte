<script>
    import { goto } from "$app/navigation";
    import socket from "../lib/index.js"
    let input;
    let name;
    function handleClick(e){
        e.preventDefault()
        let roomId = input.value
        if(roomId === '')return;
        console.log(roomId+ " "+socket.id)
        socket.emit('join-room',{roomId,name:name.value})
        goto('/play')
    }
</script>
<form>
    <label for='name'>user name</label>
    <input type="text" id="name" placeholder="enter user name" required bind:this={name}/>
    <label for='roomId'>room id</label>
    <input type="text" id="roomId" placeholder="enter room Id" required bind:this={input}/>
    <button type="submit" on:click={handleClick}>Create/Join</button>
</form>
