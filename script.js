const select = document.querySelector('#select-draw')
const selectedDraw = document.querySelector('#selected-draw')
const drawInformation = document.querySelector('.competition-number')
const numbersDrawn = document.querySelector('.numbers-drawn')

async function getDrawNames() {
  const response = await fetch('https://brainn-api-loterias.herokuapp.com/api/v1/loterias')
  const responseJson = await response.json()
  return responseJson
}

async function getDraws() {
  const response = await fetch('https://brainn-api-loterias.herokuapp.com/api/v1/loterias-concursos')
  const responseJson = await response.json()
  return responseJson
}

async function getDrawById(id) {
  const response = await fetch(`https://brainn-api-loterias.herokuapp.com/api/v1/concursos/${id}`)
  const responseJson = await response.json()
  return responseJson
}

function createOptions(drawName) {
  const option = document.createElement('option')
  option.innerText = drawName.nome
  option.value = drawName.id
  select.appendChild(option)
}

function createNumbers(number) {
  const drawNumber = document.createElement('p')
  drawNumber.innerText = number
  numbersDrawn.appendChild(drawNumber)
}

function setInfoDraw(draw) {
  draw.numeros.forEach(createNumbers)
  const dateApiStart = draw.data
  const dateStart = new Date(dateApiStart).toLocaleDateString()
  drawInformation.innerText = `${draw.id} ${dateStart}`
}

window.onload = async () => {
  const getNames = await getDrawNames()
  getNames.forEach(createOptions)
  selectedDraw.innerText = getNames[0].nome

  const drawsId = await getDraws()
  
  const findDraw = drawsId.find((drawId) => drawId.loteriaId === getNames[0].id)
  const drawById = await getDrawById(findDraw.concursoId)
  setInfoDraw(drawById)

  select.addEventListener('change', async () => {
    const findName = getNames.find((getName) => getName.id == select.value)
    selectedDraw.innerText = findName.nome
    
    const selectDraw = drawsId.find((drawId) => drawId.loteriaId == select.value)
    const getById = await getDrawById(selectDraw.concursoId)
    numbersDrawn.innerHTML = ''
    setInfoDraw(getById)

  })
}