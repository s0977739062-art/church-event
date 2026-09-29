// 取得今天日期與今年年份
const today = new Date();
today.setHours(0, 0, 0, 0);
const currentYear = today.getFullYear();

const container = document.getElementById('event-container');
const categoryButtons = document.querySelectorAll('#category-filter button');

// 💡 輔助函式：將 Google 雲端硬碟連結自動轉換為可直接顯示的圖片網址
function convertDriveUrl(url) {
  if (!url) return '';
  // 如果是 Google 雲端硬碟連結，轉換成直接顯示圖片的格式
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
}

// 渲染畫面的主函式
function renderEvents(eventsData, selectedCategory = '全部') {
  const filteredEvents = eventsData
    .filter(event => {
      const eventDate = new Date(`${currentYear}/${event.date}`);
      const isNotExpired = eventDate >= today;
      
      let matchesCategory = false;
      if (selectedCategory === '全部') {
        matchesCategory = true;
      } else {
        matchesCategory = (event.category === selectedCategory);
      }

      return isNotExpired && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(`${currentYear}/${a.date}`);
      const dateB = new Date(`${currentYear}/${b.date}`);
      return dateA - dateB;
    });

  if (filteredEvents.length === 0) {
    container.innerHTML = `<div class="col-12 text-muted py-4">目前這個分類沒有進行中的活動</div>`;
    return;
  }

  container.innerHTML = filteredEvents.map(event => {
    let badgeClass = 'bg-light text-dark border';
    if (event.status === '報名中' || event.status === '訂便當') badgeClass = 'bg-dark text-white';

    // 套用轉換後的圖片網址
    const imageUrl = convertDriveUrl(event.image);

    return `
    <div class="col-md-4">
      <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-hover bg-white">
        <img src="${imageUrl}" class="card-img-top card-cover-img" alt="${event.title}">
        <div class="card-body p-4 d-flex flex-column">
          <div class="mb-2">
            <span class="text-muted fw-semibold small">
              <i class="bi bi-calendar3 me-1"></i> ${event.displayDate}
            </span>
          </div>
          
          <h5 class="fw-bold mb-3">${event.title}</h5>
          
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="badge ${badgeClass} px-2 py-1 rounded-pill">${event.status}</span>
            <a href="${event.link}" target="_blank" class="text-dark text-decoration-none fw-bold small">
              立即報名 <i class="bi bi-arrow-right-short fs-5 align-middle"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

// 從 Google 試算表抓取資料並初始化
async function loadEventsFromSheet() {
  try {
    const sheetId = '1L2W695-pGvilvh6JMyYaJwxhm4QOpFxUG-VQUoFdCOQ';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    const response = await fetch(csvUrl);
    const csvText = await response.text();

    const lines = csvText.split('\n');
    const events = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const row = line.split(',').map(item => item.replace(/^"|"$/g, '').trim());

      if (row.length >= 7) {
        events.push({
          date: row[0],
          displayDate: row[1],
          title: row[2],
          category: row[3],
          status: row[4],
          link: row[5],
          image: row[6]
        });
      }
    }

    renderEvents(events, '全部');

    categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        categoryButtons.forEach(btn => {
          btn.classList.remove('btn-dark', 'text-white', 'shadow-sm');
          btn.classList.add('btn-light', 'text-muted');
        });

        e.target.classList.remove('btn-light', 'text-muted');
        e.target.classList.add('btn-dark', 'text-white', 'shadow-sm');

        const selectedCat = e.target.getAttribute('data-category');
        renderEvents(events, selectedCat);
      });
    });

  } catch (error) {
    console.error('讀取試算表失敗：', error);
    container.innerHTML = `<div class="col-12 text-danger py-4">無法載入活動資料，請稍後再試。</div>`;
  }
}

loadEventsFromSheet();