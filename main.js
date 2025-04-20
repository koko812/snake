/**
2 * @type {CanvasRenderingContext2D}
3 */

let ctx = null
let gameover = false
let score = 0
let dscore = 1
let ddscore = 1

const size = 300
const initiallength = 50
const snakePositionList = []
const extentionLength = 100 
const snakeWidth = 5
let snakeSpeed = 0.8
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

    for(let i = 0; i < snakePositionList.length; i++){
        if (gameover) {
            ctx.fillStyle = '#f00'
        } else {
            ctx.fillStyle = `hsl(${120 - ( snakePositionList.length - i )*2}deg, 100%,50%)` 
        }
        // とてもいい感じに進められている
        // あとは，目をつけるのと，スコア表示だねえ
        // その辺も全然慣れていないので難しそうなんだが，今後のゲームにはすごく生きてきそう
        // 故に実装の練習をしておきたい,という話が存在している
        // とは言え，なんで，length から引き算をしたら，色の頭が固定されるというのかが，
        // いまいちわかってない説がある 
        // ので，その辺は後でもいいから理解しておきたい説がある
            
        // やっぱり，shiftは 頭を消してるらしいので，（配列の）
        // けつから描画してるっぽい，まあだとしたら，＾の描画の仕組みは納得いく
        // で， mx, my もどんどんけつに追加していってるので，やり方としては正しいのがわかる
        // まあなんで逆に処理して言ってるのかは謎なんだけど，多分， shift とか unshift を使いたいからなんだろうと思っとこう
        // つまるところ，mx,my の座標は戦闘（蛇の）を示していると考えるのは正しい

        const [x,y] = snakePositionList[i]
        ctx.beginPath()
        ctx.arc(x, y, snakeWidth, 0, Math.PI * 2)
        ctx.fill()
        
        const lex = mx + Math.cos(( angle - 60 )/180 * Math.PI) * (snakeWidth * 0.6)
        const ley = my + Math.sin(( angle - 60 )/180 * Math.PI) * (snakeWidth * 0.6)
        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.arc(lex, ley, snakeWidth*0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.arc(lex, ley, snakeWidth*0.3, 0, Math.PI * 2)
        ctx.fill()

        const rex = mx + Math.cos(( angle + 60 )/180 * Math.PI) * (snakeWidth * 0.6)
        const rey = my + Math.sin(( angle + 60 )/180 * Math.PI) * (snakeWidth * 0.6)
        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.arc(rex, rey, snakeWidth*0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.arc(rex, rey, snakeWidth*0.3, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx.fillStyle = `hsl(${Math.random()*360}deg, 100%, 50%)`
    ctx.beginPath()
    ctx.arc(fx, fy, snakeWidth, 0, Math.PI*2)
    ctx.fill()

    document.getElementById('score').textContent = `Score: ${score}`
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

        // だいぶといい感じに実装が進んできた
        // あとやるべきは，まあスコア表示は当たり前なんだけど，
        // 伸びる時に効果音があれば面白いかもなとかちょっと思ったかもしれない

        // 再起動したら，かなり動きの速さが戻ったのでいいと思う
        // が，これ遅くなるたびに再起動したりするのは面倒すぎるので，どうにかならんもんか
        // あと，キーボード操作も追加しないとね，
        // なかなかに，過去最高級のクオリティにはなっている気がする
        // これを python の pyxel みたいなやつでも同じように実装できれば
        // 嬉しいという話だよな,普通に４方向移動だと，ゲーム性的に難しくなりそうで，
        // そこに関してもちょっとだけ興味がある

        // こんだけコメントがガンガン残るのはみづらいので，やっぱり dev ブランチは作ったほうがいいかもしれない

        const lastPos = snakePositionList[0]
        for(let i = 0; i < extentionLength; i++){
            snakePositionList.unshift(lastPos)
        }
        score += 50
        dscore += ddscore;
        ddscore ++;
        snakeSpeed += 0.1
        // 蛇のスピードが上がっていくのも楽しいかもしれない
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
    let cnt = 0
    while (true) {
        cnt ++;
        if(cnt%10 == 0){
            score+=dscore;
        }
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