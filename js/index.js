// 獲取 HTML 中要放入卡片的容器
const container = document.querySelector(".photos")

// 異步讀取資料的函式
async function loadJSON() {
    try {
        // 1. 發送請求取得 JSON 檔案
        const response = await fetch('data.json');
        
        // 檢查請求是否成功
        if (!response.ok) throw new Error('無法讀取資料檔');
        
        // 2. 解析 JSON 轉成 JS 物件/陣列
        const items = await response.json();

        // 3. 呼叫渲染函式
        render(items);
        
    } catch (error) {
        console.error('發生錯誤:', error);
        galleryContainer.innerHTML = '<p>資料載入失敗，請稍後再試。</p>';
    }
}

function render(items) {
    items.stone.forEach(item => {
        const photo = document.createElement("img");
        photo.src = item.url;
        photo.alt = item.name;
        container.append(photo);
    });
}

loadJSON();