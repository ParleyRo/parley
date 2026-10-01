import Alpine from 'alpinejs';
import htmx from 'htmx.org';
import '@fontsource/poppins/latin-ext-400.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-ext-500.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-ext-600.css';
import '@fontsource/poppins/latin-600.css';
import './style.css';
import { castingWeight, lineLength, parseNumber, ruleOfThree } from '../src/tools/calculations';

declare global { interface Window { Alpine: typeof Alpine } }
interface HtmxDetail { elt: HTMLElement; xhr: XMLHttpRequest; successful: boolean; shouldSwap: boolean; target: HTMLElement; requestConfig?: { path: string } }
const detailOf = (event: Event) => (event as CustomEvent<HtmxDetail>).detail;
const toolNames: Record<string, string> = { 'line-length': 'Lungime fir', 'casting-weight': 'Putere de aruncare', 'rule-of-three': 'Regula de 3 simplă', radio: 'Radio' };
const sectionNames = { about: 'Despre mine', ...toolNames, cv: 'Download CV', contact: 'Contact me' };
const pendingTools = new Set<string>();

Alpine.data('shell', () => ({
  section: document.body.dataset.initialSection || 'about',
  init() {
    window.addEventListener('popstate', () => {
      const url = new URL(location.href);
      const section = url.searchParams.get('tool') || url.searchParams.get('section') || 'about';
      void this.openSection(section in sectionNames ? section : 'about', false);
    });
    if (this.section !== 'about') this.$nextTick(() => this.revealPanel());
  },
  revealPanel() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      document.getElementById('main')!.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  },
  async openSection(section: string, updateHistory = true) {
    if (!(section in sectionNames)) return;
    const changed = section !== this.section;
    this.section = section;
    if (updateHistory && changed) {
      const url = new URL(location.href);
      url.searchParams.delete('tool');
      url.searchParams.delete('section');
      url.hash = '';
      if (toolNames[section]) url.searchParams.set('tool', section);
      else if (section !== 'about') url.searchParams.set('section', section);
      history.pushState({ parleySection: section }, '', url);
    }
    if (updateHistory) this.$nextTick(() => this.revealPanel());
    if (toolNames[section]) await this.loadTool(section);
  },
  async loadTool(slug: string) {
    const target = document.getElementById(`content-${slug}`)!;
    if (target.dataset.loaded === 'true' || pendingTools.has(slug)) return;
    pendingTools.add(slug);
    target.setAttribute('aria-busy', 'true');
    target.innerHTML = '<div class="panel-heading"><h2 class="section-title"></h2></div><p class="panel-loading" role="status">Se încarcă…</p>';
    target.querySelector('h2')!.textContent = toolNames[slug];
    try {
      await htmx.ajax('get', `/tools/${slug}`, { target, source: target, swap: 'innerHTML' });
      // HTMX also resolves its promise for HTTP errors that do not swap content.
      if (!target.querySelector('.calculator, .radio-panel')) throw new Error('Tool response unavailable');
      target.dataset.loaded = 'true';
    } catch {
      target.innerHTML = '<div class="empty-state"><h2 class="section-title">Nu s-a putut încărca</h2><p>Verifică conexiunea și încearcă din nou.</p><button class="primary-button" type="button">Reîncearcă</button></div>';
      target.querySelector('button')!.addEventListener('click', () => void this.loadTool(slug));
    } finally {
      pendingTools.delete(slug);
      target.removeAttribute('aria-busy');
    }
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

interface LanguageOption { code: string; name: string; searchName: string }
const normalizeLanguage = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

Alpine.data('translation', () => ({
  selected: 'en', error: '', loading: false, request: null as XMLHttpRequest | null,
  pickerOpen: false, query: '', activeCode: '', options: [] as LanguageOption[],
  init() {
    this.options = Array.from(this.$refs.languageOptions.querySelectorAll<HTMLElement>('[data-language-code]'), option => ({
      code: option.dataset.languageCode!, name: option.dataset.languageName!, searchName: option.dataset.languageSearch!,
    }));
  },
  get selectedName(): string { return this.options.find(option => option.code === this.selected)?.name ?? 'English'; },
  get filteredOptions(): LanguageOption[] {
    const query = normalizeLanguage(this.query);
    return this.options.filter(option => normalizeLanguage(`${option.name} ${option.searchName} ${option.code}`).includes(query));
  },
  matches(code: string) { return this.filteredOptions.some(option => option.code === code); },
  showPicker() {
    this.query = '';
    this.activeCode = this.selected;
    this.pickerOpen = true;
    this.$nextTick(() => {
      this.$refs.languagePicker.scrollIntoView({ block: 'nearest' });
      this.$refs.languageSearch.focus({ preventScroll: true });
      this.scrollActive();
    });
  },
  closePicker(restoreFocus = true) {
    if (!this.pickerOpen) return;
    this.pickerOpen = false;
    if (restoreFocus) this.$refs.languageTrigger.focus();
  },
  filterOptions() {
    this.activeCode = this.filteredOptions[0]?.code ?? '';
    this.$nextTick(() => this.scrollActive());
  },
  moveActive(direction: number) {
    const options = this.filteredOptions;
    if (!options.length) return;
    const current = options.findIndex(option => option.code === this.activeCode);
    this.activeCode = options[Math.max(0, Math.min(options.length - 1, current + direction))].code;
    this.scrollActive();
  },
  scrollActive() {
    document.getElementById(`language-option-${this.activeCode}`)?.scrollIntoView({ block: 'nearest' });
  },
  selectLanguage(code: string) {
    if (!this.options.some(option => option.code === code)) return;
    const needsTranslation = code !== this.selected || Boolean(this.error);
    this.selected = code;
    this.closePicker();
    if (needsTranslation) this.$nextTick(() => (this.$root as HTMLFormElement).requestSubmit());
  },
  begin(event: Event) { this.request = detailOf(event).xhr; this.error = ''; this.loading = true; },
  finish(event: Event) {
    const detail = detailOf(event);
    if (detail.xhr !== this.request) return;
    this.loading = false;
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

// Tools have persistent, separate targets; translations only apply to the selected language.
document.addEventListener('htmx:beforeSwap', event => {
  const detail = detailOf(event);
  if (detail.target.id === 'presentation') {
    const returnedLanguage = /data-language="([a-z]+)"/.exec(detail.xhr.responseText)?.[1];
    const selected = document.querySelector<HTMLInputElement>('[name="toLanguage"]')?.value;
    if (returnedLanguage !== selected) detail.shouldSwap = false;
  }
});
htmx.config.allowScriptTags = false;
htmx.config.includeIndicatorStyles = false;
window.Alpine = Alpine;
Alpine.start();
