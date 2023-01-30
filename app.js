document.addEventListener("DOMContentLoaded", () =>{
    const grid = document.querySelector('.grid')

    let width = 10
    let squares = []
    let bombAmount = 15
    let flags = 0
    let isGameOver = false

    // criar a tabela de jogo

    function createBoard() {
        //criar o array das bombas
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('Valid')
        const gameArray = emptyArray.concat(bombsArray)
        const randomizerArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(randomizerArray[i])
            grid.appendChild(square)
            squares.push(square)

            // onClicks normais
            square.addEventListener('click', function(e) {
                onClick(square)
            })

            // onClick direito  para marcar flags
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlags(square)
            }
        }

        // adicionar numeros
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width -1)

            if (squares[i].classList.contains('Valid')) {
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total ++
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
                if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
                squares[i].setAttribute('data', total)
            }
        }
    }
    
    createBoard()

    // função de onClick e troca de estado

    function onClick(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {

            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one') 
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                if (total == 5) square.classList.add('five')
                if (total == 6) square.classList.add('six')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }

    //criar flags 

    function addFlags(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flags')) {
                square.classList.add('flag')
                square.innerHTML = "🚩"
                flags++
                checkForWin()
            }
        } 
        else {
            square.classList.remove('flag')
            square.innerHTML = ""
            flags--
        }
    }


    // ver se a casa está vazia e expandir

    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width -1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 -width].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId -width)].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 -width].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 +width].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 +width].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) +width].id
                const newSquare = document.getElementById(newId)
                onClick(newSquare)
            } 
        }, 50)
    }

    // verificar derrota

    function gameOver(square) {
        isGameOver = true

        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })
        alert('CABUMMMMMMM! Perdeste!')
    }

    // verificar vitória

    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
                if (matches === bombAmount) {
                    isGameOver = true
                    alert('Parabéns ganhaste!!')
                }
            }
        }
    }
})