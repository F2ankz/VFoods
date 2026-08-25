// Renders NEWS_ITEMS (news-data.js) into the #news-cards grid on news.html.
// Update news-data.js to change what shows here — this file never needs editing.
(function () {
  var mount = document.getElementById('news-cards');
  if (!mount || typeof NEWS_ITEMS === 'undefined') return;

  NEWS_ITEMS.forEach(function (item) {
    var card = document.createElement(item.link ? 'a' : 'div');
    card.className = 'news-h-card';
    if (item.link) {
      card.href = item.link;
      card.target = '_blank';
      card.rel = 'noopener';
    }

    if (item.img) {
      var img = document.createElement('img');
      img.className = 'news-h-thumb';
      img.alt = '';
      img.src = item.img;
      img.onerror = function () {
        var ph = document.createElement('div');
        ph.className = 'news-h-thumb-ph';
        ph.textContent = item.tag || 'NEWS';
        img.replaceWith(ph);
      };
      card.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'news-h-thumb-ph';
      ph.textContent = item.tag || 'NEWS';
      card.appendChild(ph);
    }

    var body = document.createElement('div');
    body.className = 'news-h-body';

    var tagEl = document.createElement('span');
    tagEl.className = 'news-h-tag';
    tagEl.textContent = item.tag || '';
    body.appendChild(tagEl);

    var titleEl = document.createElement('div');
    titleEl.className = 'news-h-title';
    titleEl.textContent = item.title || '';
    body.appendChild(titleEl);

    var dateEl = document.createElement('div');
    dateEl.className = 'news-h-date';
    dateEl.textContent = item.date || '';
    body.appendChild(dateEl);

    card.appendChild(body);
    mount.appendChild(card);
  });
})();
