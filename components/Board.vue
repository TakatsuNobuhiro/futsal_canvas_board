<template>
  <div>
    <div id="canvas-container" class="canvas-container">
      <canvas
        id="canvas"
        class="canvas"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mouseup="mouseUp"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({})
export default class Board extends Vue {
  container: any = ''
  context: any = ''
  canvas: any = ''
  scale: number = 0
  objX: number = 100
  objY: number = 100
  objRadius: number = 30
  objColor: string = "#f00"
  isDrag: boolean = false
  image: Image = new Image

  drawPlayer () {
    // 円を描画
    this.context.strokeStyle = this.objColor;
    this.context.fillStyle = this.objColor;
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.arc(this.objX,this.objY,this.objRadius,0,2 * Math.PI,true)
    this.context.closePath()
    this.context.fill();
    // 文字（数字）を描画
    this.context.font = 'bold 32px sans-serif'
    this.context.textBaseline = "middle"
    this.context.textAlign = "center"
    this.context.fillStyle = "white"
    this.context.fillText(1,this.objX,this.objY)
  }

  // キャンバスにマウスをダウンしたときの処理
  mouseDown (event: any) {
    let mouseX = event.clientX / this.scale
    let mouseY = event.clientY / this.scale
    // マウスがオブジェクト上にあるか判定
    if ((this.objX - this.objRadius < mouseX && mouseX< this.objX + this.objRadius)
      &&(this.objY - this.objRadius < mouseY && this.objY + this.objRadius)){
      this.isDrag = true
    }else{
      this.isDrag = false
    }
  }

  mouseMove (event: any){
    if(this.isDrag){
      this.context.globalCompositeOperation = "destination-out";
      this.drawPlayer()
      this.context.drawImage(this.image, 0, 0)
      this.objX = event.clientX / this.scale
      this.objY = event.clientY /this.scale
      this.context.globalCompositeOperation = "source-over";
      this.drawPlayer()
    }
  }

  mouseUp (event: any){
    this.isDrag = false
  }

  mounted(){
    this.container = document.querySelector('#canvas-container')
    this.canvas = document.querySelector('#canvas')
    this.context = this.canvas.getContext('2d')
    this.canvas.width = this.container.clientWidth
    this.canvas.height = this.container.clientHeight
    let width = this.canvas.clientWidth

    if(this.context){
      this.image.src = "image/board.png"
      this.image.onload = () => {
        // this.scale = width / this.image.width
        // this.context.setTransform(this.scale,0,0,this.scale,0,0)
        // this.context.drawImage(this.image, 0, 0)
        this.drawPlayer()
      }

      // window.onresize = () => {
      //   this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
      //   this.canvas.width = this.container.clientWidth
      //   this.canvas.height = this.container.clientHeight
      //   let scale = this.canvas.width / image.width
      //   this.context.setTransform(scale,0,0,scale,0,0)
      //   this.context.drawImage(image, 0, 0)
      //   this.drawPlayer()
      // }
    }
  }
}
</script>


<style scoped>
.canvas-container{
  position: relative;
  height: 0;
  padding-top: 56.25%;
}
.canvas{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
