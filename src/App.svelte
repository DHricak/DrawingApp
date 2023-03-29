<script lang="ts">
  import Toolbar from "@comps/toolbar.svelte"
  import Settings from "@comps/settings.svelte"
  import Canvas from "@comps/canvas.svelte"
  import Multicanvas from "./components/multicanvas.svelte"

  import PenProps from "@comps/pen.props.svelte"

  let hideUI = false;

  import { tool as tot } from "@store";
  let tool;
  tot.subscribe(r => tool = r);

  import { files as fs, newCanvas } from "@store";
  let files: saveRow[];fs.subscribe(r => files = r);

  let draw;
  let eraser;
  let saveDrawing;
  let loadDefault;

  import { onMount } from 'svelte';
  onMount(() => {
  })
</script>

<svelte:window 
  on:keydown={({shiftKey}) => {
    if (shiftKey) {
      hideUI = !hideUI;
    }
  }}
/>

<main>
  <Multicanvas 
    bind:drawToMC={draw}
    bind:eraserMC={eraser}
    bind:saveCanvas={saveDrawing}
  />
  <Canvas 
    on:imgout={({detail}) => {
      draw(detail.image);
    }} 
    on:imgoute={({detail}) => {
      eraser(detail.image);
    }}
  />
  {#if !hideUI}
    <Toolbar/>
    <div class="sb">
      <Settings
        on:save={() => saveDrawing()}
      />
      {#if tool == "pen" || tool == "eraser"}
        <PenProps/>
      {/if}
      <div></div>
    </div>
    <p id="ist">Controls: Middle mouse button for movement, shift to hide ui overlay. If there is an error report and restart.</p>
  {/if}
</main>

<style lang="scss">
  main {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .sb {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    width: min-content;
    min-height: fit-content;
    height: 100%;
    padding: 10px;
  }

  #ist {
    z-index: 7;
    position: absolute;
    bottom: 6px;
    width: 100%;
    text-align: center;
    margin: 0;
    color: #ccc;
  }
</style>