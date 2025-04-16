/**
2 * @type {CanvasRenderingContext2D}
3 */

let ctx = null

const size = 300
const initiallength = 150
const snakePositionList = []
const snakeWidth = 5
const snakeSpeed = 3
let angle = 0

let mx = size / 2;
let my = size / 2;

const init = () => {
    const canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    for (let i = 0; i < initiallength; i++) {
        snakePositionList.push([mx, my])
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
    }
}
// html 側の id = canvas が id = canvasjk になってて,
// 全然出てこなかったという悲劇

const update = () => {
    angle += 2
    mx += Math.cos(angle * Math.PI / 180) * snakeSpeed
    my += Math.sin(angle * Math.PI / 180) * snakeSpeed

    console.log(mx, my);
    snakePositionList.push([mx,my])
    snakePositionList.shift()
}

window.onload = async() => {
    init()
    while (true) {
        render()
        update()
        await new Promise((r) => setTimeout(r, 10));
    }
};