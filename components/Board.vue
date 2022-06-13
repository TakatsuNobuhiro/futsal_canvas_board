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
  players = [

    [1,200,540,"#ed230c"], [2,500,200,"#ed230c"],[3,400,540,"#ed230c"],[4,540,900,"#ed230c"],[5,1300,540,"#ed230c"],
    [1,1700,540,"#09a1ff"], [2,1400,200,"#09a1ff"],[3,1500,540,"#09a1ff"],[4,1400,900,"#09a1ff"],[5,700,540,"#09a1ff"]

  ]
  objRadius: number = 30
  isDrag: boolean = false
  dragPlayer: number | string = 0
  image: HTMLImageElement = new Image

  drawPlayer (player: any) {
    // 円を描画
    this.context.strokeStyle = player[3];
    this.context.fillStyle = player[3];
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.arc(player[1],player[2],this.objRadius,0,2 * Math.PI,true)
    this.context.closePath()
    this.context.fill();
    // 文字（数字）を描画
    this.context.font = 'bold 32px sans-serif'
    this.context.textBaseline = "middle"
    this.context.textAlign = "center"
    this.context.fillStyle = "white"
    this.context.fillText(player[0],player[1],player[2])
  }

  drawPlayers (){
    for (let player of this.players.slice().reverse()){
      this.drawPlayer(player)
    }
  }

  // キャンバスにマウスをダウンしたときの処理
  mouseDown (event: any) {
    let mouseX = event.clientX / this.scale
    let mouseY = event.clientY / this.scale
    for (let i = 0; i < this.players.length; i++){
      let player = this.players[i]
      // マウスがオブジェクト上にあるか判定
      if (((player[1] - this.objRadius) < mouseX && mouseX< (player[1] + this.objRadius)
        &&((player[2] - this.objRadius) < mouseY && (player[2] + this.objRadius)))){
        this.isDrag = true
        this.players.unshift(player)
        this.players.splice(i+1,1);
        console.log(this.players)
        return
      }else{
        this.isDrag = false
      }
    }
  }

  mouseMove (event: any){
    if(this.isDrag){
      this.context.drawImage(this.image, 0, 0)
      console.log(this.players)
      this.players[0][1] = event.clientX / this.scale
      this.players[0][2] = event.clientY /this.scale
      this.context.globalCompositeOperation = "source-over";
      this.drawPlayers()
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
        this.scale = width / this.image.width
        this.context.setTransform(this.scale,0,0,this.scale,0,0)
        this.context.drawImage(this.image, 0, 0)
        this.drawPlayers()
      }

      window.onresize = () => {
        // this.context.clearRect(0,0,this.canvas.width,this.canvas.height)

        // this.canvas.height = this.container.clientHeight
        this.scale = this.canvas.clientWidth / this.image.width
        // this.canvas.width = this.container.clientWidth
        // this.context.setTransform(this.scale,0,0,this.scale,0,0)
        // this.context.drawImage(this.image, 0, 0)
        // this.drawPlayer()
        // console.log(this.scale)
      }
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
  /*background-image: url("/image/board.png");*/
  /*background-size: contain;*/
  /*background-repeat: no-repeat;*/
}
</style>
