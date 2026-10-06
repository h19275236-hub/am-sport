const AM={
CATS:["Camisas Dry Fit","Shorts Dry Fit","Bonés","Shorts Elastano","Calças Elastano","Meias","Cuecas","Calças Legging","Regatas Femininas","Shorts Feminino","Conjuntos Femininos","Plus Size"],
KEY:"amsport_products_v1",
money:n=>"R$ "+Number(n).toFixed(2).replace(".",","),
esc:s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),
price:p=>p.promo>0&&p.promo<p.price?p.promo:p.price,
img(label,i=0){const c=["#0a58ff","#0b0d12","#0637b8","#1d4ed8"][i%4],l=String(label).replace(/[<>&'"]/g,"");
return"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='${c}'/><path d='M0 450L600 230V600H0Z' fill='#fff' opacity='.08'/><text x='300' y='290' font-family='Arial Black,Arial' font-size='56' font-weight='900' font-style='italic' fill='#fff' text-anchor='middle'>AM SPORT</text><text x='300' y='345' font-family='Arial' font-size='24' fill='#fff' opacity='.75' text-anchor='middle'>${l.slice(0,34)}</text></svg>`)},
seed(){const S=[["Camisa Dry Fit AM Sport",0,79.9,0,25],["Camisa Dry Fit Performance",0,59.9,49.9,18],["Shorts Dry Fit Performance",1,59.9,0,30],["Short Dry Fit Sport",1,49.9,0,12],
["Boné AM Sport",2,49.9,0,40],["Boné Aba Curva Preto",2,39.9,34.9,3],["Shorts Elastano Pro",3,69.9,0,22],["Calça Elastano Treino",4,99.9,0,9],["Calça Elastano Pro",4,119.9,99.9,14],
["Meia Esportiva Cano Médio",5,24.9,0,60],["Meia Esportiva Cano Alto",5,29.9,0,0],["Cueca Boxer Sport",6,34.9,0,35],["Cueca Boxer Dry",6,39.9,32.9,20],
["Calça Legging Feminina",7,89.9,79.9,16],["Legging Cintura Alta",7,94.9,0,11],["Regata Feminina Performance",8,54.9,0,27],["Regata Feminina Dry Fit",8,49.9,0,19],
["Shorts Feminino Fitness",9,59.9,0,24],["Conjunto Feminino AM",10,99.9,0,8],["Legging Plus Size Fit",11,99.9,89.9,13]];
const sz=c=>c==2?["Único"]:c==5?["38-40","41-44"]:c==11?["G1","G2","G3"]:["P","M","G","GG"];
return S.map((s,i)=>({id:"p"+(i+1),name:s[0],cat:AM.CATS[s[1]],price:s[2],promo:s[3],stock:s[4],sizes:sz(s[1]),colors:["Preto","Azul","Branco"],
desc:"Produto demonstrativo da AM Sport. Conforto, estilo e praticidade para o seu treino e o dia a dia.",imgs:[AM.img(s[0],0),AM.img(s[0],1),AM.img(s[0],2)]}))},
load(){try{const r=localStorage.getItem(AM.KEY);if(r)return JSON.parse(r)}catch(x){}const s=AM.seed();AM.save(s);return s},
save(l){try{localStorage.setItem(AM.KEY,JSON.stringify(l));return true}catch(x){return false}}
};
