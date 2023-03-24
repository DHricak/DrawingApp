<script lang="ts">
  import {onMount} from "svelte";

  import { position } from "@store";
  let pos: gridPosition;
  position.subscribe((r) => pos = r);

  let asp = aspectRatio(screen.width, screen.height);
  let block = gcd(screen.width, screen.height);

  let skitViewWidth: number;
  let skitViewHeight: number;

  let offsetY: number;
  let offsetX: number;

  let skit: HTMLDivElement;

  onMount(() => {
    offsetX = skitViewWidth/2;
    offsetY = skitViewWidth/2;
  })
</script>

<div 
  class="skit"
  bind:clientWidth={skitViewWidth}
  bind:clientHeight={skitViewHeight}
  bind:this={skit}
>

</div>

<style lang="scss">
  .skit {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .mainAxis {
    background-color: #eee;
  }
</style>