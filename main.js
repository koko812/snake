/**
2 * @type {CanvasRenderingContext2D}
3 */

let ctx = null
let gameover = false

const size = 300
const initiallength = 200
const snakePositionList = []
const extentionLength = 50 
const snakeWidth = 5
const snakeSpeed = 1
let angle = -90
let move = 0

let mx = size / 2;
let my = size / 2;

let fx = 0;
let fy = 0;

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

    if (gameover) {
        ctx.fillStyle = '#f00'
    } else {

        ctx.fillStyle = '#0f0'
    }
    for (const pos of snakePositionList) {
        const [x, y] = pos
        ctx.beginPath()
        ctx.arc(x, y, snakeWidth, 0, Math.PI * 2)
        ctx.fill()

    }

    ctx.fillStyle = `hsl(${Math.random()*360}deg, 100%, 50%)`
    ctx.beginPath()
    ctx.arc(fx, fy, snakeWidth, 0, Math.PI*2)
    ctx.fill()
}

const collisionCheck = () => {
    const data = ctx.getImageData(0, 0, size, size).data
    const tx = mx + Math.cos(angle / 180 * Math.PI) * (snakeWidth + 2)
    const ty = my + Math.sin(angle / 180 * Math.PI) * (snakeWidth + 2)
    const pix = data[Math.trunc(tx) * 4 + Math.trunc(ty) * 4 * size + 1]

    // mx がいまだに蛇のどこの座標なのかが曖昧だというアホっぷり
    if((mx -fx)**2+(my-fy)**2 < (snakeWidth*2+4)**2){
        fx = 0;
        // うまくは動いてるんだけど，なんでうまくいってるのかがわからない
        // けつにまるをどんどん追加していってるんだけど，それがなんで綺麗に追従してくれるのかがわからない
        // update の部分で，マイループ進む距離分を足し算してる処理が入ってる
        // まあつまりその処理のおかげで結構うまくいってるとかいう話だと思う
        // ループごとに頭を足して，お尻を消してってやってるのが大事っぽい，それで納得だね
        // 実際動いてるのは頭とお尻だけというのがわかっていれば，納得できるはず

        // あとまあ関係ないけど，キーボード操作は可能にしておきたいかもしれないという話
        // これもう最終的には，画面を埋め尽くすようにグネグネ動いて，
        // 一周するごとに餌をとっていくとかそういう感じになるのかもしれないな
        // 是非とも ai にやらせてみたいところ，javascript との連携をそう簡単にできるのかって話だけど
    
        // あとは色の変化なんだけど，そこの処理が普通にややこしそうでちょっとだけ萎えてる
        // 多分 render のところをいじるだけって話なんだろうけどね

        const lastPos = snakePositionList[0]
        for(let i = 0; i < extentionLength; i++){
            snakePositionList.unshift(lastPos)
        }
        return
    }

    if (mx - snakeWidth < 0 || size < snakeWidth + mx || my - snakeWidth < 0 || size < snakeWidth + my) {
        return true
        // mx とかがそのままだと，最初に生成した瞬間に死んでしまうので良くない
    } else if (pix != 0) {
        return true
    } else {
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
    if (collisionCheck()) {
        console.log('hit!!');
        gameover = true
    }
}

window.onload = async () => {
    init()
    while (true) {
        if (fx === 0){
            fx = Math.random()*(size-snakeWidth*2) + snakeWidth;
            fy = Math.random()*(size-snakeWidth*2) + snakeWidth;
        }
        update()
        render()
        await new Promise((r) => setTimeout(r, 10));
        if (gameover) {
            return
        }
    }
};