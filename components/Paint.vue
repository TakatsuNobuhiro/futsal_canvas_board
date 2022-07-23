<template>
  <canvas id="paint-canvas"
    @touchstart.prevent="mouseDown"
    @mousedown="mouseDown"

    @touchmove.prevent="mouseMove"
    @mousemove="mouseMove"

    @touchend="mouseUp"
    @mouseup="mouseUp"
    @mouseout="mouseUp"
  />
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({
})
export default class Paint extends Vue {
  paintCanvas: HTMLCanvasElement | null = null
  paintCanvasContext: CanvasRenderingContext2D | null = null
  isPaint: boolean = false
  canvasMode: string = 'paint'

  setPen (lineWidth: number) {
    const ctx = this.paintCanvasContext as CanvasRenderingContext2D
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
  }

  penBlack () {
    const ctx = this.paintCanvasContext as CanvasRenderingContext2D
    this.setPen(5)
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#000000';
    this.canvasMode = 'paint'
  }
  penRed () {
    const ctx = this.paintCanvasContext as CanvasRenderingContext2D
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'red';
    this.setPen(5)
    this.canvasMode = 'paint'
  }

  penBlue () {
    const ctx = this.paintCanvasContext as CanvasRenderingContext2D
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'blue';
    this.setPen(5)
    this.canvasMode = 'paint'
  }

  penGreen () {
    const ctx = this.paintCanvasContext as CanvasRenderingContext2D
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'green';
    this.setPen(5)
    this.canvasMode = 'paint'
  }
  eraser () {
    (this.paintCanvasContext as CanvasRenderingContext2D).globalCompositeOperation = 'destination-out'
    this.setPen(30)
    this.canvasMode = 'paint'
  }

  clearPaint () {
    (this.paintCanvasContext as CanvasRenderingContext2D).clearRect(0,0,1920,3000)
  }

  mouseDown(event: MouseEvent | TouchEvent){
    let mouseX: number
    let mouseY: number
    if (this.device === 'mobile'){
      const touch_event = (event as TouchEvent).changedTouches[0]
      mouseX = touch_event.pageX / this.scale
      mouseY = (touch_event.pageY) / this.scale
    }else{
      mouseX = (event as MouseEvent).pageX / this.scale
      mouseY = ((event as MouseEvent).pageY)/ this.scale
    }

  }


}
</script>

<style scoped>

</style>
