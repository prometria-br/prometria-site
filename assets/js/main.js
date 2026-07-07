const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

async function json(path, fallback=[]){
  try{
    const res = await fetch(path, {cache:"no-store"});
    if(!res.ok) throw new Error(path);
    return await res.json();
  }catch(e){ return fallback; }
}
function money(v){
  if(v === null || v === undefined || v === "") return "";
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}
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
function offerCard(o){
  const price = o.precoComCupom || o.precoAtual;
  return `<article class="card">
    <div class="offer-img">${o.imagem ? `<img src="${o.imagem}" alt="">` : `<span>${o.plataforma || "Oferta"}<br>imagem do produto</span>`}</div>
    <div class="badges">
      <span class="badge">${o.plataforma || "Plataforma"}</span>
      <span class="badge">${o.categoria || "Categoria"}</span>
      ${o.cupom ? `<span class="badge">Cupom ${o.cupom}</span>` : ""}
    </div>
    <h3>${o.nome || "Oferta selecionada"}</h3>
    ${price ? `<div class="price">${money(price)}</div>` : `<div class="price">Ver preço atualizado</div>`}
    ${o.precoAntigo ? `<div class="old-price">${money(o.precoAntigo)}</div>` : ""}
    <p>${o.observacao || "Preço e disponibilidade podem mudar."}</p>
    <br>
    <a class="btn primary" href="${o.linkAfiliado || "#"}" target="_blank" rel="noopener">Ver oferta</a>
  </article>`;
}
function couponCard(c){
  return `<article class="card">
    <div class="badges">
      <span class="badge">${c.plataforma || "Plataforma"}</span>
      <span class="badge">Ativo</span>
      <span class="badge">${c.classificacao || "forte"}</span>
    </div>
    <h3>${c.nomeCampanha || "Cupom ativo"}</h3>
    <div class="price">${c.codigo || "Ver campanha"}</div>
    <p>${c.desconto || ""}${c.valorMinimo ? ` em compras acima de ${c.valorMinimo}` : ""}</p>
    <p>${c.observacao || "Sujeito a alteração."}</p>
    <br>
    <a class="btn primary" href="${c.linkCampanha || "#"}" target="_blank" rel="noopener">Usar cupom</a>
  </article>`;
}
async function renderOffers(){
  const grid = $("#offersGrid");
  if(!grid) return;
  const [offers, coupons] = await Promise.all([json("data/offers.json"), json("data/coupons.json")]);
  const validOffers = offers.filter(isActive);
  const validCoupons = coupons.filter(c => isActive(c) && !["fraco","rejeitado"].includes((c.classificacao || "").toLowerCase()));
  const all = [
    ...validCoupons.map(c => ({type:"cupom", platform:c.plataforma, category:c.categoria, html:couponCard(c)})),
    ...validOffers.map(o => ({type:"oferta", platform:o.plataforma, category:o.categoria, html:offerCard(o)})),
  ];
  const q = $("#search"), fType = $("#typeFilter"), fPlatform = $("#platformFilter");
  function draw(){
    const text = (q?.value || "").toLowerCase();
    const type = fType?.value || "";
    const platform = fPlatform?.value || "";
    const filtered = all.filter(item => {
      const raw = item.html.toLowerCase();
      return (!text || raw.includes(text)) && (!type || item.type === type) && (!platform || item.platform === platform);
    });
    grid.innerHTML = filtered.length ? filtered.map(i => i.html).join("") :
      `<div class="empty"><strong>Nenhuma oferta ou cupom ativo no momento.</strong><br>Para publicar itens reais, edite <code>data/offers.json</code> e <code>data/coupons.json</code>.</div>`;
  }
  [q,fType,fPlatform].filter(Boolean).forEach(el => el.addEventListener("input", draw));
  draw();
}
async function renderSitesCats(){
  const sites = $("#platformsGrid"), cats = $("#categoriesGrid");
  if(sites){
    const platforms = await json("data/platforms.json");
    sites.innerHTML = platforms.filter(p => p.status === "ativo").map(p => `<article class="card">
      <div class="mini">Plataforma</div><h3>${p.name}</h3><p>${p.description}</p><br>
      <a class="btn" href="ofertas.html?plataforma=${encodeURIComponent(p.name)}">Ver ofertas</a>
    </article>`).join("");
  }
  if(cats){
    const categories = await json("data/categories.json");
    cats.innerHTML = categories.map(c => `<article class="card">
      <div class="card-icon">${c.icon || "•"}</div><h3>${c.name}</h3><p>${c.description}</p><br>
      <a class="btn" href="ofertas.html?categoria=${encodeURIComponent(c.name)}">Ver ofertas</a>
    </article>`).join("");
  }
}
async function renderChannels(){
  const grid = $("#channelsGrid");
  if(!grid) return;
  const channels = await json("data/channels.json");
  grid.innerHTML = channels.filter(c => c.status === "ativo").map(c => `<article class="card channel-card" id="${c.id}">
    <div class="channel-top"><div class="channel-icon">${c.icon || "•"}</div><div><h3>${c.name}</h3><p>${c.description}</p></div></div>
    <a class="btn primary" href="${c.url}" target="_blank" rel="noopener">${c.label || "Acessar"}</a>
  </article>`).join("");
}
document.addEventListener("DOMContentLoaded", () => {
  menu();
  renderOffers();
  renderSitesCats();
  renderChannels();
});