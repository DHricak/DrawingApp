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
    <Settings
      on:save={() => saveDrawing()}
    />
    <Toolbar/>
    {#if tool == "pen" || tool == "eraser"}
      <PenProps/>
    {/if}
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>