// 活動資料庫 (已更新慕道班連結，並歸類至社區活動)
const events = [
  { 
    date: '08/17', 
    displayDate: '08/17（一）～08/21（五）', 
    title: '暑假舊約速讀營', 
    category: '', 
    status: '報名中', 
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSeddLvFsrpR7lhVB3WGsAhx-EBK5Q19LiDRXFqF8Sxvn0_fFw/viewform',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    date: '08/17', 
    displayDate: '08/17（一）～08/21（五）', 
    title: '《曠野歷險記》兒童/青年探索營', 
    category: '', 
    status: '報名中', 
    link: 'https://docs.google.com/forms/d/e/1FAIpQLScwI9evewatMx8ZKoSzPCBIU3zPpvfBHnGs4LHCe4JeAcDdYw/viewform',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
  },
  { 
    date: '09/06', 
    displayDate: '9月6日（日）', 
    title: '慕道班', 
    category: '', 
    status: '報名中', 
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSfz2H0bjkg34xP-llD0RzeOsYkrX0HQFZBvGx8ayVuoRxKWVQ/viewform', // 已填入報名連結
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80'
  },
  { 
    date: '09/13', 
    displayDate: '9/13 主日 12：30～1：00 (601教室)', 
    title: '新家人班', 
    category: '', 
    status: '報名中', 
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSdSJp39gKAKkD82Pppb9wc3X-Ar5bwvPOr1cCwxK2zypoGupg/viewform',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  },
  { 
    date: '09/20', 
    displayDate: '9月20日 早上 8：30 (教會七樓)', 
    title: '受浸聖餐聚會', 
    category: '', 
    status: '報名中', 
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSfz2H0bjkg34xP-llD0RzeOsYkrX0HQFZBvGx8ayVuoRxKWVQ/viewform',
    image: 'https://images.unsplash.com/photo-1574957973698-418ac4c877af?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  { 
    date: '09/01', 
    displayDate: '線上旁聽', 
    title: '撒母耳學校線上旁聽報名', 
    category: '門徒訓練', 
    status: '報名中', 
    link: 'https://docs.google.com/forms/d/e/1FAIpQLScqaOiwUNbGVEahlImKNj5tf_2aZ0GT_yGQluPk36dJn_vcyw/viewform',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  }
];

// 取得今天日期與今年年份
const today = new Date();
today.setHours(0, 0, 0, 0);
const currentYear = today.getFullYear();

const container = document.getElementById('event-container');
const categoryButtons = document.querySelectorAll('#category-filter button');

// 渲染畫面的主函式
function renderEvents(selectedCategory = '全部') {
  const filteredEvents = events
    .filter(event => {
      const eventDate = new Date(`${currentYear}/${event.date}`);
      const isNotExpired = eventDate >= today;
      
      let matchesCategory = false;
      if (selectedCategory === '全部') {
        matchesCategory = true;
      } else if (Array.isArray(event.category)) {
        matchesCategory = event.category.includes(selectedCategory);
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
    if (event.status === '報名中') badgeClass = 'bg-dark text-white';

    return `
    <div class="col-md-4">
      <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-hover bg-white">
        <img src="${event.image}" class="card-img-top card-cover-img" alt="${event.title}">
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

// 綁定分類按鈕點擊事件
categoryButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    categoryButtons.forEach(btn => {
      btn.classList.remove('btn-dark', 'text-white', 'shadow-sm');
      btn.classList.add('btn-light', 'text-muted');
    });

    e.target.classList.remove('btn-light', 'text-muted');
    e.target.classList.add('btn-dark', 'text-white', 'shadow-sm');

    const selectedCat = e.target.getAttribute('data-category');
    renderEvents(selectedCat);
  });
});

// 預設顯示全部
renderEvents('全部');