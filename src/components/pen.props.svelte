<script lang="ts">
  import { tool as tot, penprops as pp } from "@store";
  let pen: penprops;
  pp.subscribe(r => pen = r);
  let tool: tools;
  tot.subscribe(r => tool = r);

  let width = pen.width;
  let color = pen.color;
  let drag = pen.drag;

  $: pp.set({width, color, drag})
</script>

<div class="props">
  <label for="">Size: <input type="number" bind:value={width}></label>
  {#if tool == "pen"}
    <label for="">Color: <input type="color" bind:value={color}></label>
  {/if}
  {#if tool == "pen"}
    <label for="">Drag: <input type="checkbox" bind:value={drag}></label>
  {/if}
</div>

<style lang="scss">
  .props {
    z-index: 8;
    
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);

    min-width: 14rem;
    min-height: 1rem;

    padding: 8px 4px;

    display: flex;
    flex-direction: column;

    border-radius: 4px;
    background-color: #121212;

    label {
      display: grid;
      align-items: center;
      grid-template-columns: 1fr 3fr;

      padding: 4px;
    }

    input {
      color: #fff;
      border: 1px solid #808080;
      border-radius: 4px;
      padding: 4px;
      background-color: transparent;

      &[type=checkbox] {
        width: min-content;
      }
    }
  }
</style>