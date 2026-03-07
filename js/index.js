// 獲取 HTML 中要放入卡片的容器
const photos = document.querySelector(".photos");
let originalData = [];
let displayData = [];

const maxItemCount = 40;
let page = 0;
let maxPageCount = 0;
let filters = [0, 0, 0];;

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
    let max = maxItemCount;
    const start = page * maxItemCount;
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

loadJSON();