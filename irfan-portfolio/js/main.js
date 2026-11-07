const $ = (selector) => document.querySelector(selector);
const themeButton = $('#theme-toggle');
const menuButton = $('#menu-toggle');
const navigation = $('#site-nav');

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#121c27' : '#f7f5f0';
  try { localStorage.setItem('theme', theme); } catch (_) { /* Storage may be blocked. */ }
}
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
themeButton.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
themeButton.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
$('#year').textContent = new Date().getFullYear();

const sectionLinks = [...navigation.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach(link => {
      if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: [0,.1,.25,.5] });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

// The API is the source of truth for public repository URLs and details.
const GITHUB_USER = 't0m0dachi88';
const featuredMatchers = {
  banking: repo => /bank.*(system|ledger)|ledger.*bank/i.test(repo.name),
  kern: repo => /^kern(?:[-_.]|$)/i.test(repo.name),
  urbaneye: repo => /urban[-_. ]?eye/i.test(repo.name),
  vchess: repo => /v[-_. ]?chess/i.test(repo.name)
};
const repoGrid = $('#repo-grid');
function node(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content != null) element.textContent = content;
  return element;
}
function repoCard(repo) {
  const card = node('article', 'repo-item');
  const link = node('a', '', `${repo.name} ↗`);
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  const description = node('p', '', repo.description || 'No description provided.');
  const meta = node('div', 'repo-meta');
  meta.append(node('span', '', repo.language || 'Language not specified'), node('span', '', `★ ${repo.stargazers_count ?? 0}`));
  card.append(link, description, meta);
  return card;
}
async function loadRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/repos?per_page=100&type=owner&sort=updated`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('Unexpected GitHub response');
    const repositories = payload.filter(repo => !repo.private && !repo.fork && repo.owner?.login?.toLowerCase() === GITHUB_USER.toLowerCase());
    const matched = new Set();
    Object.entries(featuredMatchers).forEach(([key, matches]) => {
      const candidates = repositories.filter(matches);
      if (candidates.length !== 1) return; // Ambiguous matches must not be guessed.
      const repo = candidates[0];
      matched.add(repo.id);
      const slot = document.querySelector(`[data-project="${key}"]`);
      if (!slot) return;
      const link = node('a', '', 'View repository ↗');
      link.href = repo.html_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      slot.replaceChildren(link);
    });
    const remaining = repositories.filter(repo => !matched.has(repo.id)).sort((a,b) => (b.stargazers_count - a.stargazers_count) || new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0,6);
    repoGrid.replaceChildren();
    if (!remaining.length) repoGrid.append(node('p', 'repo-message', 'No additional public repositories are available right now.'));
    else remaining.forEach(repo => repoGrid.append(repoCard(repo)));
  } catch (error) {
    repoGrid.replaceChildren(node('p', 'repo-message', 'Public repositories could not be loaded right now. You can browse them directly on GitHub.'));
    console.info('GitHub repositories unavailable:', error.message);
  }
}
loadRepositories();
