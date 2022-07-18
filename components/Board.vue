<template>
  <div>
    <div id="canvas-container" class="canvas-container">
      <canvas id="dummy-canvas"></canvas>
      <canvas id="base-canvas"></canvas>
      <canvas
        id="objects-canvas"
        class="canvas"
        @touchstart.prevent="mouseDown"
        @mousedown="mouseDown"

        @touchmove.prevent="mouseMove"
        @mousemove="mouseMove"

        @touchend="mouseUp"
        @mouseup="mouseUp"
        @mouseout="mouseUp"
      />
      <canvas id="paint-canvas"></canvas>
    </div>
    <div>
      <a class="btn btn-info" id="download" href="">画像をダウンロード</a>
      <button class="btn btn-warning" @click="undo" :disabled="isUndo" >一つ戻る</button>
      <button class="btn btn-secondary" @click="dragMode">ドラッグモード</button>
      <button class="btn btn-dark" @click="penBlack">黒ペン</button>
      <button class="btn btn-danger" @click="penRed">赤ペン</button>
      <button class="btn btn-primary" @click="penBlue">青ペン</button>
      <button class="btn btn-success" @click="penGreen">緑ペン</button>
      <button class="btn btn-light" @click="eraser">消しゴム</button>
      <button class="btn btn-light" @click="clearPaint">クリア</button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({
})
export default class Board extends Vue {
  device: string = ''
  container: HTMLElement | null = null
  canvas: HTMLCanvasElement | null = null
  baseCanvas: HTMLCanvasElement | null = null
  paintCanvas: HTMLCanvasElement | null = null
  dummyCanvas: HTMLCanvasElement | null = null
  context: CanvasRenderingContext2D | null = null
  baseCanvasContext: CanvasRenderingContext2D | null = null
  dummyCanvasContext: CanvasRenderingContext2D | null = null
  paintCanvasContext: CanvasRenderingContext2D | null = null
  scale: number = 0
  imageScale: number = 0
  dlLink: HTMLAnchorElement | null = null
  undoIndex: number = 1
  historyList: [number, number, number, string][][] = []
  objects: [number, number, number, string][] = [
    [1, 200, 435, '#ed230c'], [2, 500, 95, '#ed230c'], [3, 400, 435, '#ed230c'], [4, 540, 795, '#ed230c'], [5, 1300, 435, '#ed230c'],
    [1, 1700, 435, '#09a1ff'], [2, 800, 95, '#09a1ff'], [3, 1500, 435, '#09a1ff'], [4, 800, 795, '#09a1ff'], [5, 700, 435, '#09a1ff'],
    [0, 500, 435, '#09a1ff']
  ]
  objRadius: number = 30
  isDrag: boolean = false
  dx: number = 0
  dy: number = 0
  image: HTMLImageElement = new Image
  canvasMode: string = 'drag'
  isPaint: boolean = false

  dragMode () {
    this.canvasMode = 'drag'
  }

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

  drawObject(player: [number, number, number, string], context: CanvasRenderingContext2D | null) {
    if (player[0] === 0) {
      this.drawBall(player, context)
    } else {
      this.drawPlayer(player, context)
    }
  }

