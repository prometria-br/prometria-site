const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ROOT = window.location.pathname.includes('/prometria-site/') ? '/prometria-site/' : '/';

function money(value){
  if(value === null || value === undefined || value === "" || Number.isNaN(Number(value))) return "";
  return Number(value).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}

async function loadJSON(path, fallback = []){
  try{
    const res = await fetch(path, {cache:"no-store"});
    if(!res.ok) throw new Error("not found");
    return await res.json();
  }catch(e){
    return fallback;
  }
}

function setupMenu(){
  const btn = $(".menu-toggle");
  const nav = $(".nav");
  if(!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
}

function productCard(p){
  const hasPrice = p.price !== null && p.price !== undefined && p.price !== "";
  const finalPrice = p.finalPrice ?? p.final_price ?? p.price;
  const priceHtml = hasPrice
    ? `<div class="price">${money(finalPrice)}</div><div class="price-note">Preço sujeito à alteração no marketplace.</div>`
    : `<div class="price">Ver preço atualizado</div><div class="price-note">Produto de teste sem preço fixo. O valor será exibido quando vier da automação validada.</div>`;
  const link = p.affiliateUrl || p.affiliate_url || "#";
  const safeLink = link === "#" ? "#" : link;
  return `
    <article class="card product-card" data-category="${p.category || ""}" data-store="${p.marketplace || ""}">
      <div class="product-image">
        ${p.image ? `<img src="${p.image}" alt="">` : `<span>${p.marketplace || "Prometria"}<br>Produto selecionado</span>`}
      </div>
      <div class="product-body">
        <div class="badges">
          <span class="badge">${p.marketplace || "Marketplace"}</span>
          <span class="badge">${p.category || "Categoria"}</span>
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        </div>
        <h3>${p.title || "Produto selecionado"}</h3>
        <p>${p.description || "Produto selecionado pela curadoria Prometria."}</p>
        <div class="price-box">${priceHtml}</div>
        <a class="btn primary" href="${safeLink}" ${safeLink === "#" ? "" : 'target="_blank" rel="noopener"'}>Ver oferta</a>
      </div>
    </article>
  `;
}

async function renderProducts(){
  const grid = $("#productsGrid");
  if(!grid) return;
  const products = await loadJSON("../data/produtos.json", []);
  const search = $("#searchInput");
  const category = $("#categoryFilter");
  const store = $("#storeFilter");

  function fillFilters(){
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    const stores = [...new Set(products.map(p => p.marketplace).filter(Boolean))].sort();
    if(category) category.innerHTML = `<option value="">Todas as categorias</option>` + categories.map(c => `<option>${c}</option>`).join("");
    if(store) store.innerHTML = `<option value="">Todas as lojas</option>` + stores.map(s => `<option>${s}</option>`).join("");
  }

  function render(){
    const q = (search?.value || "").toLowerCase();
    const cat = category?.value || "";
    const st = store?.value || "";
    const filtered = products.filter(p => {
      const text = `${p.title || ""} ${p.category || ""} ${p.marketplace || ""}`.toLowerCase();
      return (!q || text.includes(q)) && (!cat || p.category === cat) && (!st || p.marketplace === st);
    });
    grid.innerHTML = filtered.length ? filtered.map(productCard).join("") : `<div class="empty">Nenhum produto encontrado com esses filtros.</div>`;
  }

  fillFilters();
  render();
  [search, category, store].filter(Boolean).forEach(el => el.addEventListener("input", render));
}

async function renderCampaigns(){
  const grid = $("#campaignsGrid");
  if(!grid) return;
  const campaigns = await loadJSON("../data/campanhas.json", []);
  grid.innerHTML = campaigns.length ? campaigns.map(c => `
    <article class="card">
      <div class="badges">
        <span class="badge">${c.marketplace || "Marketplace"}</span>
        <span class="badge">${c.status || "Status"}</span>
      </div>
      <h3>${c.title || "Campanha selecionada"}</h3>
      <p>${c.description || "Cupom ou campanha monitorada pela Prometria."}</p>
      <div class="price-box">
        <div class="price">${c.coupon || "Cupom em validação"}</div>
        <div class="price-note">Confira regras, mínimo e disponibilidade no marketplace.</div>
      </div>
      <a class="btn primary" href="${c.redeemUrl || "#"}" ${c.redeemUrl && c.redeemUrl !== "#" ? 'target="_blank" rel="noopener"' : ""}>Resgatar / conferir</a>
    </article>
  `).join("") : `<div class="empty">Nenhuma campanha ativa no momento.</div>`;
}

async function renderSimpleGrid(file, target, type){
  const grid = $(target);
  if(!grid) return;
  const items = await loadJSON(file, []);
  grid.innerHTML = items.map(item => `
    <article class="card">
      <div class="icon">${type === "store" ? "🏬" : "🧭"}</div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      ${type === "store" ? `<a class="card-link" href="../ofertas/?loja=${encodeURIComponent(item.name)}">Ver ofertas →</a>` : `<a class="card-link" href="../ofertas/?categoria=${encodeURIComponent(item.name)}">Ver categoria →</a>`}
    </article>
  `).join("");
}

function applyUrlFilters(){
  const params = new URLSearchParams(location.search);
  const loja = params.get("loja");
  const categoria = params.get("categoria");
  setTimeout(() => {
    const store = $("#storeFilter");
    const cat = $("#categoryFilter");
    if(loja && store){ store.value = loja; store.dispatchEvent(new Event("input")); }
    if(categoria && cat){ cat.value = categoria; cat.dispatchEvent(new Event("input")); }
  }, 250);
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  renderProducts().then(applyUrlFilters);
  renderCampaigns();
  renderSimpleGrid("../data/categorias.json", "#categoriesGrid", "category");
  renderSimpleGrid("../data/lojas.json", "#storesGrid", "store");
});