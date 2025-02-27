<script>
export default {
  props: {
    width: {
      type: String,
      default: '20',
    },
    height: {
      type: String,
      default: '20',
    },
  },
  computed: {
    style: vm => ({
      width: `${vm.width}px`,
      height: `${vm.height}px`,
    }),
  },
}
</script>

<template>
  <div>
    <div class="spinner dark:bg-zinc-50" :style="style" />
  </div>
</template>

<style scoped>
.spinner {
  background-color: #333;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>
