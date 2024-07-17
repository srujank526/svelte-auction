<script>
    import { goto } from "$app/navigation";
    import socket from "../lib/index.js";
    import {users} from "../store/store.js"
    let input;
    let nameInput;
    function handleClick(e) {
        e.preventDefault();
        let roomId = input.value;
        if (roomId === "") return;

        socket.emit("join-room", { name: nameInput.value, roomId });

        socket.on("roomInfo", (info) => {
            $users = [...info]
            goto("/play");
        });
    }
</script>

<form>
    <label for="name">user name</label>
    <input
        type="text"
        id="name"
        placeholder="enter user name"
        required
        bind:this={nameInput}
    />
    <label for="roomId">room id</label>
    <input
        type="text"
        id="roomId"
        placeholder="enter room Id"
        required
        bind:this={input}
    />
    <button type="submit" on:click={handleClick}>Create/Join</button>
</form>
