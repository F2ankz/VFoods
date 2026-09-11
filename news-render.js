// Renders the 3 current stories (news/news-index.js) into the #news-cards grid on news.html.
// Each card links to news-article.html?id=<slug> — the full story page with all its photos.
// Update news via admin/news-admin.html; this file never needs editing.
(function () {
  var mount = document.getElementById('news-cards');
  if (!mount || typeof window.NEWS_INDEX === 'undefined') return;

  var items = (window.NEWS_INDEX.current || []).slice(0, 3);

  items.forEach(function (item) {
    var card = document.createElement('a');
    card.className = 'news-h-card';
    card.href = 'news-article.html?id=' + encodeURIComponent(item.slug);

    var shots = 1 + ((item.images && item.images.length) || 0);

    if (item.cover) {
      var thumbWrap = document.createElement('div');
      thumbWrap.className = 'news-h-thumb-wrap';

      var img = document.createElement('img');
      img.className = 'news-h-thumb';
      img.alt = '';
      img.src = item.cover;
      img.onerror = function () { img.replaceWith(placeholder(item)); };
      thumbWrap.appendChild(img);

      if (shots > 1) {
        var count = document.createElement('span');
        count.className = 'news-h-count';
        count.textContent = '🖼 ' + shots + ' รูป';
        thumbWrap.appendChild(count);
      }
      card.appendChild(thumbWrap);
    } else {
      card.appendChild(placeholder(item));
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

    if (item.text) {
      var textEl = document.createElement('p');
      textEl.className = 'news-h-text';
      textEl.textContent = item.text;
      body.appendChild(textEl);
    }

    var foot = document.createElement('div');
    foot.className = 'news-h-foot';

    var dateEl = document.createElement('span');
    dateEl.className = 'news-h-date';
    dateEl.textContent = item.date || '';
    foot.appendChild(dateEl);

    var more = document.createElement('span');
    more.className = 'news-h-more';
    more.textContent = 'อ่านข่าวเต็ม →';
    foot.appendChild(more);

    body.appendChild(foot);
    card.appendChild(body);
    mount.appendChild(card);
  });

  function placeholder(item) {
    var ph = document.createElement('div');
    ph.className = 'news-h-thumb-ph';
    ph.textContent = item.tag || 'NEWS';
    return ph;
  }
})();
