<script lang="ts"></script>

<div class="props"></div>

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
      border: 1px solid #808080;
      border-radius: 4px;
      padding: 4px;
      background-color: transparent;
    }
  }
</style>