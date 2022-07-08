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
      <button class="btn btn-success" @click="undo" :disabled="isUndo" >一つ戻る</button>
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
  container: HTMLElement | null = null
  canvas: HTMLCanvasElement | null = null
  context: CanvasRenderingContext2D | null = null
  scale: number = 0
  imageScale: number = 0
  dlLink: HTMLAnchorElement | null = null
  undoIndex: number = 1
  historyList: [number, number, number, string][][] = []
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

  drawObject(player: [number, number, number, string]) {
    if (player[0] === 0) {
      this.drawBall(player)
    } else {
      this.drawPlayer(player)
    }
  }

  drawBall (player: [number, number, number, string]) {
    const context = this.context as CanvasRenderingContext2D
    context.strokeStyle = 'black';
    context.fillStyle = 'black';
    context.lineWidth = 3;
    const centerX = player[1]
    const centerY = player[2]



    const miniRadius = this.objRadius / 2
    context.beginPath()
    context.moveTo(centerX, centerY - miniRadius)
    context.lineTo(centerX - 0.951 * miniRadius, -0.309 * miniRadius + centerY)
    context.lineTo(centerX - 0.5877 * miniRadius, centerY + 0.809 * miniRadius)
    context.lineTo(centerX + 0.5877 * miniRadius, centerY + 0.809 * miniRadius)
    context.lineTo(centerX + 0.951 * miniRadius,  -0.309 * miniRadius + centerY)
    context.lineTo(centerX, centerY - miniRadius)
    context.fill()
    context.lineTo(centerX, centerY - this.objRadius)
    context.stroke()
    context.moveTo(centerX - 0.951 * miniRadius, -0.309 * miniRadius + centerY)
    context.lineTo(centerX - 0.961 * this.objRadius, -0.309 * this.objRadius + centerY)
    context.stroke()
    context.moveTo(centerX - 0.5877 * miniRadius, centerY + 0.809 * miniRadius)
    context.lineTo(centerX - 0.5877 * this.objRadius, centerY + 0.809 * this.objRadius)
    context.stroke()
    context.moveTo(centerX + 0.5877 * miniRadius, centerY + 0.809 * miniRadius)
    context.lineTo(centerX + 0.5877 * this.objRadius, centerY + 0.809 * this.objRadius)
    context.stroke()
    context.moveTo(centerX + 0.951 * miniRadius,  -0.309 * miniRadius + centerY)
    context.lineTo(centerX + 0.951 * this.objRadius,  -0.309 * this.objRadius + centerY)
    context.stroke()
    context.closePath()

    context.beginPath();
    context.arc(centerX, centerY, this.objRadius, 0, 2 * Math.PI, true)
    context.closePath()
    context.stroke();
  }

  drawPlayer (player: [number, number, number, string]) {
    const context = this.context as CanvasRenderingContext2D
    // 円を描画
    context.strokeStyle = player[3];
    context.fillStyle = player[3];
    context.lineWidth = 5;
    context.beginPath();
    context.arc(player[1], player[2], this.objRadius, 0, 2 * Math.PI, true)
    context.closePath()
    context.fill();
    // 文字（数字）を描画
    context.font = 'bold 32px sans-serif'
    context.textBaseline = "middle"
    context.textAlign = "center"
    context.fillStyle = "white"
    context.fillText(String(player[0]), player[1], player[2])
  }

  drawObjects() {
    this.context?.clearRect(0,0,1920,3000)
    this.context?.drawImage(this.image, 0, 105,1920,975,0,0,1920,975)
    for (let player of this.players.slice().reverse()) {
      this.drawObject(player)
    }
  }

  // キャンバスにマウスをダウンしたときの処理
  mouseDown(event: MouseEvent | TouchEvent) {
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

  mouseMove(event: MouseEvent | TouchEvent) {
    let mouseX: number
    let mouseY: number
    if (this.device === 'mobile'){
      const touch_event = (event as TouchEvent).changedTouches[0]
      mouseX = touch_event.pageX / this.scale
      mouseY = (touch_event.pageY)/ this.scale
    }else{
      mouseX = (event as MouseEvent).pageX / this.scale
      mouseY = ((event as MouseEvent).pageY) / this.scale
    }

    if (this.isDrag) {
      this.players[0].splice(1,1, mouseX - this.dx)
      this.players[0].splice(2,1,mouseY - this.dy)
      this.drawObjects()
    }
    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i]
      // マウスがオブジェクト上にあるか判定
      let dx = player[1] - mouseX
      let dy = player[2] - mouseY
      if (dx**2 + dy**2 < this.objRadius**2) {
        this.canvas!.style.cursor = 'move'
        return
      }
    }
    this.canvas!.style.cursor = 'default'
  }

  mouseUp() {
    if (this.isDrag) {
      this.historyList.splice(0,this.undoIndex - 1)
      this.historyList.unshift(JSON.parse(JSON.stringify(this.players)))
      this.undoIndex = 1
      this.isDrag = false
    }
    this.dlLink!.href = this.canvas?.toDataURL() as string
  }

  undo () {
    let i: number = this.undoIndex
    this.players = JSON.parse(JSON.stringify(this.historyList[i]))
    this.drawObjects()
    this.undoIndex += 1
  }

  get isUndo () {
    console.log(this.historyList.length, this.undoIndex)
    return this.historyList.length <= this.undoIndex
  }

  mounted() {
    // スマホでのタッチ操作でのスクロール禁止
    // document.addEventListener("touchmove",(event: TouchEvent) => { event.preventDefault() }, { passive: false });

    const userAgent = navigator.userAgent;
    if(userAgent.indexOf('iPhone') > 0 || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0 || userAgent.indexOf('iPad') > 0){
      this.device = 'mobile'
    } else {
      this.device = 'desktop'
    }

    this.container = document.querySelector<HTMLElement>('#canvas-container')
    this.canvas = document.querySelector<HTMLElement>('#canvas') as HTMLCanvasElement
    this.context = this.canvas.getContext('2d')
    this.canvas.width = <number>this.container?.clientWidth
    this.canvas.height = <number>this.container?.clientHeight
    let width = this.canvas.clientWidth
    this.image.src = "image/futtech_board.png"
    // this.ball.src = "image/ball.svg"
    this.image.onload = () => {

      this.scale = width / this.image.width
      this.imageScale = this.scale
      this.context?.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      this.drawObjects()
      this.dlLink = document.querySelector('#download')
      this.dlLink!.download = "フットテック";
    }

    window.onresize = () => {
      // this.canvas.height = this.container.clientHeight
      this.scale = (this.canvas as HTMLElement).clientWidth / this.image.width
      // this.canvas.width = this.container.clientWidth
      // this.context.setTransform(this.scale,0,0,this.scale,0,0)
      // this.context.drawImage(this.image, 0, 0)
      // this.drawObject()
    }
    this.historyList.unshift(JSON.parse(JSON.stringify(this.players)))
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
