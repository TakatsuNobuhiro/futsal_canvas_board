<template>
  <div>
    <div id="canvas-container" class="canvas-container">
      <canvas
        id="canvas"
        class="canvas"
        @touchstart.prevent="mouseDown"
        @mousedown="mouseDown"

        @touchmove.prevent="mouseMove"
        @mousemove="mouseMove"

        @touchend="mouseUp"
        @mouseup="mouseUp"
      />
    </div>
    <div>
      <a class="btn btn-primary" id="download" href="">画像をダウンロード</a>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
// import { getDatabase, ref, onValue} from "firebase/database";

@Component({
})
export default class Board extends Vue {
  device: string = ''
  scrollY: number = 0
  container: any = ''
  context: any = ''
  canvas: any = ''
  scale: number = 0
  imageScale: number = 0
  dlLink: any = null
  players: [number, number, number, string][] = [
    [1, 200, 435, '#ed230c'], [2, 500, 95, '#ed230c'], [3, 400, 435, '#ed230c'], [4, 540, 795, '#ed230c'], [5, 1300, 435, '#ed230c'],
    [1, 1700, 435, '#09a1ff'], [2, 800, 95, '#09a1ff'], [3, 1500, 435, '#09a1ff'], [4, 800, 795, '#09a1ff'], [5, 700, 435, '#09a1ff'],
    [0, 500, 435, '#09a1ff']
  ]
  objRadius: number = 30
  isDrag: boolean = false
  dx: number = 0
  dy: number = 0
  image: HTMLImageElement = new Image
  ball: HTMLImageElement = new Image

  drawPlayer(player: any) {
    if (player[0] === 0) {
      this.context.drawImage(this.ball, 0, 0, 1900, 1900, player[1] - 30, player[2] - 30, 80/this.imageScale, 80/this.imageScale)
    } else {
      // 円を描画
      this.context.strokeStyle = player[3];
      this.context.fillStyle = player[3];
      this.context.lineWidth = 5;
      this.context.beginPath();
      this.context.arc(player[1], player[2], this.objRadius, 0, 2 * Math.PI, true)
      this.context.closePath()
      this.context.fill();
      // 文字（数字）を描画
      this.context.font = 'bold 32px sans-serif'
      this.context.textBaseline = "middle"
      this.context.textAlign = "center"
      this.context.fillStyle = "white"
      this.context.fillText(player[0], player[1], player[2])
    }
  }

  drawPlayers() {
    this.context.clearRect(0,0,1920,3000)
    this.context.drawImage(this.image, 0, 105,1920,975,0,0,1920,975)
    for (let player of this.players.slice().reverse()) {
      this.drawPlayer(player)
    }
  }

  // キャンバスにマウスをダウンしたときの処理
  mouseDown(event: any) {
    let mouseX: number
    let mouseY: number
    if (this.device === 'mobile'){
      const touch_event = event.changedTouches[0]
      mouseX = touch_event.clientX / this.scale
      mouseY = (touch_event.clientY + this.scrollY) / this.scale
    }else{
      mouseX = event.clientX / this.scale
      mouseY = (event.clientY + this.scrollY)/ this.scale
    }
    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i]
      // マウスがオブジェクト上にあるか判定
      let dx = player[1] - mouseX
      let dy = player[2] - mouseY
      if (dx**2 + dy**2 < this.objRadius**2) {
        this.isDrag = true
        this.players.unshift(player)
        this.players.splice(i + 1, 1);
        this.dx = mouseX - this.players[0][1]
        this.dy = mouseY - this.players[0][2]
        return
      } else {
        this.isDrag = false
      }
    }
  }

  mouseMove(event: any) {
    let mouseX: number
    let mouseY: number
    if (this.device === 'mobile'){
      const touch_event = event.changedTouches[0]
      mouseX = touch_event.clientX / this.scale
      mouseY = (touch_event.clientY + this.scrollY)/ this.scale
    }else{
      mouseX = event.clientX / this.scale
      mouseY = (event.clientY + this.scrollY) / this.scale
    }

    if (this.isDrag) {
      this.players[0][1] = mouseX - this.dx
      this.players[0][2] = mouseY - this.dy
      this.drawPlayers()
    }
    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i]
      // マウスがオブジェクト上にあるか判定
      let dx = player[1] - mouseX
      let dy = player[2] - mouseY
      if (dx**2 + dy**2 < this.objRadius**2) {
        this.canvas.style.cursor = 'move'
        return
      }
    }
    this.canvas.style.cursor = 'default'
  }

  mouseUp() {
    this.isDrag = false
    this.dlLink.href = this.canvas.toDataURL()
  }

  handleScroll() {
    this.scrollY = window.scrollY
  }

  mounted() {
    // スマホでのタッチ操作でのスクロール禁止
    // document.addEventListener("touchmove",(event: any) => { event.preventDefault() }, { passive: false });

    const userAgent = navigator.userAgent;
    if(userAgent.indexOf('iPhone') > 0 || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0 || userAgent.indexOf('iPad') > 0){
      this.device = 'mobile'
    } else {
      this.device = 'desktop'
    }
    window.addEventListener("scroll", this.handleScroll);

    this.container = document.querySelector<HTMLElement>('#canvas-container')
    this.canvas = document.querySelector<HTMLElement>('#canvas')
    this.context = this.canvas.getContext('2d')
    this.canvas.width = this.container.clientWidth
    this.canvas.height = this.container.clientHeight
    let width = this.canvas.clientWidth
    this.image.src = "image/futtech_board.png"
    this.ball.src = "image/ball.svg"
    this.image.onload = () => {

      this.scale = width / this.image.width
      this.imageScale = this.scale
      this.context.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      this.drawPlayers()
      this.dlLink = document.querySelector('#download')
      this.dlLink.download = "フットテック";
    }

    window.onresize = () => {
      // this.canvas.height = this.container.clientHeight
      this.scale = this.canvas.clientWidth / this.image.width
      // this.canvas.width = this.container.clientWidth
      // this.context.setTransform(this.scale,0,0,this.scale,0,0)
      // this.context.drawImage(this.image, 0, 0)
      // this.drawPlayer()
    }
  }

}
</script>


<style scoped>
.canvas-container {
  position: relative;
  height: 0;
  padding-top: 56.25%;
  user-select: none;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  /*background-image: url("/image/board.png");*/
  /*background-size: contain;*/
  /*background-repeat: no-repeat;*/
}
</style>
