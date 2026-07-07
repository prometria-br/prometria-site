const $ = (sel, root=document) => root.querySelector(sel);

async function json(path, fallback=[]){
  try{
    const res = await fetch(path, {cache:"no-store"});
    if(!res.ok) throw new Error(path);
    return await res.json();
  }catch(e){
    return fallback;
  }
}
function money(v){
  if(v === null || v === undefined || v === "") return "";
  const n = Number(v);
  if(!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}
function esc(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}
function attr(value){ return esc(value); }
function isActive(item){
  if((item.status || "").toLowerCase() !== "ativo") return false;
  if(item.validade){
    const d = new Date(item.validade);
    if(!Number.isNaN(d.getTime()) && d.getTime() < Date.now()) return false;
  }
  return true;
}
function menu(){
  const b = $(".menu-btn"), n = $(".nav");
  if(b && n) b.addEventListener("click", () => n.classList.toggle("open"));
}
function cleanText(value, max=90){
  const text = String(value || "").replace(/\s+/g," ").trim();
  if(text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}
function uniqueBadges(values){
  const seen = new Set();
  return values
    .map(v => String(v || "").trim())
    .filter(Boolean)
    .filter(v => {
      const key = v.toLowerCase();
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
function firstOf(obj, keys=[]){
  for(const key of keys){
    const value = obj?.[key];
    if(value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}
function formatNumber(value){
  if(value === undefined || value === null || value === "") return "";
  const n = Number(String(value).replace(",", "."));
  if(Number.isFinite(n)) return n.toLocaleString("pt-BR");
  return String(value);
}
function formatDecimal(value){
  if(value === undefined || value === null || value === "") return "";
  const n = Number(String(value).replace(",", "."));
  if(Number.isFinite(n)) return n.toLocaleString("pt-BR", {minimumFractionDigits:1, maximumFractionDigits:1});
  return String(value);
}
function formatDateBR(value){
  if(!value) return "";
  const d = new Date(value);
  if(Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pt-BR");
}
function metaRow(text, strong=false){
  if(!text) return "";
  return `<div class="meta-row${strong ? ' strong' : ''}">${esc(text)}</div>`;
}
function buildOfferMeta(o){
  const rows = [];
  const cupom = firstOf(o, ["cupom", "codigoCupom", "coupon"]);
  const desconto = firstOf(o, ["desconto", "descontoInformado", "discount"]);
  const vendas = firstOf(o, ["vendas", "sales", "vendasFormatadas"]);
  const avaliacao = firstOf(o, ["avaliacao", "rating", "nota"]);
  const ranking = firstOf(o, ["ranking", "rank"]);
  const score = firstOf(o, ["scoreCuradoria", "score", "curadoria"]);
  const observacao = firstOf(o, ["observacao", "observação", "note"]);

  if(cupom) rows.push(`Cupom disponível: ${cupom}`);

  const stats = [];
  if(vendas) stats.push(`Vendas: ${formatNumber(vendas)}`);
  if(avaliacao) stats.push(`Avaliação: ${formatDecimal(avaliacao)}`);
  if(ranking) stats.push(`Ranking: ${ranking}`);
  if(score) stats.push(`Curadoria: ${score}`);
  if(stats.length) rows.push(stats.join(" • "));

  if(desconto) rows.push(`Desconto informado: ${desconto}`);
  if(observacao) rows.push(cleanText(observacao, 72));
  rows.push("Preço e disponibilidade podem mudar.");

  return rows.slice(0, 3);
}
function offerCard(o){
  const price = o.precoComCupom || o.precoAtual;
  const formattedPrice = money(price);
  const formattedOldPrice = money(o.precoAntigo);
  const badges = uniqueBadges([
    o.plataforma || "Plataforma",
    o.categoria,
    o.destaque ? "Destaque" : ""
  ]);
  const meta = buildOfferMeta(o);
  return `<article class="card offer-card">
    <div class="offer-img">${o.imagem ? `<img src="${attr(o.imagem)}" alt="${attr(o.nome || "Produto em oferta")}" loading="lazy">` : `<span>${esc(o.plataforma || "Oferta")}<br>imagem do produto</span>`}</div>
    <div class="badges">
      ${badges.map(b => `<span class="badge">${esc(b)}</span>`).join("")}
    </div>
    <h3>${esc(cleanText(o.nome || "Oferta selecionada", 78))}</h3>
    ${formattedPrice ? `<div class="price">${formattedPrice}</div>` : `<div class="price">Ver preço atualizado</div>`}
    ${formattedOldPrice ? `<div class="old-price">${formattedOldPrice}</div>` : ""}
    <div class="offer-meta">
      ${meta.map((row, idx) => metaRow(row, idx === 0 && /cupom/i.test(row))).join("")}
    </div>
    <a class="btn primary" href="${attr(o.linkAfiliado || "#")}" target="_blank" rel="noopener">Ver oferta</a>
  </article>`;
}
function couponCard(c){
  const badges = uniqueBadges([c.plataforma || "Plataforma", "Cupom ativo", c.classificacao || "forte"]);
  const rows = [
    c.desconto ? `${c.desconto}${c.valorMinimo ? ` em compras acima de ${c.valorMinimo}` : ""}.` : "Cupom disponível por tempo limitado.",
    c.validade ? `Validade: ${formatDateBR(c.validade)}.` : "Sujeito a regras e disponibilidade.",
    c.observacao || "Confira as regras da campanha antes de aplicar o cupom."
  ];
  return `<article class="card offer-card">
    <div class="badges">
      ${badges.map(b => `<span class="badge">${esc(b)}</span>`).join("")}
    </div>
    <h3>${esc(cleanText(c.nomeCampanha || "Cupom ativo", 78))}</h3>
    <div class="price">${esc(c.codigo || "Ver campanha")}</div>
    <div class="offer-meta">
      ${rows.map((row, idx) => metaRow(row, idx === 0)).join("")}
    </div>
    <a class="btn primary" href="${attr(c.linkCampanha || "#")}" target="_blank" rel="noopener">Usar cupom</a>
  </article>`;
}
async function renderOffers(){
  const grid = $("#offersGrid");
  if(!grid) return;
  const [offers, coupons] = await Promise.all([json("data/offers.json"), json("data/coupons.json")]);
  const validOffers = offers.filter(isActive);
  const validCoupons = coupons.filter(c => isActive(c) && !["fraco","rejeitado"].includes((c.classificacao || "").toLowerCase()));
  const all = [
    ...validCoupons.map(c => ({type:"cupom", platform:c.plataforma || "", category:c.categoria || "", name:`${c.nomeCampanha || ''} ${c.codigo || ''}`.toLowerCase(), html:couponCard(c)})),
    ...validOffers.map(o => ({type:"oferta", platform:o.plataforma || "", category:o.categoria || "", name:`${o.nome || ''} ${o.categoria || ''} ${o.plataforma || ''}`.toLowerCase(), html:offerCard(o)})),
  ];
  const params = new URLSearchParams(window.location.search);
  const defaultPlatform = params.get("plataforma") || "";
  const defaultCategory = params.get("categoria") || "";
  const q = $("#search"), fType = $("#typeFilter"), fPlatform = $("#platformFilter");
  if(defaultPlatform && fPlatform) fPlatform.value = defaultPlatform;
  if(defaultCategory && q) q.value = defaultCategory;

  function draw(){
    const text = (q?.value || "").toLowerCase();
    const type = fType?.value || "";
    const platform = fPlatform?.value || "";
    const filtered = all.filter(item => {
      const haystack = `${item.name} ${item.platform} ${item.category}`.toLowerCase();
      return (!text || haystack.includes(text)) && (!type || item.type === type) && (!platform || item.platform === platform);
    });
    grid.innerHTML = filtered.length ? filtered.map(i => i.html).join("") :
      `<div class="empty"><strong>Nenhuma oferta ou cupom ativo no momento.</strong><br>Novas oportunidades aparecem aqui automaticamente quando forem publicadas.</div>`;
  }
  [q,fType,fPlatform].filter(Boolean).forEach(el => el.addEventListener("input", draw));
  draw();
}
async function renderSitesCats(){
  const sites = $("#platformsGrid"), cats = $("#categoriesGrid");
  if(sites){
    const platforms = await json("data/platforms.json");
    sites.innerHTML = platforms.filter(p => p.status === "ativo").map(p => `<article class="card">
      <div class="mini">Plataforma</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><br>
      <a class="btn" href="ofertas.html?plataforma=${encodeURIComponent(p.name)}">Ver ofertas</a>
    </article>`).join("");
  }
  if(cats){
    const categories = await json("data/categories.json");
    cats.innerHTML = categories.map(c => `<article class="card">
      <div class="card-icon">${esc(c.icon || "•")}</div><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><br>
      <a class="btn" href="ofertas.html?categoria=${encodeURIComponent(c.name)}">Ver ofertas</a>
    </article>`).join("");
  }
}
function socialIcon(id){
  const icons = {
    whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .16 5.34.16 11.92c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.57 0 11.91-5.35 11.92-11.92A11.83 11.83 0 0 0 20.52 3.48Zm-8.45 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.88 9.88 0 0 1-1.53-5.23c0-5.45 4.43-9.88 9.89-9.88 2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.89 6.98c0 5.45-4.44 9.88-9.89 9.88Zm5.42-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37s-1.05 1.02-1.05 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.62.71.23 1.36.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.78 15.17 9.4 20.5c.54 0 .77-.23 1.05-.5l2.52-2.4 5.22 3.82c.96.53 1.64.25 1.9-.89L23.5 4.5c.35-1.4-.5-1.95-1.43-1.6L1.9 10.68c-1.37.53-1.35 1.3-.23 1.64l5.16 1.61L18.8 6.4c.56-.34 1.07-.15.64.19"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.5 1.3a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2Z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.5 2h2.63A4.88 4.88 0 0 0 21 5.87v2.68a7.5 7.5 0 0 1-3.88-1.08v7.06A6.54 6.54 0 1 1 10.58 8v2.74a3.8 3.8 0 1 0 3.92 3.79V2Z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.77 7.74L23.2 22h-6.26l-4.9-7.04L5.88 22H2.76l7.25-8.29L1.2 2h6.42l4.43 6.38L18.9 2Zm-1.1 18h1.73L6.27 3.9H4.4L17.8 20Z"/></svg>`,
    linktree: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.6 2h2.8v4.03l2.86-2.86 1.98 1.98-4.25 4.24v1.22h4.03v2.8H14v1.22l4.25 4.24-1.98 1.98-2.86-2.86V22h-2.8v-4.81l-2.86 2.86-1.98-1.98 4.24-4.24v-1.22H6v-2.8h4.03V8.59L5.8 4.35l1.98-1.98 2.86 2.86V2Z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.13 31.13 0 0 0 0 12a31.13 31.13 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.86.56 9.38.56 9.38.56s7.52 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.13 31.13 0 0 0 24 12a31.13 31.13 0 0 0-.5-5.8ZM9.6 15.98V8.02L16.2 12 9.6 15.98Z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8h2.7l.4-3h-3.1V9.08c0-.87.24-1.46 1.5-1.46h1.6V4.93A21.2 21.2 0 0 0 14.27 4C11.9 4 10.3 5.45 10.3 8.12V11H7.6v3h2.7v8h3.2Z"/></svg>`,
    pinterest: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.7 2 4 5.82 4 9.99c0 2.39.9 4.52 2.83 5.32.32.14.6 0 .69-.34l.28-1.08c.1-.34.06-.46-.2-.76-.58-.7-.96-1.62-.96-2.92 0-3.76 2.82-7.14 7.34-7.14 4 0 6.2 2.45 6.2 5.73 0 4.3-1.9 7.93-4.73 7.93-1.56 0-2.72-1.29-2.34-2.88.44-1.9 1.3-3.95 1.3-5.32 0-1.22-.66-2.24-2.02-2.24-1.6 0-2.88 1.66-2.88 3.88 0 1.42.48 2.38.48 2.38l-1.93 8.18c-.57 2.42-.09 5.39-.05 5.68.03.17.23.21.32.08.13-.17 1.8-2.23 2.36-4.29.16-.58.93-3.58.93-3.58.46.88 1.82 1.65 3.26 1.65 4.29 0 7.2-3.92 7.2-9.17C20.5 5.7 16.93 2 12.04 2Z"/></svg>`
  };
  return icons[id] || `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>`;
}
async function renderChannels(){
  const grid = $("#channelsGrid");
  if(!grid) return;
  const channels = await json("data/channels.json");
  grid.innerHTML = channels.filter(c => c.status === "ativo").map(c => `<article class="card channel-card" id="${attr(c.id)}">
    <div class="channel-top">
      <div class="channel-icon" data-brand="${attr((c.id || '').toLowerCase())}">${socialIcon((c.id || '').toLowerCase())}</div>
      <div><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p></div>
    </div>
    <a class="btn primary" href="${attr(c.url)}" target="_blank" rel="noopener">${esc(c.label || "Acessar")}</a>
  </article>`).join("");
}
document.addEventListener("DOMContentLoaded", () => {
  menu();
  renderOffers();
  renderSitesCats();
  renderChannels();
});
