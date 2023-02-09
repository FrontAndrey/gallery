const sortSize = document.querySelector('.size-img')
const sortCategory = document.querySelector('.category-img')
const sortDate = document.querySelector('.date-img')
const sortName = document.querySelector('.name-img')
const reset = document.querySelector('.reset-gallery')
let cardArray = localStorage.getItem('card') ? JSON.parse(localStorage.getItem('card')) : [];

//Прелоад
window.onload = function () {
    document.body.classList.add('loaded_hiding');
    window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
    }, 500);
}

//Получение данных с сервера
const cards = document.querySelector('.cards')
fetch('http://contest.elecard.ru/frontend_data/catalog.json')
    .then((response) => response.json())
    .then((data) => {
        renderItems(data);
    })
    .catch((error) => {
        console.log(error);
    })

//Рендер дата-значений, для создания карточки товара
let renderItems = (data) => {
    data.forEach(({
        filesize,
        timestamp,
        category,
        image
    }) => {

        // Создаем карточку по верстке для автозаполнения 
        const elem = document.createElement('div');
        elem.classList.add('card')

        //Перевод даты
        let time = new Date(timestamp).toLocaleDateString("en-US")

        //Перерисовка карточек
        elem.innerHTML = `
            <div class="card-header">
                <img src="${'http://contest.elecard.ru/frontend_data/' + image}" alt="..." class="card-image">
                
            </div>
            <div class="card-body">
                <p class="card-data">${time}</p>
                <p class='card-category'>${category}</p>
            </div>
            <div class='size'>${filesize}</div>
            <button class="close">&times;</button>
            `

        //Добавляем карточку в конец списка
        cards.append(elem)

        //Удаление карточки
        elem.addEventListener('click', (e) => {
            const btn = e.target.closest('.close');
            if (!btn) {
                return
            }
            btn.parentElement.remove()
            const elemItem = {
                image,
                category,
                filesize,
                time
            }
            cardArray.push(elemItem)
            localStorage.setItem('card', JSON.stringify(cardArray))
        })
    });

    //сортировка по дате
    sortDate.addEventListener('click', () => {
        cards.innerHTML = ''
        data.sort(function (a, b) {
            return a.timestamp - b.timestamp
        })
        renderItems(data)
    })

    //сортировка по категории
    sortCategory.addEventListener('click', () => {
        cards.innerHTML = ''
        data.sort(function (a, b) {
            return a.category - b.category
        })
        data.reverse()
        renderItems(data)
    })

    //сортировка по размеру
    sortSize.addEventListener('click', () => {
        cards.innerHTML = ''
        data.sort(function (a, b) {
            return b.filesize - a.filesize
        })
        renderItems(data)
    })
}

//Обновление страницы с карточками
reset.addEventListener('click', () => {
    localStorage.clear()
    location.reload();
})