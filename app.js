const $=s=>document.querySelector(s),e=AM.esc,price=AM.price,M=AM.money;
let P=AM.load(),cat="Todos",cart=[],sel=null,info={};
const DEL=[["Transportadora","Valor demonstrativo"],["Correios","Valor demonstrativo"],["Motoboy","Valor demonstrativo"],["Retirada na loja","Sem custo"]];

function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function open(html,cls="",dr=false){const o=$("#ov");o.className="ov"+(dr?" dr":"");o.innerHTML=`<div class="box ${cls}" role="dialog" aria-modal="true"><button class="x" data-a="close" aria-label="Fechar">✕</button>${html}</div>`;o.hidden=false;document.body.style.overflow="hidden"}
function close(){$("#ov").hidden=true;$("#ov").innerHTML="";document.body.style.overflow=""}

function head(){
  $("#chips").innerHTML=["Todos",...AM.CATS].map(c=>`<button class="chip ${c===cat?"on":""}" data-a="cat" data-c="${e(c)}">${e(c)}</button>`).join("");
  $("#tiles").innerHTML=AM.CATS.map(c=>`<button class="tile" data-a="cat" data-c="${e(c)}" data-go="1">${e(c)}</button>`).join("");
}
function card(p){
  const promo=p.promo>0&&p.promo<p.price,out=p.stock<=0;
  return `<button class="card" data-a="prod" data-id="${e(p.id)}"><div class="ph"><img src="${e(p.imgs[0]||AM.img(p.name))}" alt="${e(p.name)}" loading="lazy">${out?'<span class="bdg k">Esgotado</span>':promo?'<span class="bdg">Promoção</span>':""}</div>
  <div class="ci"><small>${e(p.cat)}</small><h3>${e(p.name)}</h3><div class="pr">${promo?`<s>${M(p.price)}</s>`:""}${M(price(p))}</div></div></button>`}
function grid(){const L=P.filter(p=>cat==="Todos"||p.cat===cat);$("#grid").innerHTML=L.length?L.map(card).join(""):'<p class="empty">Nenhum produto nesta categoria por enquanto.</p>'}
function cnt(){$("#cnt").textContent=cart.reduce((a,i)=>a+i.qty,0)}
function refresh(){P=AM.load();head();grid()}

function prod(id){
  const p=P.find(x=>x.id===id);if(!p)return;
  sel={id,size:p.sizes[0]||"",color:p.colors[0]||"",qty:1,img:0};drawProd()}
function drawProd(){
  const p=P.find(x=>x.id===sel.id),promo=p.promo>0&&p.promo<p.price,imgs=p.imgs.length?p.imgs:[AM.img(p.name)],out=p.stock<=0;
  open(`<div class="pd"><div class="gal"><div class="main"><img src="${e(imgs[sel.img]||imgs[0])}" alt="${e(p.name)}"><button class="zoom" data-a="zoom">🔍 Ampliar</button></div>
  <div class="th">${imgs.map((s,i)=>`<button class="${i===sel.img?"on":""}" data-a="th" data-i="${i}" aria-label="Foto ${i+1}"><img src="${e(s)}" alt=""></button>`).join("")}</div></div>
  <div><small style="color:var(--m)">${e(p.cat)}</small><h2>${e(p.name)}</h2>
  <div class="pr">${promo?`<s>${M(p.price)}</s>`:""}${M(price(p))}</div><p class="d">${e(p.desc)}</p>
  ${p.sizes.length?`<div class="lb">Tamanho</div><div class="opts">${p.sizes.map(s=>`<button class="op ${s===sel.size?"on":""}" data-a="size" data-v="${e(s)}">${e(s)}</button>`).join("")}</div>`:""}
  ${p.colors.length?`<div class="lb">Cor</div><div class="opts">${p.colors.map(s=>`<button class="op ${s===sel.color?"on":""}" data-a="color" data-v="${e(s)}">${e(s)}</button>`).join("")}</div>`:""}
  <div class="lb">Quantidade</div><div class="qty"><button data-a="q-" aria-label="Diminuir">−</button><span>${sel.qty}</span><button data-a="q+" aria-label="Aumentar">+</button></div>
  <div class="stk ${p.stock<=5?"lo":""}">${out?"Produto esgotado":p.stock<=5?`Últimas ${p.stock} unidades`:`${p.stock} unidades em estoque`}</div>
  <button class="btn full" style="margin-top:20px" data-a="add" ${out?"disabled":""}>${out?"Indisponível":"Adicionar ao carrinho"}</button></div></div>`,"");
}
function add(){
  const p=P.find(x=>x.id===sel.id),k=i=>i.id===sel.id&&i.size===sel.size&&i.color===sel.color,f=cart.find(k);
  if(f)f.qty=Math.min(p.stock,f.qty+sel.qty);else cart.push({id:sel.id,size:sel.size,color:sel.color,qty:sel.qty});
  cnt();close();toast("Adicionado ao carrinho");drawCart()}
