<script lang="ts">
  import {onMount, createEventDispatcher} from "svelte";
  let dispatch = createEventDispatcher();

  // tool settings
  import { tool as tot, penprops as pp } from "@store";
  let tool: tools;
  tot.subscribe(r => tool = r);
  let pen: penprops;
  pp.subscribe(r => pen = r);

  // canvas item
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  $: canvas && (ctx = canvas.getContext("2d"));

  let drawing = false;

  // on screen brush
  let brush: HTMLDivElement;
  let bx = 0;
  let by = 0;

  let leash: Vector = newVector(500, 500);

  // sizeing canvas
  function fitCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // drawing function
  function draw(e) {
    bx = e.clientX;
    by = e.clientY;
    if (!drawing) return;
    if (tool == "pen" || tool == "eraser") penDraw(e);
  }

  // drawing tools
  function drag(x: number, y: number) {
    let vec = newVector(x, y);

    let dist = leash.distance(vec);
    if (dist > 8) {
      let dir = leash.sub(vec).norm().mul(10);
      return vec.add(dir)
    }
    return leash
  }

  function penDraw({clientX, clientY}) {
    if (pen.drag && tool != "eraser") {
      leash = drag(clientX, clientY);
    } else {
      leash.x = clientX;
      leash.y = clientY;
    }
    ctx.lineTo(leash.x, leash.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(leash.x, leash.y);
  }

  function InkDraw() {}

  // tool styles
  function eraserPreset() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = pen.width;
    ctx.lineCap = "round";
    ctx.strokeStyle = 'white';
    canvas.style.opacity = ".5";
  }

  function penStyle() {
    ctx.lineWidth = pen.width;
    ctx.lineCap = "round";
    ctx.strokeStyle = pen.color;
    canvas.style.opacity = "";
  }

  // listeners
  function pressing(e) {
    if (e.button != 0) return;
    drawing = true;

    //apply styles
    if (tool == "pen") penStyle();
    else if (tool == "eraser") eraserPreset();

    // leash setup
    leash.x = e.clientX;
    leash.y = e.clientY;

    // drawing start
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    draw(e);
  }

  async function relesed({button}) {
    if (button != 0) return;
    drawing = false;

    if (tool == "pen") dispatch("imgout", {
      width: canvas.width,
      height: canvas.height,
      image: await createImageBitmap(ctx.getImageData(0, 0, canvas.width, canvas.height))
    })
    else if (tool == "eraser") dispatch("imgoute", {
      width: canvas.width,
      height: canvas.height,
      image: await createImageBitmap(ctx.getImageData(0, 0, canvas.width, canvas.height))
    })

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 60)
  }

  onMount(() => fitCanvas());
</script>

<svelte:window on:resize={fitCanvas} />

<canvas
  bind:this={canvas}
  on:mousedown={pressing}
  on:mousemove={draw}
  on:mouseup={relesed}
  class:nocursor={tool != "move"}
  class:movecursor={tool == "move"}
>
</canvas>
<div 
  bind:this={brush}
  class="brush"
  class:hide={tool == "move"}
  style:width={`${pen.width}px`}
  style:height={`${pen.width}px`}
  style:top={`${by}px`}
  style:left={`${bx}px`}
  style:border={`1px solid ${pen.color}`}
></div>

<style lang="scss">
  canvas {
    z-index: 7;
    position: absolute;
    top: 0;
  }
  .nocursor {
    cursor: none;
  }
  .movecursor {
    cursor: move;
  }

  .brush {
    z-index: 7;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 50%;
    pointer-events: none;
    filter: invert(1);
  }

  .hide {
    display: none;
  }
</style>