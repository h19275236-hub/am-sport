const $=s=>document.querySelector(s),e=AM.esc,M=AM.money;
let P=AM.load(),view="dash",q="",edit=null,pend=[];
const logged=()=>sessionStorage.getItem("am_admin")==="1";
const list=s=>String(s).split(",").map(x=>x.trim()).filter(Boolean);
const num=v=>parseFloat(String(v).replace(",","."))||0;
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2400)}
function persist(){if(!AM.save(P))toast("Armazenamento cheio: use imagens menores.")}

function login(){
  $("#hd").innerHTML='<span class="logo">AM<span>ADMIN</span></span>';
  $("#app").innerHTML=`<div class="login"><form class="lc" id="lf"><div class="mk">AM</div><h1>Painel AM Sport</h1><p>Área administrativa</p>
  <label class="f">E-mail<input id="em" type="email" autocomplete="username" required></label>
  <label class="f">Senha<input id="pw" type="password" autocomplete="current-password" required></label>
  <div class="hint"><b>Painel Administrativo — Demonstração.</b><br>E-mail: admin@amsport.com<br>Senha: admin123</div>
  <p class="err" id="er" role="alert"></p><button class="btn full" type="submit">Entrar no painel</button></form></div>`;
  $("#lf").onsubmit=ev=>{ev.preventDefault();
    if($("#em").value.trim()==="admin@amsport.com"&&$("#pw").value==="admin123"){sessionStorage.setItem("am_admin","1");shell()}
    else $("#er").textContent="E-mail ou senha incorretos. Use as credenciais de demonstração."}}

function shell(){
  const T=[["dash","Dashboard"],["prod","Produtos"],["stk","Estoque"]];
  $("#hd").innerHTML=`<span class="logo">AM<span>ADMIN</span></span><nav class="tabs">${T.map(t=>`<button class="${view===t[0]?"on":""}" data-v="${t[0]}">${t[1]}</button>`).join("")}</nav><button class="btn sm ghost exit" id="out">Sair</button>`;
  $("#hd").querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{view=b.dataset.v;shell()});
  $("#out").onclick=()=>{sessionStorage.removeItem("am_admin");login()};
  $("#app").innerHTML=`<div class="w am" id="main"></div>`;
  ({dash,prod,stk})[view]()}

function dash(){
  const st=P.reduce((a,p)=>a+(+p.stock||0),0),low=P.filter(p=>p.stock<=5);
  $("#main").innerHTML=`<div class="ah"><h1>Dashboard</h1><span class="demo">Painel demonstrativo — dados armazenados apenas neste navegador</span></div>
  <div class="cards"><div class="kc bl"><small>Produtos</small><b>${P.length}</b></div><div class="kc"><small>Estoque total</small><b>${st}</b></div>
  <div class="kc"><small>Pedidos</small><b>128</b><em>Valor fictício</em></div><div class="kc"><small>Faturamento</small><b>R$ 18.450</b><em>Valor fictício</em></div></div>
  <div class="pn"><h3>Estoque baixo ou esgotado</h3>${low.length?low.map(p=>`<div class="pr-r e"><img src="${e(p.imgs[0]||AM.img(p.name))}" alt=""><div><b class="n">${e(p.name)}</b><small>${e(p.cat)}</small></div><span class="st ${p.stock<=0?"o":""}">${p.stock<=0?"Esgotado":p.stock+" un."}</span></div>`).join(""):'<p style="padding:20px 18px;color:var(--m)">Nenhum produto com estoque baixo.</p>'}</div>
  <button class="btn out" id="rs">Restaurar produtos de exemplo</button>`;
  $("#rs").onclick=()=>{if(confirm("Restaurar os produtos de exemplo? Alterações locais serão perdidas.")){P=AM.seed();persist();shell();toast("Produtos restaurados")}}}

function prod(){
  const L=P.filter(p=>(p.name+p.cat).toLowerCase().includes(q.toLowerCase()));
  $("#main").innerHTML=`<div class="ah"><h1>Produtos cadastrados</h1><button class="btn" id="nw">+ Novo produto</button></div>
  <p style="margin-bottom:14px"><input class="srch" id="sr" placeholder="Buscar produto ou categoria" value="${e(q)}"></p>
  <div class="pn"><div class="pr-r hd"><span></span><span>Produto</span><span>Preço</span><span>Promo</span><span>Estoque</span><span>Status</span><span>Ações</span></div>
  ${L.map(p=>`<div class="pr-r"><img src="${e(p.imgs[0]||AM.img(p.name))}" alt=""><div><b class="n">${e(p.name)}</b><small>${e(p.cat)}</small></div><span>${M(p.price)}</span><span>${p.promo>0?M(p.promo):"—"}</span><span>${p.stock}</span>
  <span><span class="st ${p.stock<=0?"o":""}">${p.stock<=0?"Esgotado":"Ativo"}</span></span><div class="acts"><button class="btn out sm" data-ed="${e(p.id)}">Editar</button><button class="btn red sm" data-dl="${e(p.id)}">Excluir</button></div></div>`).join("")||'<p style="padding:24px;color:var(--m)">Nenhum produto encontrado. Clique em “Novo produto” para cadastrar.</p>'}</div>`;
  $("#nw").onclick=()=>form(null);
  $("#sr").oninput=ev=>{q=ev.target.value;const c=ev.target.selectionStart;prod();const s=$("#sr");s.focus();s.setSelectionRange(c,c)};
  document.querySelectorAll("[data-ed]").forEach(b=>b.onclick=()=>form(b.dataset.ed));
  document.querySelectorAll("[data-dl]").forEach(b=>b.onclick=()=>{if(confirm("Excluir este produto?")){P=P.filter(p=>p.id!==b.dataset.dl);persist();prod();toast("Produto excluído")}})}