const total=()=>cart.reduce((a,i)=>{const p=P.find(x=>x.id===i.id);return a+(p?price(p)*i.qty:0)},0);
function line(i,idx){const p=P.find(x=>x.id===i.id);if(!p)return"";
  return `<div class="ci-row"><img src="${e(p.imgs[0]||AM.img(p.name))}" alt=""><div><h4>${e(p.name)}</h4><small>Tam. ${e(i.size)} · ${e(i.color)} · ${M(price(p))}</small>
  <div class="ln"><div class="qty s"><button data-a="cq-" data-i="${idx}" aria-label="Diminuir">−</button><span>${i.qty}</span><button data-a="cq+" data-i="${idx}" aria-label="Aumentar">+</button></div><b>${M(price(p)*i.qty)}</b><button class="rm" data-a="rm" data-i="${idx}">Remover</button></div></div></div>`}
function drawCart(){
  open(`<h2 style="font-size:24px;font-weight:900;margin-bottom:6px">Seu carrinho</h2><span class="demo" style="align-self:flex-start">FUNCIONALIDADE DEMONSTRATIVA</span>
  <div class="cart-list">${cart.length?cart.map(line).join(""):'<p class="empty" style="padding:40px 0">Seu carrinho está vazio.<br>Escolha um produto na vitrine.</p>'}</div>
  ${cart.length?`<div class="tot"><span>Total</span><span>${M(total())}</span></div><button class="btn full" data-a="checkout">Finalizar pedido</button>`:""}`,"",true)}
function checkout(){
  open(`<h2 style="font-size:24px;font-weight:900;margin-bottom:6px">Finalizar pedido</h2><span class="demo">CHECKOUT DEMONSTRATIVO · nada é enviado</span>
  <div class="ck" style="margin-top:20px"><div><h3>Dados do cliente</h3><div class="fm">
  <label class="f f2">Nome<input id="cn" value="${e(info.n||"")}" autocomplete="name"></label>
  <label class="f">WhatsApp<input id="cw" inputmode="tel" value="${e(info.w||"")}" placeholder="(00) 00000-0000"></label>
  <label class="f">CEP<input id="cc" inputmode="numeric" value="${e(info.c||"")}"></label>
  <label class="f f2">Endereço<input id="ca" value="${e(info.a||"")}"></label></div>
  <h3>Entrega</h3>${DEL.map((d,i)=>`<label class="rd"><input type="radio" name="dl" value="${i}" ${(info.d??0)==i?"checked":""}><b>${d[0]}</b><small>${d[1]}</small></label>`).join("")}
  <p class="note">Frete calculado na versão comercial.</p>
  <h3>Pagamento</h3><label class="rd"><input type="radio" name="pg" value="Pix" ${(info.g||"Pix")=="Pix"?"checked":""}><b>Pix</b></label>
  <label class="rd"><input type="radio" name="pg" value="Cartão" ${info.g=="Cartão"?"checked":""}><b>Cartão</b><small>Dados do cartão não são solicitados</small></label>
  <p class="note">Mercado Pago: futura integração na versão comercial.</p></div>
  <div class="sum"><h3>Resumo</h3><ul>${cart.map(i=>{const p=P.find(x=>x.id===i.id);return p?`<li><span>${i.qty}× ${e(p.name)}</span><b>${M(price(p)*i.qty)}</b></li>`:""}).join("")}</ul>
  <div class="tot" style="padding:12px 0"><span>Total</span><span>${M(total())}</span></div><button class="btn full" data-a="review">Revisar pedido</button>
  <button class="btn out full" style="margin-top:8px" data-a="cart">Voltar ao carrinho</button></div></div>`,"");}
