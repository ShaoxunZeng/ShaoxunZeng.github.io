document.addEventListener('DOMContentLoaded', () => {
  fetch('papers/publications.json')
    .then(response => response.json())
    .then(papers => {
      renderPapers(papers.filter(paper => paper.status === 'preprint'), 'preprint-list');
      renderPapers(papers.filter(paper => paper.status !== 'preprint'), 'paper-list');
    })
    .catch(error => {
      console.error('Failed to load papers:', error);
      for (const id of ['preprint-list', 'paper-list']) {
        document.getElementById(id).innerHTML = '<p class="paper-list-error">Failed to load paper list.</p>';
      }
    });
});

function renderPapers(papers, containerId) {
  const grouped = {};
  papers.forEach(paper => {
    if (!grouped[paper.year]) {
      grouped[paper.year] = [];
    }
    grouped[paper.year].push(paper);
  });

  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

  sortedYears.forEach(year => {
    const yearHeader = document.createElement('h3');
    yearHeader.textContent = year;
    container.appendChild(yearHeader);

    const ul = document.createElement('ul');
    const papersByAuthorship = grouped[year].sort((a, b) =>
      Number(b.authors?.[0] === "Shaoxun Zeng") - Number(a.authors?.[0] === "Shaoxun Zeng")
    );
    papersByAuthorship.forEach(paper => {
      const item = document.createElement('li');

      // 高亮所有包含 "Shaoxun Zeng" 的作者名（大小写敏感匹配子串）
      const highlightedAuthors = paper.authors.map(name => {
        const author = name.includes("Shaoxun Zeng") ? `<span class="highlight">${name}</span>` : name;
        const marker = paper.equal_contribution?.includes(name)
          ? '<sup>*</sup>'
          : '';
        return author + marker;
      }).join(", ");

      const codeLink = paper.code ? ` <a href="${paper.code}" target="_blank" rel="noopener noreferrer" class="blue-tag">[Code]</a>` : "";

      const MAX_INLINE_AWARD = 30;
      const awardInline = paper.award && paper.award.length < MAX_INLINE_AWARD
        ? ` (<span class="award-inline">${paper.award}</span>)`
        : "";

      const awardBlock = paper.award && paper.award.length >= MAX_INLINE_AWARD
        ? `<br><span class="award">${paper.award}</span>`
        : "";

      const titleHtml = paper.link
        ? `<a href="${paper.link}" target="_blank" rel="noopener noreferrer" class="paper-title">${paper.title}</a>`
        : `<span class="paper-title">${paper.title}</span>`;

      const venueTag = paper.short
        ? `<strong class="paper-venue-tag">[${paper.short}]</strong>`
        : "";

      item.innerHTML =
        `<span class="paper-heading">${venueTag}${titleHtml}${codeLink}</span>` +
        `<span class="authors">${highlightedAuthors}</span><br>` +
        `<span class="venue-full">${paper.venue}, ${paper.year}${awardInline}</span>` +
        awardBlock;

      ul.appendChild(item);
    });
    container.appendChild(ul);
  });
}
