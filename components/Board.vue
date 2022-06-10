<template>
  <div id="canvas-container">
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
    let width = this.context.clientWidth
    let height = this.context.clientHeight
    if(this.context){
      const image = new Image();
      image.src = "image/board.png"
      image.onload = () => {
        let scale = width / height
        this.context.setTransform(scale,0,0,scale,0,0)
        this.context.drawImage(image, 0, 0)
      }
    }
  }
}
</script>


<style scoped>
#canvas-container{
  position: relative;
  height: 0;
  padding-top: 56.25%;
}
#canvas{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
