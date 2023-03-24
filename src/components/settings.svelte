<script lang="ts">
  import Settings from "@svg/settings.svelte"
  import X from "@svg/x.svelte"

  let open = false;
</script>

<div class="settingBuble">
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
    </div>
  {/if}
</div>

<style lang="scss">
  .settingBuble {
    z-index: 9;
    
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .open, .view .close {
    padding: 6px;

    display: flex;
    justify-content: center;
    align-items: center;

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

    .title {
      margin: 0;
      height: 1rem;
    }
  }

  span {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>