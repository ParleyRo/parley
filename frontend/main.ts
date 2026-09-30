import Alpine from 'alpinejs';
import htmx from 'htmx.org';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import './style.css';
import { castingWeight, lineLength, parseNumber, ruleOfThree } from '../src/tools/calculations';

declare global { interface Window { Alpine: typeof Alpine } }
interface HtmxDetail { elt: HTMLElement; xhr: XMLHttpRequest; successful: boolean; shouldSwap: boolean; target: HTMLElement; requestConfig?: { path: string } }
const detailOf = (event: Event) => (event as CustomEvent<HtmxDetail>).detail;
const toolNames: Record<string, string> = { 'line-length': 'Lungime fir', 'casting-weight': 'Putere de aruncare', 'rule-of-three': 'Regula de 3 simplă', radio: 'Radio' };
let activeTool = '';
let toolRequest: XMLHttpRequest | null = null;

Alpine.data('shell', () => ({
  trigger: null as HTMLElement | null,
  init() {
    const initial = document.body.dataset.initialTool;
    if (initial && toolNames[initial]) {
      activeTool = initial;
      this.$nextTick(() => { this.dialog().showModal(); document.body.classList.add('modal-open'); this.focusTitle(); });
    }
    window.addEventListener('popstate', () => {
      const slug = new URL(location.href).searchParams.get('tool');
      if (slug && toolNames[slug]) void this.openTool(slug, null, false);
      else this.closeTool(false);
    });
  },
  dialog() { return document.getElementById('tool-dialog') as HTMLDialogElement; },
  focusTitle() {
    const title = document.getElementById('modal-title');
    if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
  },
  trapTab(event: KeyboardEvent) {
    const elements = [...this.dialog().querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]')]
      .filter(element => element.offsetParent !== null);
    const first = elements[0];
    const last = elements.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || !elements.includes(document.activeElement as HTMLElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !elements.includes(document.activeElement as HTMLElement))) {
      event.preventDefault(); first.focus();
    }
  },
  async openTool(slug: string, trigger: HTMLElement | null = null, updateHistory = true) {
    if (!toolNames[slug]) return;
    if (trigger) this.trigger = trigger;
    activeTool = slug;
    const target = document.getElementById('tool-content')!;
    target.innerHTML = '<div class="modal-loading"><h2 id="modal-title"></h2><p role="status">Se încarcă…</p></div>';
    document.getElementById('modal-title')!.textContent = toolNames[slug];
    if (!this.dialog().open) this.dialog().showModal();
    document.body.classList.add('modal-open');
    this.focusTitle();
    if (updateHistory) {
      const url = new URL(location.href);
      url.searchParams.set('tool', slug);
      history.pushState({ parleyModal: true }, '', url);
    }
    try {
      await htmx.ajax('get', `/tools/${slug}`, { target, source: target, swap: 'innerHTML' });
      if (activeTool === slug && this.dialog().open) this.focusTitle();
    } catch {
      if (activeTool !== slug || !this.dialog().open) return;
      target.innerHTML = '<div class="empty-state"><h2 id="modal-title">Nu s-a putut încărca</h2><p>Verifică conexiunea și încearcă din nou.</p><button class="primary-button" type="button">Reîncearcă</button></div>';
      target.querySelector('button')!.addEventListener('click', () => void this.openTool(slug, null, false));
      this.focusTitle();
    }
  },
  closeTool(updateHistory = true) {
    activeTool = '';
    toolRequest = null;
    this.dialog().close();
    document.body.classList.remove('modal-open');
    if (updateHistory) {
      if (history.state?.parleyModal) history.back();
      else { const url = new URL(location.href); url.searchParams.delete('tool'); history.replaceState(null, '', url); }
    }
    (this.trigger ?? document.querySelector<HTMLElement>('.tool-card'))?.focus({ preventScroll: true });
  },
}));