  drawBall (player: [number, number, number, string], ctx: CanvasRenderingContext2D | null) {
    const context = ctx as CanvasRenderingContext2D
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

  drawPlayer (player: [number, number, number, string], ctx: CanvasRenderingContext2D | null) {
    const context = ctx as CanvasRenderingContext2D
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

  drawObjects(context: CanvasRenderingContext2D | null, isClear: boolean = true) {
    if (isClear){
      context?.clearRect(0,0,1920,3000)
    }
    for (let player of this.objects.slice().reverse()) {
      this.drawObject(player, context)
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
    if (this.canvasMode === 'drag'){
      for (let i = 0; i < this.objects.length; i++) {
        let player = this.objects[i]
        // マウスがオブジェクト上にあるか判定
        let dx = player[1] - mouseX
        let dy = player[2] - mouseY
        if (dx**2 + dy**2 < this.objRadius**2) {
          this.isDrag = true
          this.objects.unshift(player)
          this.objects.splice(i + 1, 1);
          this.dx = mouseX - this.objects[0][1]
          this.dy = mouseY - this.objects[0][2]
          return
        } else {
          this.isDrag = false
        }
      }
    }else if (this.canvasMode === 'paint'){
      const ctx = this.paintCanvasContext as CanvasRenderingContext2D
      ctx.beginPath()
      ctx.lineTo(mouseX, mouseY)
      ctx.stroke()
      this.isPaint = true
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
      this.objects[0].splice(1,1, mouseX - this.dx)
      this.objects[0].splice(2,1,mouseY - this.dy)
      this.drawObjects(this.context)
    }
    if (this.canvasMode === 'drag'){
      for (let i = 0; i < this.objects.length; i++) {
        let player = this.objects[i]
        // マウスがオブジェクト上にあるか判定
        let dx = player[1] - mouseX
        let dy = player[2] - mouseY
        if (dx**2 + dy**2 < this.objRadius**2) {
          this.canvas!.style.cursor = 'move'
          return
        }
      }
    } else if(this.isPaint){
      this.paintCanvasContext?.lineTo(mouseX, mouseY)
      this.paintCanvasContext?.stroke()
    }
    this.canvas!.style.cursor = 'default'
  }

  mouseUp() {
    if (this.isDrag) {
      this.historyList.splice(0,this.undoIndex - 1)
      this.historyList.unshift(JSON.parse(JSON.stringify(this.objects)))
      this.undoIndex = 1
      localStorage.setItem('undoIndex', this.undoIndex.toString())
      this.isDrag = false
      localStorage.setItem('historyList', JSON.stringify(this.historyList))
    }
    if (this.isPaint){
      this.paintCanvasContext?.closePath()
      this.isPaint = false
    }
    this.updateDummyImage()
  }

  updateDummyImage () {
    this.drawBoardImage(this.dummyCanvasContext)
    this.drawObjects(this.dummyCanvasContext, false)
    this.dlLink!.href = this.dummyCanvas?.toDataURL() as string
  }

  undo () {
    this.objects = JSON.parse(JSON.stringify(this.historyList[this.undoIndex]))
    this.drawObjects(this.context)
    this.undoIndex += 1
    localStorage.setItem('undoIndex', this.undoIndex.toString())
    this.updateDummyImage()
  }

  get isUndo () {
    return this.historyList.length <= this.undoIndex
  }

  drawBoardImage (context: CanvasRenderingContext2D | null) {
    context?.drawImage(this.image, 0, 105,1920,975,0,0,1920,975)
  }

  mounted() {
    const userAgent = navigator.userAgent;
    if(userAgent.indexOf('iPhone') > 0 || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0 || userAgent.indexOf('iPad') > 0){
      this.device = 'mobile'
    } else {
      this.device = 'desktop'
    }

    this.container = document.querySelector<HTMLElement>('#canvas-container')
    this.canvas = document.querySelector<HTMLElement>('#objects-canvas') as HTMLCanvasElement
    this.baseCanvas = document.querySelector<HTMLElement>('#base-canvas') as HTMLCanvasElement
    this.dummyCanvas = document.querySelector<HTMLElement>('#dummy-canvas') as HTMLCanvasElement
    this.paintCanvas = document.querySelector<HTMLElement>('#paint-canvas') as HTMLCanvasElement

    const containerWidth = <number>this.container?.clientWidth
    const containerHeight = <number>this.container?.clientHeight

    this.context = this.canvas.getContext('2d')
    this.canvas.width = containerWidth
    this.canvas.height = containerHeight

    this.baseCanvasContext = this.baseCanvas.getContext('2d')
    this.baseCanvas.width = containerWidth
    this.baseCanvas.height = containerHeight

    this.dummyCanvasContext = this.dummyCanvas.getContext('2d')
    this.dummyCanvas.width = containerWidth
    this.dummyCanvas.height = containerHeight

    this.paintCanvasContext = this.paintCanvas.getContext('2d')
    this.paintCanvas.width = containerWidth
    this.paintCanvas.height = containerHeight

    let width = this.canvas.clientWidth
    this.image.src = "image/futtech_board.png"
    this.image.onload = () => {

      this.scale = width / this.image.width
      this.imageScale = this.scale
      this.context?.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      this.baseCanvasContext?.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      this.dummyCanvasContext?.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      this.paintCanvasContext?.setTransform(this.scale, 0, 0, this.scale, 0, 0)
      this.drawBoardImage(this.baseCanvasContext)
      const savedHistoryList: string | null = localStorage.getItem('historyList')
      if (savedHistoryList){
        this.historyList = JSON.parse(savedHistoryList)
        this.undoIndex = Number(localStorage.getItem('undoIndex'))
        this.objects = JSON.parse(JSON.stringify(this.historyList[this.undoIndex - 1]))
        this.drawObjects(this.context)
      } else{
        this.drawObjects(this.context)
        this.historyList.unshift(JSON.parse(JSON.stringify(this.objects)))
      }
      this.dlLink = document.querySelector('#download')
      this.dlLink!.download = "フットテック";
    }

    window.onresize = () => {
      this.scale = (this.canvas as HTMLElement).clientWidth / this.image.width
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

canvas {
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

#objects-canvas{
  z-index: 3;
}

#base-canvas{
  z-index: 1;
}

#paint-canvas{
  z-index: 2;
}

#dummy-canvas{
  z-index: -1;
}
</style>
