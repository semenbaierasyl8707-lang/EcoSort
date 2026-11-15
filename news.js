const NEWS = [
  { cat: 'eco',       tag: '🍃 Экология',         date: '10.11.2026',
    title: 'В Алматы стартовала акция «Чистый город»',
    text:  'В рамках акции волонтёры очищают парки, улицы и дворы города.',
    img:   'images/park.jpg' },
  { cat: 'projects',  tag: '🏙 Городские проекты', date: '05.11.2026',
    title: 'В Алматы высадили более 10 000 деревьев',
    text:  'Зелёный город — здоровый город!',
    img:   'images/trees.jpg' },
  { cat: 'important', tag: '❗ Важное',            date: '01.11.2026',
    title: 'Новые контейнеры для раздельного сбора',
    text:  'Теперь сортировать отходы стало ещё проще!',
    img:   'images/bins.jpg' },
  { cat: 'events',    tag: '📅 События',           date: '28.10.2026',
    title: 'Эко-фестиваль пройдёт в городском парке',
    text:  'Мастер-классы, лекции и ярмарка местных эко-проектов.',
    img:   'images/festival.jpg' }
];
 
/* ---------- Элементы страницы ---------- */
const chips    = document.querySelectorAll('#chips .chip');
const featured = document.getElementById('featured');
const side     = document.getElementById('side');
 
let currentCat = 'all';
let slide = 0;                       // номер большой карточки
 
/* Новости выбранной категории */
function filtered() {
  return currentCat === 'all' ? NEWS : NEWS.filter(n => n.cat === currentCat);
}
 
/* ---------- Отрисовка ---------- */
function render() {
  const list = filtered();
 
  if (list.length === 0) {
    featured.hidden = true;
    side.innerHTML = '<p class="empty">В этой категории пока нет новостей.</p>';
    return;
  }
  featured.hidden = false;
 
  /* Большая карточка */
  const main = list[slide % list.length];
  featured.style.setProperty('--img', `url("${main.img}")`);
  featured.innerHTML = `
    <div class="featured__top">
      <span class="tag">${main.tag}</span>
      <span class="date">📅 ${main.date}</span>
    </div>
    <h2>${main.title}</h2>
    <p>${main.text}</p>
    <a href="#" class="btn">Читать подробнее →</a>
    <div class="dots" id="dots">
      ${list.map((_, i) =>
        `<button type="button" data-i="${i}" aria-label="Новость ${i + 1}"
                 class="${i === slide % list.length ? 'is-active' : ''}"></button>`).join('')}
    </div>`;
 
  /* Боковые карточки: две следующие после большой */
  const others = list.filter((_, i) => i !== slide % list.length).slice(0, 2);
  side.innerHTML = others.map(n => `
    <a href="#" class="card" style="--img:url('${n.img}')">
      <div class="card__img"></div>
      <div class="card__body">
        <div class="card__meta">
          <span class="tag">${n.tag}</span>
          <span class="date">📅 ${n.date}</span>
        </div>
        <h3>${n.title}</h3>
        <p>${n.text}</p>
        <span class="card__arrow">→</span>
      </div>
    </a>`).join('');
}
 
/* ---------- События ---------- */
 
/* Клик по чипу: меняем категорию */
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    currentCat = chip.dataset.cat;
    slide = 0;
    render();
  });
});
 
/* Клик по точке: показываем другую новость (делегирование событий) */
featured.addEventListener('click', e => {
  const dot = e.target.closest('[data-i]');
  if (!dot) return;
  slide = Number(dot.dataset.i);
  render();
});
 
/* Автопрокрутка каждые 6 секунд */
setInterval(() => {
  if (filtered().length > 1) { slide++; render(); }
}, 6000);
 
render();
 