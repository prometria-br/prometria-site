const DATA = {
  offers: './data/offers.json',
  coupons: './data/coupons.json',
  categories: './data/categories.json',
  platforms: './data/platforms.json',
  channels: './data/channels.json'
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

async function loadJSON(path, fallback = []){
  try{
    const response = await fetch(path, {cache:'no-store'});
    if(!response.ok) throw new Error(`Erro ao carregar ${path}`);
    return await response.json();
  }catch(error){
    console.warn(error.message);
    return fallback;
  }
}

function normalize(str){
  return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}

function money(value){
  if(value === null || value === undefined || value === '') return '';
  const n = Number(value);
  if(Number.isNaN(n)) return String(value);
  return n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
}

function isActive(item){
  const status = normalize(item.status);
  if(status !== 'ativo' && status !== 'active') return false;
  if(item.validade){
    const expiry = new Date(item.validade);
    if(!Number.isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) return false;
  }
  return true;
}

function isRelevantCoupon(coupon){
  const classif = normalize(coupon.classificacao || coupon.classification);
  if(['fraco','rejeitado','weak','rejected'].includes(classif)) return false;
  return isActive(coupon);
}

function setupMenu(){
  const button = $('[data-menu-button]');
  const nav = $('[data-nav]');
  if(!button || !nav) return;
  button.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(opened));
  });
}

function getParams(){
  return new URLSearchParams(window.location.search);
}

function productImage(item){
  const src = item.imagem || item.image || 'assets/img/placeholder-product.svg';
  return `<img src="${src}" alt="" loading="lazy">`;
}

function offerCard(item){
  const name = item.nome || item.name || 'Oferta selecionada';
  const platform = item.plataforma || item.platform || 'Plataforma';
  const category = item.categoria || item.category || 'Categoria';
  const current = item.precoComCupom || item.finalPrice || item.precoAtual || item.price;
  const old = item.precoAntigo || item.oldPrice;
  const url = item.linkAfiliado || item.url || '#';
  const coupon = item.cupom || item.coupon;
  return `
    <article class="card offer-card" data-kind="oferta" data-platform="${platform}" data-category="${category}">
      <div class="offer-card__image">${productImage(item)}</div>
      <div class="offer-card__body">
        <div class="badges">
          <span class="badge badge--active">Oferta ativa</span>
          <span class="badge">${platform}</span>
          <span class="badge">${category}</span>
        </div>
        <h3>${name}</h3>
        <div class="price-line">
          ${current ? `<span class="price">${money(current)}</span>` : `<span class="price">Ver preço no parceiro</span>`}
          ${old ? `<span class="old-price">${money(old)}</span>` : ''}
        </div>
        ${coupon ? `<p class="small">Cupom aplicável: <strong>${coupon}</strong></p>` : ''}
        <p class="price-note">Preço e disponibilidade podem mudar sem aviso.</p>
        <div class="card__footer">
          <a class="btn btn--primary btn--full ${url === '#' ? 'disabled' : ''}" href="${url}" ${url === '#' ? 'aria-disabled="true"' : 'target="_blank" rel="noopener sponsored"'}>Ver oferta</a>
        </div>
      </div>
    </article>`;
}

function couponCard(coupon){
  const platform = coupon.plataforma || coupon.platform || 'Plataforma';
  const title = coupon.nomeCampanha || coupon.name || 'Cupom ativo';
  const code = coupon.codigo || coupon.code || 'Ver campanha';
  const discount = coupon.desconto || coupon.discount || '';
  const min = coupon.valorMinimo || coupon.minValue || '';
  const url = coupon.linkCampanha || coupon.url || '#';
  const validade = coupon.validade ? new Date(coupon.validade).toLocaleDateString('pt-BR') : '';
  return `
    <article class="card coupon-card" data-kind="cupom" data-platform="${platform}" data-category="${coupon.categoria || 'Cupons'}">
      <div class="coupon-card__body">
        <div class="badges">
          <span class="badge badge--active">Ativo</span>
          <span class="badge">${platform}</span>
          <span class="badge">${coupon.classificacao || 'relevante'}</span>
        </div>
        <h3>${title}</h3>
        <div class="coupon-code">${code}</div>
        ${discount || min ? `<p>${discount ? `<strong>${discount}</strong>` : ''}${min ? ` em compras acima de <strong>${min}</strong>` : ''}</p>` : '<p>Confira as regras diretamente na plataforma parceira.</p>'}
        ${validade ? `<p class="small">Validade informada: ${validade}</p>` : ''}
        <p class="price-note">Cupom sujeito a alteração.</p>
        <div class="card__footer">
          <a class="btn btn--primary btn--full ${url === '#' ? 'disabled' : ''}" href="${url}" ${url === '#' ? 'aria-disabled="true"' : 'target="_blank" rel="noopener sponsored"'}>${code === 'Ver campanha' ? 'Ver campanha' : 'Usar cupom'}</a>
        </div>
      </div>
    </article>`;
}

async function renderHomePreview(){
  const platformsTarget = $('[data-platform-preview]');
  if(platformsTarget){
    const platforms = await loadJSON(DATA.platforms);
    platformsTarget.innerHTML = platforms.map(p => `
      <article class="card">
        <div class="icon">${p.icon || '•'}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="card__footer"><a class="btn btn--ghost" href="sites-categorias.html?plataforma=${encodeURIComponent(p.name)}">Ver ofertas</a></div>
      </article>`).join('');
  }
}