function grab(){info={n:$("#cn").value,w:$("#cw").value,c:$("#cc").value,a:$("#ca").value,d:+document.querySelector('[name=dl]:checked').value,g:document.querySelector('[name=pg]:checked').value}}
function review(){
  grab();if(!info.n.trim()||!info.w.trim()){toast("Preencha nome e WhatsApp para continuar");return}
  open(`<h2 style="font-size:24px;font-weight:900;margin-bottom:6px">Pedido pronto para envio</h2><span class="demo">DEMONSTRAÇÃO</span>
  <div class="ck" style="margin-top:20px"><div><h3>Produtos</h3>${cart.map(line2).join("")}
  <h3>Observações</h3><label class="f"><textarea placeholder="Alguma observação sobre o pedido?"></textarea></label></div>
  <div class="sum"><ul><li><span>Cliente</span><b>${e(info.n)}</b></li><li><span>Entrega</span><b>${DEL[info.d][0]}</b></li><li><span>Pagamento</span><b>${e(info.g)}</b></li></ul>
  <div class="tot" style="padding:12px 0"><span>Total</span><span>${M(total())}</span></div>
  <button class="btn full" data-a="send">Enviar pedido pelo WhatsApp</button><button class="btn out full" style="margin-top:8px" data-a="checkout">Editar dados</button>
  <p class="note">Integração com WhatsApp será implementada na versão comercial.</p></div></div>`,"");}
function line2(i){const p=P.find(x=>x.id===i.id);return p?`<div class="ci-row"><img src="${e(p.imgs[0]||AM.img(p.name))}" alt=""><div><h4>${e(p.name)}</h4><small>Tam. ${e(i.size)} · Cor ${e(i.color)} · Qtd. ${i.qty}</small><div class="ln"><b>${M(price(p)*i.qty)}</b></div></div></div>`:""}
function send(){open(`<div style="text-align:center;padding:12px 0"><div style="font-size:44px">💬</div><h2 style="font-size:22px;margin:10px 0">Demonstração</h2>
  <p style="color:var(--m)">Nesta etapa, o pedido seria enviado para o WhatsApp da AM Sport.</p><p class="note">Nenhum dado foi enviado.</p>
  <button class="btn full" style="margin-top:20px" data-a="done">Entendi</button></div>`,"sm")}

document.addEventListener("click",ev=>{
  const t=ev.target.closest("[data-a]");
  if(ev.target.id==="ov"){close();return}
  if(ev.target.closest("#cartBtn")){drawCart();return}
  if(ev.target.closest("#burger")){$("#menu").classList.toggle("open");return}
  if(ev.target.closest("#menu a"))$("#menu").classList.remove("open");
  if(!t)return;const a=t.dataset.a,i=+t.dataset.i,p=sel&&P.find(x=>x.id===sel.id);
  if(a==="close")close();
  else if(a==="cat"){cat=t.dataset.c;head();grid();if(t.dataset.go)document.getElementById("produtos").scrollIntoView()}
  else if(a==="prod")prod(t.dataset.id);
  else if(a==="th"){sel.img=i;drawProd()}
  else if(a==="size"){sel.size=t.dataset.v;drawProd()}
  else if(a==="color"){sel.color=t.dataset.v;drawProd()}
  else if(a==="q+"){sel.qty=Math.min(Math.max(p.stock,1),sel.qty+1);drawProd()}
  else if(a==="q-"){sel.qty=Math.max(1,sel.qty-1);drawProd()}
  else if(a==="zoom"){const o=document.createElement("div");o.className="ov lbx";o.innerHTML=`<img src="${e(p.imgs[sel.img]||p.imgs[0])}" alt="">`;o.onclick=()=>o.remove();document.body.appendChild(o)}
  else if(a==="add")add();
  else if(a==="cq+"){const q=P.find(x=>x.id===cart[i].id);cart[i].qty=Math.min(q.stock,cart[i].qty+1);cnt();drawCart()}
  else if(a==="cq-"){cart[i].qty=Math.max(1,cart[i].qty-1);cnt();drawCart()}
  else if(a==="rm"){cart.splice(i,1);cnt();drawCart()}
  else if(a==="cart")drawCart();
  else if(a==="checkout"){if(document.getElementById("cn"))grab();checkout()}
  else if(a==="review")review();
  else if(a==="send")send();
  else if(a==="done"){cart=[];info={};cnt();close()}
});
document.addEventListener("keydown",ev=>{if(ev.key==="Escape")close()});
window.addEventListener("storage",refresh);window.addEventListener("pageshow",refresh);
head();grid();cnt();
