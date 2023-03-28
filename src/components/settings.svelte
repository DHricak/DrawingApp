<script lang="ts">
  import Settings from "@svg/settings.svelte"
  import X from "@svg/x.svelte"

  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();

  import { outclick } from "@/scripts/outclick"

  let open = false;
// ---- DB params ----
  import { files as fs, current as cr, newCanvas, deleteCanvas, dropDB } from "@store";
  let files: saveRow[]; fs.subscribe(r => files = r);
  let current: saveRow; cr.subscribe(r => current = r);
</script>

<div class="settingBuble" use:outclick on:outclick={() => open = false}>
  {#if !open}
    <button 
      class="open"
      on:click={() => open = true}
    >
      <Settings/>
    </button>
  {:else}
    <div class="view">
      <span>
        <button
          class="close"
          on:click={() => open = false}
        >
          <X/>
        </button>
        <h3 class="title">Settings</h3>
      </span>
      <h4 class="title">Files</h4>
      <span class="files">
        {#each files as f}
          <button
            on:dblclick={() => cr.set(f)}
            class:sel={current.id == f.id}
          >
            {f.name} / {`${f.createdData.getDate()}.${f.createdData.getMonth()}.${f.createdData.getFullYear()}`}
            <button 
              class="del"
              on:click={() => deleteCanvas(f.id)}
            >
              X
            </button>
          </button>
        {/each}
      </span>
      <span class="optbtn">
        <button 
          class="save"
          on:click={async () => dispatch("save")}
        >
          Save
        </button>
        <button 
         class="new"
         on:click={async () => {
          let name = prompt("What do you name the new canvas: ")
          await newCanvas(name);
         }}
        >
          New
        </button>
      </span>
    </div>
  {/if}
</div>

<style lang="scss">
  .settingBuble {
    z-index: 9;
    border: 1px solid #343434;
    border-radius: 4px;
    
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .open, .view .close {
    padding: 6px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #121212;

    :global(svg) {
      $size: 1.8rem;
      width: $size;
      height: $size;
    }
  }

  .view {
    min-width: 14rem;
    min-height: 4rem;

    border-radius: 4px;
    background-color: #121212;
    padding: 4px;

    .title {
      margin: 8px 0;
      height: 1rem;
    }
  }

  span {
    display: flex;
    align-items: center;
    min-height: 8px;

    &.files {
      background-color: #212121;

      display: flex;
      flex-direction: column;

      max-height: 8rem;
      overflow-y: auto;

      button {
        position: relative;

        margin: 0;
        padding: 4px;

        width: 100%;
        height: 3rem;

        display: flex;
        align-items: center;
        justify-content: left;

        background: none;

        &.sel {
          background-color: #646cff;
        }

        .del {
          $size: 1.4rem;
          width: $size;
          height: $size;
          margin-left: auto;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 100%;
          background-color: #434343;
        }
      }
    }

    &.optbtn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      margin: 8px 0;

      button {
        padding: .4rem 1.2rem;
      }

      .save {
        background-color: #646cff;
      }
      .new {
        background-color: #48e739;
      }
    }
  }
</style>