Alpine.data('calculator', (slug: string) => ({
  a: '', b: '', c: '', rounded: true, result: '', detail: '', error: '',
  calculate() {
    this.result = ''; this.detail = ''; this.error = '';
    const fields = slug === 'casting-weight' ? [this.a] : [this.a, this.b, this.c];
    if (fields.every(field => !field.trim())) return;
    if (fields.some(field => !field.trim())) { this.error = 'Completează toate valorile.'; return; }
    const values = fields.map(parseNumber);
    if (values.some(value => value === null)) { this.error = 'Folosește doar numere, cu punct sau virgulă pentru zecimale.'; return; }
    const [a, b, c] = values as number[];
    try {
      if (slug === 'line-length') { this.result = `${lineLength(a, b, c)} m`; this.detail = 'Lungime estimată pentru diametrul ales.'; }
      else if (slug === 'casting-weight') { const value = castingWeight(a); this.result = `${value.grams} g`; this.detail = `Interval: ${value.min}–${value.max} g (±20%)`; }
      else { this.result = ruleOfThree(a, b, c, this.rounded).replace('.', ','); this.detail = 'X = B × C / A'; }
    } catch (error) { this.error = (error as Error).message; }
  },
}));

Alpine.data('translation', () => ({
  selected: 'en', error: '', request: null as XMLHttpRequest | null,
  begin(event: Event) { this.request = detailOf(event).xhr; this.error = ''; },
  finish(event: Event) {
    const detail = detailOf(event);
    if (detail.xhr !== this.request) return;
    if (!detail.successful && !this.error) this.error = 'Traducerea nu este disponibilă momentan. Încearcă din nou.';
  },
  applied() { this.error = ''; },
}));

interface RadioStation { id: string; name: string; stream: string }
const audio = document.getElementById('radio-audio') as HTMLAudioElement;
let playAttempt = 0;
let connectionTimer: ReturnType<typeof setTimeout> | undefined;
const radioStore = {
  station: null as RadioStation | null, playing: false, loading: false, error: '', volume: 0.7,
  init() {
    audio.volume = this.volume;
    audio.addEventListener('playing', () => { this.playing = true; this.loading = false; this.error = ''; clearTimeout(connectionTimer); });
    audio.addEventListener('pause', () => { if (audio.paused) { this.playing = false; this.loading = false; clearTimeout(connectionTimer); } });
    audio.addEventListener('waiting', () => { this.loading = true; });
    audio.addEventListener('error', () => { this.playing = false; this.loading = false; this.error = 'Postul nu poate fi redat momentan.'; clearTimeout(connectionTimer); });
    audio.addEventListener('ended', () => { this.playing = false; this.loading = false; });
  },
  async choose(data: DOMStringMap) {
    if (!data.id || !data.name || !data.stream) return;
    if (this.station?.id === data.id) return this.toggle();
    this.station = { id: data.id, name: data.name, stream: data.stream };
    this.playing = false;
    audio.src = data.stream;
    await this.play();
  },
  async play() {
    const attempt = ++playAttempt;
    this.error = ''; this.loading = true;
    clearTimeout(connectionTimer);
    connectionTimer = setTimeout(() => {
      if (this.loading && attempt === playAttempt) { audio.pause(); this.error = 'Conectarea durează prea mult. Încearcă din nou.'; }
    }, 20000);
    try { await audio.play(); }
    catch (error) {
      if (attempt !== playAttempt || (error as Error).name === 'AbortError') return;
      this.playing = false; this.loading = false; clearTimeout(connectionTimer);
      this.error = 'Postul nu poate fi redat momentan. Încearcă din nou.';
    }
  },
  async toggle() { if (!this.station) return; if (!audio.paused) { ++playAttempt; audio.pause(); } else await this.play(); },
  async retry() { if (this.station) { audio.src = this.station.stream; await this.play(); } },
  setVolume(value: string) { this.volume = Number(value); audio.volume = this.volume; },
};
Alpine.store('radio', radioStore);

// Keep late responses from reopening or replacing a newer modal.
document.addEventListener('htmx:beforeRequest', event => {
  const detail = detailOf(event);
  if (detail.target.id === 'tool-content') toolRequest = detail.xhr;
});
document.addEventListener('htmx:beforeSwap', event => {
  const detail = detailOf(event);
  if (detail.target.id === 'tool-content' && (!activeTool || detail.xhr !== toolRequest || detail.requestConfig?.path !== `/tools/${activeTool}`)) detail.shouldSwap = false;
  if (detail.target.id === 'presentation') {
    const returnedLanguage = /data-language="([a-z]+)"/.exec(detail.xhr.responseText)?.[1];
    const selected = document.querySelector<HTMLSelectElement>('[name="toLanguage"]')?.value;
    if (returnedLanguage !== selected) detail.shouldSwap = false;
  }
});
htmx.config.allowScriptTags = false;
htmx.config.includeIndicatorStyles = false;
window.Alpine = Alpine;
Alpine.start();
