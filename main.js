/**
2 * @type {CanvasRenderingContext2D}
3 */

let ctx = null
let gameover = false

const size = 300
const initiallength = 200
const snakePositionList = []
const snakeWidth = 5
const snakeSpeed = 2
let angle = -90
let move = 0

let mx = size / 2;
let my = size / 2;

const init = () => {
    const canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    for (let i = 0; i < initiallength; i++) {
        snakePositionList.push([mx, my])
    }

    document.getElementById('left').onpointerdown = (e) => {
        e.preventDefault()
        move = -1
    }

    document.getElementById('right').onpointerdown = (e) => {
        e.preventDefault()
        console.log('left');
        move = 1
    }

    document.onpointerup = (e) => {
        e.preventDefault()
        move = 0
    }
};

const render = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = '#0f0'
    for (const pos of snakePositionList) {
        const [x, y] = pos
        ctx.beginPath()
        ctx.arc(x, y, snakeWidth, 0, Math.PI * 2)
        ctx.fill()
        if(collisionCheck()){
            console.log('hit!!');
            gameover = true
        }
        if(gameover){
            ctx.fillStyle = '#f00'
        }
        
    }
}

const collisionCheck = () => {
    const data = ctx.getImageData(0,0,size,size).data
    const tx = mx + Math.cos(angle / 180 * Math.PI) * (snakeWidth + 2)
    const ty = my + Math.sin(angle / 180 * Math.PI) * ( snakeWidth + 2 )
    const pix = data[Math.trunc( tx )*4+Math.trunc( ty )*4*size+1]

    if( mx - snakeWidth  < 0 || size < snakeWidth + mx || my - snakeWidth  < 0 || size < snakeWidth + my ){
        return true
    // mx とかがそのままだと，最初に生成した瞬間に死んでしまうので良くない
    }else if(pix != 0){
        return true
    }else{
        return false
    }
}

const update = () => {
    angle += move * 5
    mx += Math.cos(angle * Math.PI / 180) * snakeSpeed
    my += Math.sin(angle * Math.PI / 180) * snakeSpeed

    console.log(move);
    console.log(angle)
    snakePositionList.push([mx, my])
    snakePositionList.shift()
}

window.onload = async () => {
    init()
    while (true) {
        render()
        update()
        await new Promise((r) => setTimeout(r, 10));
        if (gameover) {
            return
        }
    }
};