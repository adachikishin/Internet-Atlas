// 獲取 HTML 中要放入卡片的容器
const photos = document.querySelector(".photos");
const pages = document.querySelectorAll(".pages");
const dropdowns = document.querySelectorAll(".dropdown-button");
const modal = document.querySelector(".item-modal");
let originalData = [];
let displayData = [];

const maxItemCount = 4;
let page = 1;
let maxPageCount = 2;
let filters = [0, 0, 0];

const columns = 4;

window.addEventListener('click', (event) => {
    dropdowns.forEach(dropdown => {
        console.log('click')
        if (dropdown.contains(event.target)) {
            openDropdown(dropdown);
        }
        else {
            closeDropdown(dropdown);
        }
    })
});

// 異步讀取資料的函式
async function loadJSON() {
    try {
        // 1. 發送請求取得 JSON 檔案
        const response = await fetch('data.json');
        
        // 檢查請求是否成功
        if (!response.ok) throw new Error('無法讀取資料檔');
        
        // 2. 解析 JSON 轉成 JS 物件/陣列
        const items = await response.json();

        // 3. 處理資料
        originalData = items;
        filter();
        
    } catch (error) {
        console.error('發生錯誤:', error);
        photos.innerHTML = '<p>資料載入失敗，請稍後再試。</p>';
    }
}

function filter() {
    if (filters.reduce((accumulator, currentValue) => accumulator + currentValue, 0) == 0) {
        displayData = originalData;
    }
    maxPageCount = Math.ceil(displayData.length / maxItemCount);
    page = 1;
    render();
}

function render() {
    photos.innerHTML = '';
    const start = (page - 1) * maxItemCount;
    const end = start + maxItemCount;
    const itemsToRender = displayData.slice(start, end);
    itemsToRender.forEach(item => {
        const button = document.createElement('button');
        button.dataset.id = item.id;
        button.className = 'openModalBtn';
        button.addEventListener('click', function() {
            const img = modal.querySelector('img');
            const sec = modal.querySelector('sec');
            const name = modal.querySelector('.name');
            img.src = item.url;
            name.innerHTML = item.name;
            modal.showModal();
        });

        const photo = document.createElement('img');
        photo.src = item.url;
        photo.alt = item.name;
        photo.className = 'preview';

        button.appendChild(photo);
        photos.append(button);
    })
}

function openDropdown(element) {
    element.classList.toggle('is-open');
    const isOpen = element.classList.contains('is-open');

    const list = element.nextElementSibling;
    const options = list.querySelectorAll('.dropdown-option');
    
    let i = 0, j = 0; 
    if (isOpen) {
        list.style.left = '100px';
        options.forEach(option => {
            option.style.top = (60 * i) + 'px';
            option.style.left = (100 * j) + 'px';
            j++;
            j %= columns;
            if (j == 0) {
                i++;
            }
        });
    }
    else {
        list.style.left = '0px';
        options.forEach(option => {
            option.style.top = '0px';
            option.style.left = '0px';
        });
    }
}

function closeDropdown(element) {
    const isOpen = element.classList.contains('is-open');

    if (isOpen) {
        element.classList.toggle('is-open');
        const list = element.nextElementSibling;
        const options = list.querySelectorAll('.dropdown-option');
        list.style.left = '0px';
        options.forEach(option => {
            option.style.top = '0px';
            option.style.left = '0px';
        });
    }
}

function filterBtn(element) {
    element.classList.toggle('select');
}

function nextPage(){
    if (page < maxPageCount) {
        page++;
        pageDisplay();
        render();
    }
}
function lastPage(){
    if (page > 1) {
        page--;
        pageDisplay();
        render();
    }
}
function pageDisplay(){
    const pages = document.querySelectorAll(".pages");
    pages.forEach(e => {
        e.innerText = page + "/" + maxPageCount;
    });
}

function init(){
    modal.addEventListener('click', (event) => {
        // 取得點擊位置
        const rect = modal.getBoundingClientRect();
        // 判斷範圍
        const isInDialog = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        if (!isInDialog) {
            modal.close();
        }
    });
    pageDisplay();
    loadJSON();
}

init();