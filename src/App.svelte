<script lang="ts">
  import Toolbar from "@comps/toolbar.svelte"
  import Settings from "@comps/settings.svelte"
  import Canvas from "@comps/canvas.svelte"
  import Multicanvas from "./components/multicanvas.svelte"

  import PenProps from "@comps/pen.props.svelte"
  import InkProps from "@comps/ink.props.svelte"

  import { tool as tot } from "@store";
  let tool: tools;
  tot.subscribe(r => tool = r);

  let draw;
  let eraser;

  import { onMount} from 'svelte';
  onMount(() => {
  })
</script>

<main>
  <Multicanvas 
    bind:drawToMC={draw}
    bind:eraserMC={eraser}
  />
  <Canvas 
    on:imgout={({detail}) => {
      draw(detail.image);
    }} 
    on:imgoute={({detail}) => {
      eraser(detail.image);
    }}
  />
  <Settings/>
  <Toolbar/>
  {#if tool == "pen" || tool == "eraser"}
    <PenProps/>
  {:else if tool == "ink"}
    <InkProps/>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>