async function renderOffersPage(){
  const grid = $('[data-results]');
  if(!grid) return;
  const [offersRaw, couponsRaw] = await Promise.all([loadJSON(DATA.offers), loadJSON(DATA.coupons)]);
  const offers = offersRaw.filter(isActive);
  const coupons = couponsRaw.filter(isRelevantCoupon);
  const platformSelect = $('[data-filter-platform]');
  const categorySelect = $('[data-filter-category]');
  const searchInput = $('[data-filter-search]');
  const count = $('[data-count]');
  const params = getParams();
  const tabs = $$('[data-tab]');
  const defaultKind = params.get('tipo') || 'todos';
  let kind = defaultKind;

  const platforms = [...new Set([...offers.map(o=>o.plataforma || o.platform), ...coupons.map(c=>c.plataforma || c.platform)].filter(Boolean))].sort();
  const categories = [...new Set([...offers.map(o=>o.categoria || o.category), ...coupons.map(c=>c.categoria || 'Cupons')].filter(Boolean))].sort();
  if(platformSelect){
    platformSelect.innerHTML = '<option value="">Todas as plataformas</option>' + platforms.map(p => `<option>${p}</option>`).join('');
    if(params.get('plataforma')) platformSelect.value = params.get('plataforma');
  }
  if(categorySelect){
    categorySelect.innerHTML = '<option value="">Todas as categorias</option>' + categories.map(c => `<option>${c}</option>`).join('');
    if(params.get('categoria')) categorySelect.value = params.get('categoria');
  }
  tabs.forEach(tab => {
    if(tab.dataset.tab === kind) tab.classList.add('active');
    tab.addEventListener('click', () => { kind = tab.dataset.tab; tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active'); render(); });
  });

  function render(){
    const q = normalize(searchInput?.value || '');
    const platform = platformSelect?.value || '';
    const category = categorySelect?.value || '';
    const items = [];
    if(kind === 'todos' || kind === 'ofertas') offers.forEach(item => items.push({type:'oferta', item}));
    if(kind === 'todos' || kind === 'cupons' || kind === 'campanhas') coupons.forEach(item => items.push({type:'cupom', item}));
    const filtered = items.filter(({type,item}) => {
      const p = item.plataforma || item.platform || '';
      const c = item.categoria || item.category || (type === 'cupom' ? 'Cupons' : '');
      const text = normalize([item.nome,item.name,item.nomeCampanha,item.codigo,item.plataforma,item.categoria].join(' '));
      return (!platform || p === platform) && (!category || c === category) && (!q || text.includes(q));
    });
    count && (count.textContent = `${filtered.length} item(ns) ativo(s)`);
    grid.innerHTML = filtered.length ? filtered.map(({type,item}) => type === 'oferta' ? offerCard(item) : couponCard(item)).join('') : `
      <div class="empty">
        <h3>Nenhuma oferta ou cupom ativo cadastrado agora.</h3>
        <p>Adicione itens com <strong>status: "ativo"</strong> em <code>data/offers.json</code> ou <code>data/coupons.json</code>. Cupons fracos ou rejeitados não aparecem.</p>
      </div>`;
  }
  [searchInput, platformSelect, categorySelect].filter(Boolean).forEach(el => el.addEventListener('input', render));
  render();
}

async function renderSitesCategoriesPage(){
  const platformGrid = $('[data-platform-grid]');
  const categoryGrid = $('[data-category-grid]');
  const [platforms, categories, offersRaw, couponsRaw] = await Promise.all([loadJSON(DATA.platforms), loadJSON(DATA.categories), loadJSON(DATA.offers), loadJSON(DATA.coupons)]);
  const offers = offersRaw.filter(isActive);
  const coupons = couponsRaw.filter(isRelevantCoupon);
  const countByPlatform = name => offers.filter(o => (o.plataforma || o.platform) === name).length + coupons.filter(c => (c.plataforma || c.platform) === name).length;
  const countByCategory = name => offers.filter(o => (o.categoria || o.category) === name).length + coupons.filter(c => (c.categoria || c.category || 'Cupons') === name).length;
  if(platformGrid){
    platformGrid.innerHTML = platforms.map(p => `
      <article class="card">
        <div class="icon">${p.icon || '•'}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="count">${countByPlatform(p.name)} oferta(s)/cupom(ns) ativo(s)</p>
        <div class="card__footer"><a class="btn btn--ghost" href="ofertas.html?plataforma=${encodeURIComponent(p.name)}">Ver ofertas</a></div>
      </article>`).join('');
  }
  if(categoryGrid){
    categoryGrid.innerHTML = categories.map(c => `
      <article class="card">
        <div class="icon">${c.icon || '•'}</div>
        <h3>${c.name}</h3>
        <p>${c.description}</p>
        <p class="count">${countByCategory(c.name)} oferta(s)/cupom(ns) ativo(s)</p>
        <div class="card__footer"><a class="btn btn--ghost" href="ofertas.html?categoria=${encodeURIComponent(c.name)}">Ver ofertas</a></div>
      </article>`).join('');
  }
}

async function renderChannelsPage(){
  const grid = $('[data-channel-grid]');
  if(!grid) return;
  const channels = await loadJSON(DATA.channels);
  grid.innerHTML = channels.map(ch => `
    <article class="card">
      <div class="icon">${ch.icon || '•'}</div>
      <h3>${ch.name}</h3>
      <p>${ch.description}</p>
      <div class="card__footer"><a class="btn ${ch.featured ? 'btn--primary' : 'btn--ghost'} btn--full" href="${ch.url}" target="_blank" rel="noopener">${ch.button || 'Acessar'}</a></div>
    </article>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  renderHomePreview();
  renderOffersPage();
  renderSitesCategoriesPage();
  renderChannelsPage();
});