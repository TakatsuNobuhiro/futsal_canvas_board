<template>
  <div id="id">
    <h2>戦術ボード</h2>
    <canvas id="canvas" width="2000" height="2000"></canvas>
  </div>


</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({})
export default class Board extends Vue {
  context: any = ''
  canvas: any = ''


  mounted(){
    this.canvas = document.querySelector('#canvas')
    this.context = this.canvas.getContext('2d')
    if(this.context){
      const image = new Image();
      image.src = "image/board.png"
      image.onload = () => {
        this.context.drawImage(image, 0, 0, 1920, 1080, 0, 0, 1920, 1080)
      }
    }
  }
}
</script>

<style scoped>

</style>
