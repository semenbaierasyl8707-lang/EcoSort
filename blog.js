/* Комментарии: добавляются на странице и сохраняются в браузере (localStorage).
   Это учебный вариант без сервера. Для настоящего сайта нужен backend. */
const form  = document.getElementById('commentForm');
const list  = document.getElementById('list');
const count = document.getElementById('count');
const KEY   = 'eco-blog-comments';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}
function save(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
}

function render(items) {
  count.textContent = '(' + items.length + ')';
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<li class="empty">Пока нет комментариев — будьте первым.</li>';
    return;
  }
  items.forEach(c => {
    const li = document.createElement('li');
    // textContent защищает от вставки HTML в комментарии
    const b = document.createElement('b');    b.textContent = c.name;
    const t = document.createElement('time'); t.textContent = c.date;
    const p = document.createElement('p');    p.textContent = c.text;
    li.append(b, t, p);
    list.append(li);
  });
}

let items = load();
render(items);

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  items.unshift({
    name: data.get('name').trim(),
    text: data.get('text').trim(),
    date: new Date().toLocaleDateString('ru-RU')
  });
  save(items);
  render(items);
  form.reset();
});
