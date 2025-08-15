<script setup lang="ts">

const props = defineProps({
  first: Boolean,
  controlImgStyle: String,
  controlImgNoImg: Boolean
})

const emits = defineEmits(['controlImgClick:first', 'controlImgClick:second'])
</script>

<template>
  <div v-if="!props.first" class="owner-size-click" :class="props.controlImgStyle" @click="(ev) => emits('controlImgClick:first', ev)">
    <slot name="img1" v-if="!controlImgNoImg"></slot>
  </div>

  <div v-if="props.first" class="owner-size-click" :class="props.controlImgStyle" @click="(ev) => emits('controlImgClick:second', ev)">
    <slot name="img2" v-if="!controlImgNoImg"></slot>
  </div>
</template>

<style scoped>
.owner-size-click::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