function stk(){
  $("#main").innerHTML=`<div class="ah"><h1>Controle de estoque</h1><span class="demo">Salvo apenas neste navegador</span></div><div class="pn">
  ${P.map(p=>`<div class="pr-r e"><img src="${e(p.imgs[0]||AM.img(p.name))}" alt=""><div><b class="n">${e(p.name)}</b><small>${e(p.cat)}</small></div>
  <div class="qty"><button data-s="-1" data-id="${e(p.id)}" aria-label="Diminuir">−</button><span>${p.stock}</span><button data-s="1" data-id="${e(p.id)}" aria-label="Aumentar">+</button></div></div>`).join("")}</div>`;
  document.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{const p=P.find(x=>x.id===b.dataset.id);p.stock=Math.max(0,p.stock+ +b.dataset.s);persist();const y=scrollY;stk();scrollTo(0,y)})}

function resize(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const m=700,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.75))};im.onerror=()=>res(null);im.src=r.result};r.onerror=()=>res(null);r.readAsDataURL(file)})}

function form(id){
  edit=id?P.find(p=>p.id===id):null;pend=edit?[...edit.imgs]:[];const p=edit||{name:"",cat:AM.CATS[0],price:"",promo:"",stock:"",sizes:[],colors:[],desc:""},o=$("#ov");
  o.className="ov";o.hidden=false;document.body.style.overflow="hidden";
  o.innerHTML=`<form class="box md" id="pf"><button type="button" class="x" id="cx" aria-label="Fechar">✕</button><h2 style="font-size:24px;font-weight:900;margin-bottom:18px">${edit?"Editar produto":"Cadastrar produto"}</h2>
  <div class="fm"><label class="f f2">Nome do produto<input id="fn" required value="${e(p.name)}"></label>
  <label class="f">Preço (R$)<input id="fp" required inputmode="decimal" value="${p.price===""?"":String(p.price).replace(".",",")}"></label>
  <label class="f">Preço promocional (R$)<input id="fo" inputmode="decimal" value="${p.promo?String(p.promo).replace(".",","):""}"></label>
  <label class="f">Categoria<select id="fc">${AM.CATS.map(c=>`<option ${c===p.cat?"selected":""}>${e(c)}</option>`).join("")}</select></label>
  <label class="f">Estoque<input id="fs" type="number" min="0" required value="${p.stock}"></label>
  <label class="f">Tamanhos <span class="hlp">(separe por vírgula)</span><input id="fz" placeholder="P, M, G" value="${e(p.sizes.join(", "))}"></label>
  <label class="f">Cores <span class="hlp">(separe por vírgula)</span><input id="fk" placeholder="Preto, Azul" value="${e(p.colors.join(", "))}"></label>
  <label class="f f2">Descrição<textarea id="fd">${e(p.desc)}</textarea></label>
  <label class="f f2">Fotos <span class="hlp">(uma ou várias; a primeira é a capa)</span><input id="fi" type="file" accept="image/*" multiple style="padding:10px 14px"></label>
  <div class="f2 imgs" id="pv"></div></div>
  <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap"><button class="btn" style="flex:1;min-width:160px" type="submit">${edit?"Salvar produto":"Cadastrar produto"}</button><button type="button" class="btn out" id="cc">Cancelar</button></div></form>`;
  const pv=()=>$("#pv").innerHTML=pend.map(s=>`<img src="${e(s)}" alt="">`).join("");pv();
  const x=()=>{o.hidden=true;o.innerHTML="";document.body.style.overflow=""};$("#cx").onclick=x;$("#cc").onclick=x;
  $("#fi").onchange=async ev=>{const f=[...ev.target.files],r=(await Promise.all(f.map(resize))).filter(Boolean);if(r.length){pend=r;pv()}};
  $("#pf").onsubmit=ev=>{ev.preventDefault();const n=$("#fn").value.trim();if(!n)return;
    const d={name:n,cat:$("#fc").value,price:num($("#fp").value),promo:num($("#fo").value),stock:Math.max(0,parseInt($("#fs").value)||0),sizes:list($("#fz").value),colors:list($("#fk").value),desc:$("#fd").value.trim()||"Produto AM Sport.",imgs:pend.length?pend:[AM.img(n,0),AM.img(n,1)]};
    if(edit)Object.assign(edit,d);else P.unshift({id:"u"+Date.now(),...d});
    persist();x();toast(edit?"Produto atualizado":"Produto cadastrado. Já aparece na loja.");edit=null;view="prod";shell()}}

window.addEventListener("storage",()=>{P=AM.load()});
logged()?shell():login();
