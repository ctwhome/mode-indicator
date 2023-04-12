<script>
import todos from "$lib/db";


</script>

<h1>The Famous Cats of YouTube</h1>

<ul>
  {#each todos as { id, name }, i}
    <li><a target="_blank" href="https://www.youtube.com/watch?v={id}">
      {i + 1}: {name}
    </a></li>
  {/each}
</ul>

