<script lang="ts">
  import { tool as tot } from "@store";
  let tool: tools;
  tot.subscribe((r) => (tool = r));


  import Lock from "@/components/svg/tools/lock.svelte";
  import LockOpen from "@svg/tools/lock.open.svelte";

  import Ink from "@/components/svg/tools/ink.svelte";
  import Move from "@/components/svg/tools/move.svelte";
  import Pen from "@/components/svg/tools/pen.svelte";
  import Eraser from "@/components/svg/tools/eraser.svelte";
</script>

<nav>
  <button 
    class:selected={tool == "move"}
    on:click={() => tot.set("move")}
  >
    <Move />
  </button>
  <button 
    class:selected={tool == "pen"}
    on:click={() => tot.set("pen")}
  >
    <Pen />
  </button>
  <button 
    class:selected={tool == "eraser"}
    on:click={() => tot.set("eraser")}
  >
    <Eraser />
  </button>
</nav>

<style lang="scss">
  nav {
    z-index: 9;
    
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    gap: 2px;

    width: fit-content;

    border-radius: 4px;
    padding: 4px;

    background-color: #121212;
  }

  nav button {
    background: none;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 6px;
    margin: 2px 4px;

    &.selected {
      background-color: #646cff;
    }

    :global(svg) {
      $size: 1.4rem;
      width: $size;
      height: $size;
    }
  }
</style>
