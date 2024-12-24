import * as PIXI from './pixi.mjs'

window.addEventListener('DOMContentLoaded', async () => {
    const app = new PIXI.Application()

    await app.init({
        width: innerWidth,
        height: innerHeight,
    })

    document.body.appendChild(app.canvas)

    let isGameOver = false

    const backgroundAsset = await PIXI.Assets.load("./assets/background.png")
    const landscapeBackgroundAsset = await PIXI.Assets.load("./assets/landscapeBackground.png")
    const lineAsset = await PIXI.Assets.load("./assets/line.png")
    const landscapeLineAsset = await PIXI.Assets.load("./assets/landscapeLine.png")
    const phonesAsset = await PIXI.Assets.load("./assets/typeMobile1.png")
    const crackedPhoneAsset = await PIXI.Assets.load("./assets/typeMobile1_2.png")
    const brokenPhoneAsset = await PIXI.Assets.load("./assets/typeMobile1_3.png")
    const timeAsset = await  PIXI.Assets.load("./assets/time.png")
    const missAsset = await PIXI.Assets.load("./assets/miss.png")
    const scoreAsset = await PIXI.Assets.load("./assets/score.png")
    const gameOverAsset = await PIXI.Assets.load("./assets/gameOver.png")

    function makeLayout() {
        app.stage.removeChildren()
        const isLandscape = innerWidth > innerHeight
        let aspectRatio = isLandscape ? innerHeight / innerWidth : innerWidth / innerHeight

        //Задний фон
        let background = new PIXI.Sprite(!isLandscape ? backgroundAsset : landscapeBackgroundAsset)
        background.anchor.set(0.5)
        background.width = innerWidth
        background.height = innerHeight
        background.x = innerWidth / 2
        background.y = innerHeight / 2
        app.stage.addChild(background)

        //Линия разделяющая игровую зону и не игровую
        let line = new PIXI.Sprite(!isLandscape ? lineAsset : landscapeLineAsset)
        line.scale.set(!isLandscape ? aspectRatio * 1.6 : aspectRatio * 1.6)
        line.y = !isLandscape ? innerHeight * 0.2 : innerHeight * 0.2
        app.stage.addChild(line)

        //Таймер(изображение)
        let time = new PIXI.Sprite(!isLandscape ? timeAsset : timeAsset)
        time.anchor.set(0.5)
        time.scale.set(!isLandscape ? aspectRatio * 1.6 : aspectRatio * 1.6)
        time.x = !isLandscape ? innerWidth * 0.13 : innerWidth * 0.08
        time.y = !isLandscape ? innerHeight * 0.05 : innerHeight * 0.15
        app.stage.addChild(time)

        //Таймер(текст)
        let timerText = new PIXI.Text("1:00", {
            fill: 0xffffff,
            fontFamily: 'SF Pro Rounded',
            fontSize: '32'
        });
        timerText.anchor.set(0, 0.5)
        timerText.scale.set(!isLandscape ? aspectRatio * 2 : aspectRatio * 2)
        timerText.x = time.x + time.width / 2 + 5
        timerText.y = time.y
        app.stage.addChild(timerText)

        //Промахи(изображение)
        let miss = new PIXI.Sprite(!isLandscape ? missAsset : missAsset)
        miss.anchor.set(0.5)
        miss.scale.set(!isLandscape ? aspectRatio * 1.6 : aspectRatio * 1.6)
        miss.x = !isLandscape ? innerWidth * 0.13 : innerWidth / 2
        miss.y = !isLandscape ? innerHeight * 0.11 : innerHeight * 0.15
        app.stage.addChild(miss)

        //Контейнер с жизнями
        const livesContainer = new PIXI.Container()
        livesContainer.scale.set(!isLandscape ? aspectRatio * 2 : aspectRatio * 2)
        livesContainer.y = miss.y + miss.height * 0.1
        livesContainer.x = miss.x + miss.width * 0.75
        app.stage.addChild(livesContainer)


        // Количество жизней
        let lives = 3
        const livesSprite = []
        function addLives() {
            for (let i = 0; i < lives; i++) {
                const lifeSprite = new PIXI.Sprite(!isLandscape ? phonesAsset : phonesAsset)
                lifeSprite.anchor.set(0.5);
                lifeSprite.width = !isLandscape ? innerWidth * 0.04 : miss.width * 0.25
                lifeSprite.height = !isLandscape ? miss.height * 1.2 : miss.height * 1.5
                lifeSprite.x = i * (lifeSprite.width + 5);
                lifeSprite.y = 0;
                livesContainer.addChild(lifeSprite)
                livesSprite.push(lifeSprite)
            }
        }
        addLives()

        //Счетчик очков(изображение)
        let score = new PIXI.Sprite(!isLandscape ? scoreAsset : scoreAsset)
        score.anchor.set(0.5)
        score.scale.set(!isLandscape ? aspectRatio * 1.6 : aspectRatio * 1.6)
        score.x = !isLandscape ? innerWidth * 0.16 : innerWidth * 0.85
        score.y = !isLandscape ? innerHeight * 0.17 : innerHeight * 0.15
        app.stage.addChild(score)

        //Счетчик очков(сам счетчик)
        let scoreCounter = 0
        const scoreText = new PIXI.Text(scoreCounter.toString(), {
            fill: 0xffffff,
            fontFamily: 'SF Pro Rounded',
            fontSize: '32'
        })
        scoreText.anchor.set(0, 0.5)
        scoreText.scale.set(!isLandscape ? aspectRatio * 2 : aspectRatio * 2)
        scoreText.x = score.x + score.width / 2 + 5
        scoreText.y = score.y
        app.stage.addChild(scoreText)

        //Границы игровой зоны
        let gameArea = new PIXI.Sprite(!isLandscape ? backgroundAsset : landscapeBackgroundAsset)
        gameArea.anchor.set(0.5)
        gameArea.scale.set(aspectRatio)
        const gameAreaHeight = innerHeight - line.y
        gameArea.width = innerWidth
        gameArea.height = gameAreaHeight
        gameArea.x = innerWidth / 2
        gameArea.y = innerHeight - gameAreaHeight / 2 + 5
        app.stage.addChild(gameArea)

        let activeTargets = []

        // Функция отвечающая за появление мишеней
        function spawnTarget(numberOfTargets = 5) {
            if (activeTargets.length > 0) return

            const selectedTexture = window.selectedTexture
            console.log("Selected texture used:", selectedTexture);

            const targetTextures = [
                selectedTexture,
                crackedPhoneAsset,
                brokenPhoneAsset
            ];

            for (let i = 0; i < numberOfTargets; i++) {
                const target = new PIXI.Sprite(targetTextures[0])
                target.scale.set(!isLandscape ? aspectRatio * 2 : aspectRatio * 1.6)
                target.width = !isLandscape ? innerWidth * 0.065 : innerWidth * 0.04
                target.height = !isLandscape ? innerHeight * 0.075 :innerHeight * 0.15

                // Появление мишеней в рандомных местах
                const gameAreaX = gameArea.x;
                const gameAreaY = gameArea.y;
                const gameAreaWidth = gameArea.width;
                const gameAreaHeight = gameArea.height;


                target.x = gameAreaX - gameAreaWidth / 2 + Math.random() * gameAreaWidth;
                target.y = gameAreaY - gameAreaHeight / 2 + Math.random() * (gameAreaHeight - target.height);
                target.angle = Math.random() * Math.PI * 2
                target.speed = 2
                target.vx = Math.random() * 4 - 2
                target.vy = Math.random() * 4 - 2

                target.clickCount = 0;

                app.stage.addChild(target)
                activeTargets.push(target)

                target.interactive = true
                target.buttonMode = true

                // Движение мишеней
                const movementTicker = app.ticker.add(() => {
                    if (!target.parent) {
                        app.ticker.remove(movementTicker)
                        return
                    }
                    target.x += target.vx;
                    target.y += target.vy;

                    //Отталкивание от краев
                    if (target.x < gameAreaX - gameAreaWidth / 2 || target.x > gameAreaX + gameAreaWidth / 2 - target.width) {
                        target.vx *= -1; // Reverse horizontal velocity if hitting left or right boundary
                    }
                    if (target.y < gameAreaY - gameAreaHeight / 2 || target.y > gameAreaY + gameAreaHeight / 2 - target.height) {
                        target.vy *= -1; // Reverse vertical velocity if hitting top or bottom boundary
                    }
                })


                //Функция отвечающая за уничтожение мешеней
                target.on('pointerdown', () => {
                    target.clickCount++;
                    if (target.clickCount < targetTextures.length) {
                        target.texture = targetTextures[target.clickCount]
                    }

                    //Мишень уничтожается после 3 нажатий
                    if (target.clickCount >= 3) {
                        target.destroy();
                        const index = activeTargets.indexOf(target);
                        if (index > -1) activeTargets.splice(index, 1)

                        scoreCounter += 10
                        scoreText.text = scoreCounter.toString()
                    }
                })
            }
        }
        function showGameOver() {
            //Игра законцена
            isGameOver = true

            const gameOver = new PIXI.Sprite(gameOverAsset)
            const isLandscape = innerWidth > innerHeight
            let aspectRatio = isLandscape ? innerHeight / innerWidth : innerWidth / innerHeight
            gameOver.anchor.set(0.5)
            gameOver.scale.set(aspectRatio)
            gameOver.x = innerWidth / 2
            gameOver.y = innerHeight / 2 - 100
            app.stage.addChild(gameOver)

            gameOver.interactive = true
            gameOver.buttonMode = true
            gameOver.on('pointerdown', () => {
                isGameOver = false
                gameOver.destroy()

                lives = 3
                livesSprite.forEach(sprite => sprite.destroy())
                livesSprite.length = 0
                addLives()

                scoreCounter = 0
                scoreText.text = scoreCounter.toString()
                makeLayout()
            })

        }
        // Таймер логика
        let timeLeft = 60
        const timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;

                const minutes = Math.floor(timeLeft / 60)
                const seconds = timeLeft % 60
                timerText.text = `${minutes}:${seconds.toString().padStart(2, '0')}`
            } else {
                clearInterval(timerInterval)
                timerText.text = '0:00'
                showGameOver()
            }
        }, 1000);

        //listener отнимает здоровье если нажать на gameArea
        gameArea.interactive = true
        gameArea.on('pointerdown', (event) => {
            const clickedPoint = event.data.global; // Get the global position of the click

            // Check if the click is on any active target
            const clickedTarget = activeTargets.find(target => target.containsPoint(clickedPoint));

            if (!clickedTarget) {
                lives -= 1;

                // Remove a life indicator
                const lifeToRemove = livesSprite.pop();
                if (lifeToRemove) {
                    lifeToRemove.destroy();
                }

                // Trigger game over if lives run out
                if (lives <= 0) {
                    showGameOver();
                }
            }
        });

        //Спавн мишеней
        setInterval(spawnTarget, 2000)
    }


    makeLayout()
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        makeLayout()
    })

})