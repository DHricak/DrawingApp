<script lang="ts">
  import { tool as tot } from "@store";
  let tool: tools;
  tot.subscribe(r => tool = r);


// --- variables ---
  let id: number; // id from save
  // win params
  let blockSize = 480;
  let winX: number, winY: number;

  // canvas pos
  let offsetX = 0, offsetY = 0;
  let bx = 0, by = 0;
  let posx = 0, posy = 0;
  let orx = posx, ory = posy;

  // blocks grid
  let blocks: Dict<ImageData> = {};
  let blocksd: Dict<ImageBitmap> = {};
  let show: uiblock[][] = [];

  // states
  let origin: gridPosition;
  let moving = false;
  let update = false;

// --- functions ---
  // calculators
  function offsetXY() {
    bx = Math.floor(posx/blockSize);
    by = Math.floor(posy/blockSize);
    offsetX = Math.abs(bx*blockSize - posx);
    offsetY = Math.abs(by*blockSize - posy);
  }

  function setWinXY() {
    winX = (window.innerWidth+blockSize)/blockSize;
    winY = (window.innerHeight+blockSize)/blockSize;
    winX = (winX%1 > 0) ? Math.floor(winX)+1 : winX;
    winY = (winY%1 > 0) ? Math.floor(winY)+1 : winY;
  }

  function populateBlocks() {
    let newShow = [];
    for(let x = 0; x < winX; x++) {
      let row = []; 
      for(let y = 0; y < winX; y++) {
        row.push({
          x, y,
          element: null
        })
      }
      newShow.push(row);
    }
    show = newShow;
  }

  async function fillBlocks() {
    for (let row of show) {
      for (let block of row) {
        let blockID = `${bx+block['x']},${by+block['y']}`;
        if (blockID in blocks) {
          if (block.element != null) {
            let ctx = block.element.getContext('2d');
            ctx.clearRect(0,0,blockSize,blockSize);
            if (blocks[blockID] != null) {
              if ((blockID in blocksd) == false) {
                blocksd[blockID] = await createImageBitmap(blocks[blockID]);
              }
              ctx.drawImage(blocksd[blockID], 0, 0);
            }
          }
        } else {
          blocks[blockID] = null;
          if (block.element != null) {
            let ctx = block.element.getContext('2d');
            ctx.clearRect(0,0,blockSize,blockSize);
          }
        }
      }
    }
  }


  // io
  export const drawToMC = async (image: ImageBitmap) => {
    for (let row of show) {
      for (let block of row) {
        let blockID = `${bx+block['x']},${by+block['y']}`;
        let ctx = block.element.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';

        ctx.drawImage(image, -(block.x*blockSize-offsetX), -(block.y*blockSize-offsetY));
        blocks[blockID] = ctx.getImageData(0, 0, blockSize, blockSize);
      }
    }
  }

  export const eraserMC = async (image: ImageBitmap) => {
    for (let row of show) {
      for (let block of row) {
        let blockID = `${bx+block['x']},${by+block['y']}`;
        let ctx = block.element.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';

        ctx.drawImage(image, -(block.x*blockSize-offsetX)-1, -(block.y*blockSize-offsetY)-1);
        blocks[blockID] = ctx.getImageData(0, 0, blockSize, blockSize);
      }
    }
  }

  import { saveCanvas as sf } from "@store"
  export const saveCanvas = () => {
    sf(id, blocks);
  }

  offsetXY();
  setWinXY();
  populateBlocks();


  // observers
  $:if (bx != undefined && by != undefined) {
    fillBlocks();
  }

  // ---- DB Connection ----
  import { current as cr } from "@store";
  cr.subscribe(async r => {
    if (!r) return;
    id = r.id;
    orx = posx; ory = posy;
    blocks = r.blocks;
    blocksd = {};
    console.log(blocks)
    offsetXY();
    fillBlocks();
  });
</script>

<svelte:window 
  on:resize={setWinXY} 
  on:mousedown={({button, clientX, clientY}) => {
    if (button == 1 || (button == 0 && tool == "move")) {
      moving = true;
      origin = {
        x: clientX,
        y: clientY
      }
    }
  }}
  on:mouseup={({button}) => {
    if (button == 1 || (button == 0 && tool == "move")) {
      moving = false;
      orx = posx;
      ory = posy;
    }
    setTimeout(() => sf(id, blocks), 5000)
  }}
  on:mousemove={({clientX, clientY}) => {
    if (moving) {
      posx = origin.x - clientX + orx;
      posy = origin.y - clientY + ory;
      offsetXY();
      if (update) {
        fillBlocks();
      }
    }
  }}
/>

<div class="view">
  <div 
    class="shift"
    style:top={`${-offsetY}px`}
    style:left={`${-offsetX}px`}
  >
    {#each show as row}
      {#each row as block}
        {@const {x, y} = block}
        <svelte:element 
          this="canvas" 
          width={blockSize}
          height={blockSize}
          style:top={`${y*blockSize}px`}
          style:left={`${x*blockSize}px`}
          bind:this={block.element}
        />
      {/each}
    {/each}
  </div>
</div>

<style lang="scss">
  .view {
    z-index: 6;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    pointer-events: none;
    overflow: hidden;

    .shift { 
      position: absolute;
      top: 0;
    }

    :global(canvas) {
      position: absolute;
    }
  }
</style>