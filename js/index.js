// 獲取 HTML 中要放入卡片的容器
const photos = document.querySelector(".photos");
const pages = document.querySelectorAll(".pages");
let originalData = [];
let displayData = [];

const maxItemCount = 4;
let page = 1;
let maxPageCount = 2;
let filters = [0, 0, 0];

const columns = 4;

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

        const photo = document.createElement('img');
        photo.src = item.url;
        photo.alt = item.name;
        photo.className = 'preview';

        button.appendChild(photo);
        photos.append(button);
    })
}

function openDropdown(element) {
    const parent = element.parentNode;
    parent.classList.toggle('is-open');
    const isOpen = parent.classList.contains('is-open');

    const list = parent.querySelector('.dropdown-list')
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
function filterBtn(element) {
    element.classList.toggle('select');
    console.log(element);
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

pageDisplay();
loadJSON();