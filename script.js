/* This is a static product story. It does not fetch or manufacture operational data. */
const research = {
  molecule: ['A starting point for better questions.', 'Bring identity, physical properties, solid forms and safety references into one view of the molecule.', ['Structure & properties', 'Published evidence', 'Source context']],
  process: ['Explore the steps behind the product.', 'Look at formulation, dissolution and published manufacturing routes alongside the properties and assumptions that shape the question.', ['Formulation', 'Dissolution', 'Process context']],
  market: ['Put the molecule in a wider picture.', 'Explore product authorisations, manufacturing-site records and market context alongside the molecule’s scientific evidence.', ['Authorisations', 'Manufacturing sites', 'Market context']]
};
const lenses = {
  test: ['FAILED TEST', 'What keeps appearing?', 'Explore patterns in dissolution, assay, impurities and other reported test failures.', ['Dissolution', 'Assay', 'Impurities']],
  state: ['REPORTING STATE', 'Where are signals being reported?', 'Explore alerts by reporting state and laboratory, with the original notice available for context.', ['Reporting state', 'Laboratory', 'Notice']],
  maker: ['MANUFACTURER', 'What does the record show over time?', 'Bring reported products, batches and failed tests together for a closer look at a manufacturer’s alert history.', ['Product', 'Batch', 'Alert history']]
};

function tags(items, className) {
  const group = document.createElement('div');
  group.className = className;
  items.forEach(item => { const tag = document.createElement('span'); tag.textContent = item; group.append(tag); });
  return group;
}

function setupTabs(selector, onSelect) {
  const buttons = [...document.querySelectorAll(selector)];
  function select(button) {
    buttons.forEach(b => {
      const selected = b === button;
      b.setAttribute('aria-selected', String(selected));
      b.tabIndex = selected ? 0 : -1;
      const plus = b.querySelector('.row-plus');
      if (plus) plus.textContent = selected ? '−' : '+';
    });
    onSelect(button);
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      const vertical = button.parentElement.getAttribute('aria-orientation') === 'vertical';
      let next;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % buttons.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); select(buttons[next]); buttons[next].focus(); }
    });
  });
}

setupTabs('[data-research]', button => {
  const [title, body, items] = research[button.dataset.research];
  const panel = document.getElementById('research-detail');
  panel.setAttribute('aria-labelledby', button.id);
  panel.querySelector('h3').textContent = title;
  panel.querySelector('p').textContent = body;
  panel.querySelector('.tags').replaceWith(tags(items, 'tags'));
  document.querySelectorAll('[data-scene]').forEach(scene => { scene.hidden = scene.dataset.scene !== button.dataset.research; });
  document.querySelector('.molecule-label').textContent = {
    molecule: 'MOLECULE · EVIDENCE · CONTEXT',
    process: 'FORMULATION · PROCESS · PRODUCT',
    market: 'MEDICINES · MARKETS · REGULATION'
  }[button.dataset.research];
  updateMotion();
});
setupTabs('[data-lens]', button => {
  const [eyebrow, title, body, items] = lenses[button.dataset.lens];
  const panel = document.getElementById('nsq-detail');
  panel.setAttribute('aria-labelledby', button.id);
  panel.querySelector('.detail-eyebrow').textContent = eyebrow;
  panel.querySelector('h3').textContent = title;
  panel.querySelector('.signal-reading > p').textContent = body;
  panel.querySelector('.signal-tags').replaceWith(tags(items, 'signal-tags'));
  document.querySelectorAll('[data-signal]').forEach(scene => { scene.hidden = scene.dataset.signal !== button.dataset.lens; });
});

const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = preference.matches;
const animations = [];
const motionButton = document.getElementById('motion-toggle');
function updateMotion() {
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
  document.querySelectorAll('svg').forEach(svg => {
    if (paused && svg.pauseAnimations) svg.pauseAnimations();
    else if (svg.unpauseAnimations) svg.unpauseAnimations();
  });
  animations.forEach(({player, visible, element}) => paused || !visible || document.hidden || element.closest('[hidden]') ? player.pause() : player.play());
}
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
preference.addEventListener('change', event => { paused = event.matches; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);
updateMotion();

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('pending'); revealObserver.unobserve(entry.target); }
  }), {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('pending'); revealObserver.observe(element); });
}

document.querySelectorAll('[data-animation]').forEach(element => {
  const fallback = document.createElement('span');
  fallback.className = 'fallback-illustration';
  fallback.textContent = element.dataset.animation === 'science' ? '⌬' : '▤';
  element.append(fallback);
  if (!window.lottie) return;
  const data = window.eurvedaAnimations?.[element.dataset.animation];
  if (!data) return;
  // Each player gets its own copy: Lottie mutates animation data during rendering.
  const player = window.lottie.loadAnimation({container: element, renderer: 'svg', loop: true, autoplay: false, animationData: JSON.parse(JSON.stringify(data)), rendererSettings: {progressiveLoad: true}});
  const item = {player, visible: false, element};
  animations.push(item);
  player.addEventListener('DOMLoaded', () => { if (paused) player.goToAndStop(35, true); updateMotion(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { item.visible = entries[0].isIntersecting; updateMotion(); }, {threshold: 0.05}).observe(element);
  } else { item.visible = true; }
});
document.getElementById('year').textContent = new Date().getFullYear();

// Native disclosures keep each explanation directly beside the selected record.
const recordItems = [...document.querySelectorAll('.record-item')];
recordItems.forEach(item => item.addEventListener('toggle', () => {
  if (item.open) recordItems.forEach(other => { if (other !== item) other.open = false; });
}));
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); }
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
});
mainNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
