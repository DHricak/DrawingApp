<script lang="ts">

// --- variables ---
  // win params
  let blockSize = Math.max(window.innerWidth/16*9, 200);
  let winX: number, winY: number;

  // canvas pos
  let offsetX = 0, offsetY = 0;
  let bx = 0, by = 0;
  let posx = 0, posy = 0;
  let orx = posx, ory = posy;

  // blocks grid
  let blocks: Dict<block> = {};
  let show: uiblock[][];

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
    winX = window.innerWidth/blockSize;
    winY = window.innerHeight/blockSize;
    if (winX%1>0) winX = Math.floor(winX) + 2;
    else winX = Math.floor(winX) + 1
    if (winY%1>0) winY = Math.floor(winY) + 2;
    else winX = Math.floor(winX) + 1
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

  function fillBlocks() {
    for (let row of show) {
      for (let block of row) {
        let blockID = `${bx+block['x']},${by+block['y']}`;
        if (blockID in blocks) {
          if (block.element != null) {
            let ctx = block.element.getContext('2d');
            ctx.clearRect(0,0,blockSize,blockSize);
            if (blocks[blockID].image != undefined) {
              ctx.drawImage(blocks[blockID].image, 0, 0);
            }
          }
        } else {
          blocks[blockID] = {
            x: bx+block['x'],
            y: by+block['y']
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

        ctx.drawImage(image, -(block.x*blockSize-offsetX)-1, -(block.y*blockSize-offsetY)-1);
        blocks[blockID].image = await createImageBitmap(ctx.getImageData(0, 0, blockSize, blockSize));
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
        blocks[blockID].image = await createImageBitmap(ctx.getImageData(0, 0, blockSize, blockSize));
      }
    }
  }

  // inits
  offsetXY();
  setWinXY();
  populateBlocks();
  fillBlocks();


  // observers
  $:if (bx != undefined && by != undefined) {
    console.log('hello')
    fillBlocks();
  }
</script>

<svelte:window 
  on:resize={setWinXY} 
  on:mousedown={({button, clientX, clientY}) => {
    if (button == 1) {
      moving = true;
      origin = {
        x: clientX,
        y: clientY
      }
    }
  }}
  on:mouseup={({button}) => {
    if (button == 1) {
      moving = false;
      orx = posx;
      ory = posy;
    }
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
          bind:this={block["element"]}
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
      border: 1px solid white;
      position: absolute;
    }
  }
</style>