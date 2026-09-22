(() => {
  "use strict";

  const C={green:"#17463A",deep:"#0E3129",gold:"#B8944A",clay:"#A65F45",sand:"#E8DDC9",muted:"#756E64",paper:"#FFFCF6",grid:"#DDD4C4"};
  const AREAS=["العزيزية","الشوقية","العوالي","النسيم","الزاهر","الشرائع","بطحاء قريش"];
  const CATS=["المطاعم والمقاهي","التجارب والأنشطة","التسوق","الترفيه","الثقافة","الخدمات","المجتمعات","الضيافة"];
  const AUD=["سكان مكة","الزوار"];
  const PAGES=[["لوحة المعلومات","◫"],["تحليل الطلب","⌁"],["تحليل المناطق","⌖"],["الأنشطة والتجارب","◇"],["المجتمعات والاهتمامات","◎"],["الحملات والعروض","◌"],["الفرص والفجوات","△"],["التقارير","▤"]];
  const AF={"العزيزية":1.23,"الشوقية":.92,"العوالي":1.06,"النسيم":.84,"الزاهر":.79,"الشرائع":.72,"بطحاء قريش":.68};
  const CF={"المطاعم والمقاهي":1.28,"التجارب والأنشطة":1.20,"التسوق":.98,"الترفيه":.91,"الثقافة":.83,"الخدمات":.77,"المجتمعات":.74,"الضيافة":.88};
  const CG={"المطاعم والمقاهي":.10,"التجارب والأنشطة":.16,"التسوق":.05,"الترفيه":.13,"الثقافة":.09,"الخدمات":.03,"المجتمعات":.14,"الضيافة":.07};

  const ACTIVITIES=[
    ["جولة ذاكرة مكة","الثقافة","العزيزية",11240,1630,890,370,310,180,.21],["مساء الخط العربي","الثقافة","الشوقية",8240,1190,620,240,210,125,.18],
    ["تجربة القهوة السعودية","المطاعم والمقاهي","العوالي",15420,2480,1490,690,610,390,.27],["مسار الأسواق القديمة","التجارب والأنشطة","النسيم",12980,2020,1210,530,470,290,.24],
    ["مختبر الصغار الإبداعي","الترفيه","الزاهر",10850,1780,990,460,380,220,.31],["جلسة تصوير معالم مكة","الثقافة","الشرائع",9350,1410,780,310,280,175,.16],
    ["ورشة الحرف المحلية","الثقافة","بطحاء قريش",7780,1260,690,290,260,155,.34],["ليلة القصص المكية","المجتمعات","العزيزية",6880,1040,610,260,210,120,.29],
    ["مشي العوالي المسائي","التجارب والأنشطة","العوالي",14450,2140,1310,580,520,340,.25],["تجربة المذاقات الحجازية","المطاعم والمقاهي","الشوقية",13740,2260,1390,620,560,360,.22]
  ].map(x=>({activity:x[0],category:x[1],area:x[2],views:x[3],saves:x[4],plans:x[5],joins:x[6],actions:x[7],complete:x[8],growth:x[9]}));

  const COMM=[
    ["الأحياء",18600,4210,.18,"الخدمات المحلية، توصيات الأحياء","توصيات"],["زوار مكة",24400,5720,.24,"أماكن قريبة، تنظيم اليوم","أسئلة"],
    ["الحج والعمرة",19800,4630,.15,"التجهيز، التنقل، التجربة","تحديثات"],["المطاعم والتجارب",27900,6840,.31,"مطاعم عائلية، قهوة، تجارب","توصيات"],
    ["الثقافة والتاريخ",14300,3560,.27,"المعالم، الحكايات، المتاحف","مساهمات"],["التطوع والمبادرات",9100,2080,.12,"فرص التطوع، مبادرات الحي","تحديثات"],
    ["التعليم والهوايات",12100,2990,.22,"ورش، تعلم، نوادٍ","أسئلة"],["الحياة في مكة",17100,4030,.20,"الخدمات اليومية، العائلة","تقارير"]
  ].map(x=>({community:x[0],members:x[1],engagement:x[2],growth:x[3],themes:x[4],type:x[5]}));

  const CAMPS=[
    ["عطلة نهاية الأسبوع","الترفيه","سكان مكة",185000,70400,26100,8200,3900,.14],["تجارب المساء","التجارب والأنشطة","الزوار",214000,88300,34700,11700,5800,.19],
    ["نكهات مكة","المطاعم والمقاهي","الكل",268000,112000,45600,16100,7900,.23],["اكتشف الثقافة","الثقافة","الزوار",149000,61100,23100,7700,3600,.17],
    ["قريب منك","الخدمات","سكان مكة",132000,49200,17800,5400,2100,.08]
  ].map(x=>({campaign:x[0],category:x[1],audience:x[2],impressions:x[3],views:x[4],details:x[5],saves:x[6],handoffs:x[7],growth:x[8]}));

  const TERMS=[
    ["مطاعم عائلية","المطاعم والمقاهي",92,.16],["قهوة مختصة","المطاعم والمقاهي",88,.11],["أنشطة للأطفال","الترفيه",84,.27],["فعاليات نهاية الأسبوع","التجارب والأنشطة",81,.22],
    ["تجارب ثقافية","الثقافة",74,.31],["أماكن هادئة","التجارب والأنشطة",72,.18],["ورش فنية","الثقافة",66,.35],["أماكن قريبة","الخدمات",64,.09],
    ["مطاعم بإطلالة","المطاعم والمقاهي",61,.14],["أنشطة مسائية","الترفيه",59,.29],["تجارب للعائلة","التجارب والأنشطة",57,.24],["متاحف","الثقافة",49,.07]
  ].map(x=>({term:x[0],category:x[1],index:x[2],growth:x[3]}));

  function opps(){
    const rows=[]; let n=0;
    AREAS.forEach(a=>CATS.forEach(c=>{
      n++;
      const demand=Math.max(35,Math.min(96,Math.round(54+22*(AF[a]-.68)+18*(CF[c]-.72)+(n%7)*2.1)));
      const growth=CG[c]+.015+((n%5)-2)*.012;
      const supply=Math.max(18,Math.min(83,Math.round(79-.55*demand+(n%6)*2)));
      const score=+(0.56*demand+80*Math.max(growth,0)+.35*(100-supply)).toFixed(1);
      const reason=demand>74&&supply<50?"طلب مرتفع مع عرض محدود":growth>.15?"اهتمام متزايد مع قلة الخيارات":demand>65&&supply<58?"بحث متكرر مقابل نتائج محدودة":"إشارة تستحق المتابعة";
      rows.push({area:a,category:c,demand_index:demand,growth:growth,supply_index:supply,score:score,reason:reason});
    }));
    return rows;
  }
  const OPPS=opps();
  const state={page:PAGES[0][0],period:"آخر 30 يومًا",area:"مكة المكرمة",category:"الكل",audience:"الكل",selectedArea:"العزيزية",campaign:"نكهات مكة"};

  const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const fmt=v=>{v=Number(v)||0;return Math.abs(v)>=1e6?(v/1e6).toFixed(1)+"M":Math.abs(v)>=1e3?(v/1e3).toFixed(1)+"K":Math.round(v).toLocaleString("en-US")};
  const sum=(a,k)=>a.reduce((s,r)=>s+(Number(r[k])||0),0);
  const days=()=>({"آخر 7 أيام":7,"آخر 30 يومًا":30,"آخر 3 أشهر":90,"آخر 12 شهرًا":365}[state.period]);

  function factor(){
    const area=state.area==="مكة المكرمة"?1:AF[state.area];
    const cat=state.category==="الكل"?1:CF[state.category];
    const aud=state.audience==="الكل"?1:(state.audience==="الزوار"?1.04:1.07);
    return area*cat*aud;
  }
  function metrics(){
    const d=days(),f=factor(),t=d/30;
    return {
      interactions:Math.round(824000*f*t),active_users:Math.round(281000*f*t),searches:Math.round(119000*f*t),
      views:Math.round(420000*f*t),saves:Math.round(53500*f*t),plans:Math.round(28600*f*t),joins:Math.round(10800*f*t),
      actions:Math.round(9650*f*t),completes:Math.round(5650*f*t),contributes:Math.round(14100*f*t)
    };
  }
  function trend(keys){
    const d=Math.min(days(),90),f=factor(),out={}; keys.forEach(k=>out[k]=[]);
    for(let i=0;i<d;i++){
      const wave=1+.12*Math.sin(i/4)+.05*Math.cos(i/9),up=.86+.23*(i/Math.max(1,d-1));
      keys.forEach((k,j)=>{const base={searches:3600,saves:1620,plans:880,actions:330}[k]||1000;out[k].push(Math.round(base*f*wave*up*(1+j*.02)));});
    }
    return out;
  }
  function delta(seed){return .04+((seed*7)%13)/100}

  function opts(values,current){return values.map(v=>'<option'+(v===current?' selected':'')+'>'+esc(v)+'</option>').join("")}
  function filters(){
    return '<div class="filters">'+
      '<div class="filter"><label>الفترة الزمنية</label><select data-filter="period">'+opts(["آخر 30 يومًا","آخر 7 أيام","آخر 3 أشهر","آخر 12 شهرًا"],state.period)+'</select></div>'+
      '<div class="filter"><label>المنطقة</label><select data-filter="area">'+opts(["مكة المكرمة"].concat(AREAS),state.area)+'</select></div>'+
      '<div class="filter"><label>القطاع / الفئة</label><select data-filter="category">'+opts(["الكل"].concat(CATS),state.category)+'</select></div>'+
      '<div class="filter"><label>نوع الجمهور</label><select data-filter="audience">'+opts(["الكل"].concat(AUD),state.audience)+'</select></div></div>';
  }
  function header(t,s){return '<div class="topbar"><div><div class="eyebrow">EYEMAKKAH BUSINESS INTELLIGENCE</div><h1 class="title">'+esc(t)+'</h1><div class="subtitle">'+esc(s)+'</div></div></div><div class="hero-rule"></div>'}
  function kpi(l,v,d,n,text){d=d==null?.08:d;return '<div class="kpi-card"><div class="kpi-label">'+esc(l)+'</div><div class="kpi-value'+(text?' text':'')+'">'+esc(v)+'</div><div class="delta '+(d>=0?'up':'down')+'">'+(d>=0?'↑ ':'↓ ')+Math.round(Math.abs(d)*100)+'%</div><div class="kpi-note">'+esc(n||"مقارنة بالفترة السابقة")+'</div></div>'}
  function panel(t,c,b){return '<section class="panel"><div class="panel-title">'+esc(t)+'</div>'+(c?'<div class="panel-copy">'+esc(c)+'</div>':'')+b+'</section>'}
  function insight(t,r){return '<div class="insight"><div class="insight-label">رؤية تحليلية · نموذج توضيحي</div><div class="insight-text">'+t+'</div>'+(r&&r.length?'<div class="insight-reasons"><b>لماذا ظهرت هذه الرؤية؟</b> · '+r.map(esc).join(" · ")+'</div>':'')+'</div>'}
  function bar(rows,label,value,color,percent){
    const mx=Math.max.apply(null,rows.map(r=>Number(r[value])||0).concat([1]));
    return '<div class="bar-list">'+rows.map(r=>'<div class="bar-row"><div class="bar-label">'+esc(r[label])+'</div><div class="bar-track"><div class="bar-fill" style="background:'+(color||C.green)+';width:'+Math.max(2,(Number(r[value])||0)/mx*100)+'%"></div></div><div class="bar-value">'+(percent?Math.round(r[value]*100)+"%":fmt(r[value]))+'</div></div>').join("")+'</div>';
  }
  function funnel(names,vals){
    const mx=Math.max.apply(null,vals.concat([1])),cols=[C.green,"#37695D",C.gold,"#C6AA72",C.clay,"#7B6C5B"];
    return '<div class="funnel">'+names.map((n,i)=>'<div class="funnel-step" style="width:'+(35+65*vals[i]/mx)+'%;background:'+cols[i%cols.length]+'"><span>'+esc(n)+'</span><b>'+fmt(vals[i])+'</b></div>').join("")+'</div><div class="funnel-caption">كل مرحلة إشارة مستقلة ولا تعني إتمام المرحلة التالية.</div>';
  }
  function line(series){
    const w=680,h=270,p=26,all=[].concat.apply([],series.map(s=>s.values)),mx=Math.max.apply(null,all.concat([1])),n=series[0].values.length;
    const x=i=>p+(n<=1?0:i/(n-1)*(w-p*2)),y=v=>18+(1-v/mx)*(h-56);
    let g=""; for(let i=0;i<4;i++){let yy=20+i*(h-62)/3;g+='<line x1="'+p+'" y1="'+yy+'" x2="'+(w-p)+'" y2="'+yy+'" stroke="'+C.grid+'" stroke-opacity=".45"/>'}
    const paths=series.map(s=>'<path d="'+s.values.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+","+y(v).toFixed(1)).join(" ")+'" fill="none" stroke="'+s.color+'" stroke-width="2.6" stroke-linecap="round"/>').join("");
    const lg='<div class="legend">'+series.map(s=>'<span><i style="background:'+s.color+'"></i>'+esc(s.name)+'</span>').join("")+'</div>';
    return '<div class="chart">'+lg+'<svg viewBox="0 0 '+w+' '+h+'">'+g+paths+'<text x="'+p+'" y="'+(h-7)+'" font-size="10">بداية الفترة</text><text x="'+(w-p)+'" y="'+(h-7)+'" font-size="10" text-anchor="end">آخر تحديث</text></svg></div>';
  }
  function table(rows,cols){
    return '<div class="table-wrap"><table class="data-table"><thead><tr>'+cols.map(c=>'<th>'+esc(c[1])+'</th>').join("")+'</tr></thead><tbody>'+
      rows.map(r=>'<tr>'+cols.map(c=>'<td>'+(c[2]==="pct"?'<div style="direction:ltr">'+Math.round((Number(r[c[0]])||0)*100)+'%</div>':esc(c[2]==="num"?fmt(r[c[0]]):r[c[0]]))+'</td>').join("")+'</tr>').join("")+
      '</tbody></table></div>';
  }
  function donut(){
    const by={};COMM.forEach(r=>by[r.type]=(by[r.type]||0)+r.engagement);const rows=Object.keys(by).map(k=>({name:k,value:by[k]})),tot=sum(rows,"value"),cols=[C.green,C.gold,C.clay,"#7A8F83","#B7A98F"];let deg=0,st=[];
    rows.forEach((r,i)=>{const d=r.value/tot*360;st.push(cols[i%cols.length]+" "+deg+"deg "+(deg+d)+"deg");deg+=d});
    return '<div class="donut-wrap"><div class="donut" style="background:conic-gradient('+st.join(",")+')"><div class="donut-center">'+fmt(tot)+'</div></div><div class="donut-legend">'+rows.map((r,i)=>'<div><i style="background:'+cols[i%cols.length]+'"></i>'+esc(r.name)+' · '+Math.round(r.value/tot*100)+'%</div>').join("")+'</div></div>';
  }

  function dashboard(){
    const m=metrics(),tr=trend(["searches","saves","plans"]),cats=CATS.map((c,i)=>({name:c,value:Math.round(m.interactions*CF[c]/CATS.reduce((s,x)=>s+CF[x],0))})).sort((a,b)=>b.value-a.value),ag=AREAS.map(a=>({area:a,growth:.04+(AF[a]-.68)*.18})).sort((a,b)=>b.growth-a.growth),top=OPPS.slice().sort((a,b)=>b.score-a.score)[0];
    return header("لوحة المعلومات","لقطة تنفيذية لما يحدث عبر تجربة EyeMakkah، من الاهتمام والاكتشاف إلى التخطيط والانتقال للإجراء.")+filters()+
      '<div class="kpi-grid">'+kpi("إجمالي التفاعلات",fmt(m.interactions),delta(1))+kpi("المستخدمون النشطون",fmt(m.active_users),delta(2))+kpi("عمليات البحث",fmt(m.searches),delta(3))+kpi("الإضافات إلى «خطتي»",fmt(m.plans),delta(4))+kpi("الانتقال إلى الإجراء",fmt(m.actions),delta(5))+'</div>'+
      '<div class="grid-2">'+panel("اتجاهات الطلب عبر الزمن","البحث والحفظ والإضافة إلى خطتي.",line([{name:"بحث",color:C.green,values:tr.searches},{name:"حفظ",color:C.gold,values:tr.saves},{name:"إضافة إلى خطتي",color:C.clay,values:tr.plans}]))+panel("أكثر القطاعات جذبًا للاهتمام","حصة التفاعلات حسب الفئة.",bar(cats,"name","value"))+'</div>'+
      insight("يتسارع الاهتمام في <b>"+esc(ag[0].area)+"</b> بالتزامن مع إشارات طلب مرتفعة في <b>"+esc(top.category)+"</b>. الإشارة مناسبة للاستكشاف واتخاذ القرار، وليست توقعًا تجاريًا مضمونًا.",["نمو متوسط "+Math.round(ag[0].growth*100)+"%","ارتفاع البحث والحفظ","مقارنة مستوى العرض بالطلب"])+
      '<div class="grid-2 equal">'+panel("المناطق الأعلى نموًا في الاهتمام","اتجاه النمو التجريبي.",bar(ag,"area","growth",C.gold,true))+panel("مختصر المجتمعات","الموضوعات التي تجمع نمو النقاش مع نشاط مرتفع.",'<div class="community-list">'+COMM.slice().sort((a,b)=>b.growth-a.growth).slice(0,5).map(r=>'<div class="community-row"><strong>'+esc(r.community)+'</strong><span class="growth">'+Math.round(r.growth*100)+'% ↑</span><p>'+esc(r.themes)+'</p></div>').join("")+'</div>')+'</div>';
  }
  function demand(){
    const m=metrics(),tr=trend(["searches","plans","actions"]),terms=TERMS.filter(r=>state.category==="الكل"||r.category===state.category),fast=terms.slice().sort((a,b)=>b.growth-a.growth).slice(0,7),aud=[{aud:"سكان مكة",searches:m.searches*.58,plans:m.plans*.61,actions:m.actions*.57},{aud:"الزوار",searches:m.searches*.42,plans:m.plans*.39,actions:m.actions*.43}];
    return header("تحليل الطلب","فهم ما يبحث عنه المستخدمون، متى يرتفع الاهتمام، وكيف ينتقل الطلب من البحث إلى الإجراء.")+filters()+
      '<div class="grid-2">'+panel("الطلب عبر الزمن","البحث والخطة والإجراء.",line([{name:"بحث",color:C.green,values:tr.searches},{name:"خطتي",color:C.gold,values:tr.plans},{name:"إجراء",color:C.clay,values:tr.actions}]))+panel("أسرع عمليات البحث نموًا","مؤشر تجريبي مبني على بيانات اصطناعية.",bar(fast,"term","growth",C.gold,true))+'</div>'+
      '<div class="grid-2 equal">'+panel("أكثر مصطلحات البحث","ترتيب نسبي للاهتمام.",table(terms.slice().sort((a,b)=>b.index-a.index),[["term","مصطلح البحث"],["category","الفئة"],["index","مؤشر الطلب"],["growth","النمو","pct"]]))+panel("سكان مكة مقابل الزوار","مقارنة الطلب حسب نوع الجمهور.",bar(aud,"aud","searches",C.green))+'</div>'+
      panel("رحلة الطلب","الحفظ لا يساوي الإضافة إلى خطتي، والإضافة لا تعني حجزًا أو إكمالًا.",funnel(["بحث","عرض التفاصيل","حفظ","إضافة إلى خطتي","انتقال للإجراء"],[m.searches,m.views,m.saves,m.plans,m.actions]))+
      insight("جزء مهم من الطلب يتوقف بعد الحفظ وقبل الإضافة إلى «خطتي»؛ هذه نقطة مناسبة لاختبار تحسينات تجربة التخطيط.",["معدل حفظ مرتفع","هبوط بين الحفظ والخطة","تفاوت حسب الفئة"]);
  }
  function areas(){
    const area=state.selectedArea,oo=OPPS.filter(o=>o.area===area),d=Math.round(sum(oo,"demand_index")/oo.length),g=sum(oo,"growth")/oo.length,top=oo.slice().sort((a,b)=>b.demand_index-a.demand_index)[0],best=oo.slice().sort((a,b)=>b.score-a.score)[0],rows=oo.slice().sort((a,b)=>b.demand_index-a.demand_index);
    return header("تحليل المناطق","قراءة جغرافية مبسطة للاهتمام والطلب والفرص على مستوى أحياء ومناطق مكة.")+filters()+
      '<div class="area-selector"><label>المنطقة قيد التحليل</label><select id="area-detail">'+opts(AREAS,area)+'</select></div>'+
      '<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">'+kpi("مستوى الاهتمام",d+"/100",g)+kpi("نمو الطلب",Math.round(g*100)+"%",g)+kpi("الفئة الأبرز",top.category,CG[top.category],"ضمن النموذج",true)+kpi("وقت الذروة",["العوالي","العزيزية","الشوقية"].includes(area)?"المساء 7–10 م":"العصر 4–7 م",.06,"ضمن النموذج",true)+'</div>'+
      '<div class="grid-2 equal">'+panel("الفئات الأعلى طلبًا","داخل "+area+" للفترة الحالية.",bar(rows.map(r=>({name:r.category,value:r.demand_index})),"name","value"))+panel("ملف المنطقة","مؤشرات الفجوة والطلب.",table(rows,[["category","الفئة"],["demand_index","الطلب"],["growth","النمو","pct"],["supply_index","العرض"],["score","الإشارة"]]))+'</div>'+
      insight("شهدت <b>"+esc(area)+"</b> نموًا في الاهتمام بـ <b>"+esc(best.category)+"</b>، بينما يظل مؤشر العرض التجريبي أقل من مؤشر الطلب. هذه إشارة لدراسة الاحتياج، وليست ضمانًا لفرصة تجارية.",["مؤشر طلب "+best.demand_index+"/100","نمو "+Math.round(best.growth*100)+"%","مؤشر عرض "+best.supply_index+"/100"]);
  }
  function activities(){
    const a=ACTIVITIES.filter(r=>(state.area==="مكة المكرمة"||r.area===state.area)&&(state.category==="الكل"||r.category===state.category));
    if(!a.length)return header("الأنشطة والتجارب","تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض والحفظ والتخطيط والانضمام والإجراء والإكمال.")+filters()+'<div class="notice">لا توجد أنشطة تجريبية مطابقة لهذه الفلاتر.</div>';
    const max=k=>a.slice().sort((x,y)=>y[k]-x[k])[0];
    return header("الأنشطة والتجارب","تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض والحفظ والتخطيط والانضمام والإجراء والإكمال.")+filters()+
      '<div class="kpi-grid">'+kpi("الأكثر مشاهدة",max("views").activity,.12,"ضمن بيانات النموذج",true)+kpi("الأكثر حفظًا",max("saves").activity,.16,"ضمن بيانات النموذج",true)+kpi("الأكثر إضافة إلى خطتي",max("plans").activity,max("plans").growth,"ضمن بيانات النموذج",true)+kpi("الأعلى في نية الحضور",max("joins").activity,.09,"ضمن بيانات النموذج",true)+kpi("الأعلى انتقالًا للإجراء",max("actions").activity,.11,"ضمن بيانات النموذج",true)+'</div>'+
      '<div class="grid-2 equal">'+panel("قمع التفاعل","المراحل منفصلة ولا يتم دمجها في «تحويل» واحد.",funnel(["عرض","حفظ","إضافة إلى خطتي","انضمام / نية حضور","انتقال للإجراء","إكمال"],["views","saves","plans","joins","actions","complete"].map(k=>sum(a,k))))+panel("أعلى الأنشطة نموًا","مؤشر نمو تجريبي.",bar(a.slice().sort((x,y)=>y.growth-x.growth).slice(0,7),"activity","growth",C.gold,true))+'</div>'+
      panel("أداء الأنشطة","ترتيب تفاعلي للأنشطة مع مؤشرات كل مرحلة.",table(a.slice().sort((x,y)=>y.plans-x.plans),[["activity","النشاط"],["category","الفئة"],["area","المنطقة"],["views","عرض","num"],["saves","حفظ","num"],["plans","خطتي","num"],["joins","انضمام","num"],["actions","إجراء","num"],["complete","إكمال","num"],["growth","النمو","pct"]]));
  }
  function communities(){
    const topics=[["أنشطة الأطفال","+34%","أسئلة وتوصيات نهاية الأسبوع"],["تجارب المساء","+29%","اقتراحات لأنشطة اجتماعية"],["الورش الإبداعية","+27%","بحث عن تجارب قصيرة"],["أماكن قريبة","+18%","طلب خيارات حسب الحي"]];
    return header("المجتمعات والاهتمامات","ذكاء مجتمعي يركز على أنماط الموضوعات والمشاركة، دون ملفات نفسية أو تعرّف على الأفراد.")+filters()+
      '<div class="grid-2">'+panel("المجتمعات الأكثر نشاطًا","حجم التفاعل ونمو النقاش.",bar(COMM.slice().sort((a,b)=>b.engagement-a.engagement),"community","engagement"))+panel("أنماط المساهمة","نوع المساهمة الأكثر ظهورًا في كل مجتمع.",donut())+'</div>'+
      panel("موضوعات تكتسب زخمًا","ملخص نوعي للنقاشات التجريبية.",'<div class="grid-4" style="margin-top:0">'+topics.map(x=>'<div class="kpi-card"><div class="kpi-label">'+esc(x[2])+'</div><div class="kpi-value text">'+esc(x[0])+'</div><div class="delta up">↑ '+esc(x[1])+'</div></div>').join("")+'</div>')+
      insight("أعلى نمو للنقاش التجريبي يظهر حول الأنشطة المناسبة للعائلة والخيارات المسائية، مع تكرار أسئلة «ما القريب مني؟» و«ماذا يمكن أن نفعل هذا الأسبوع؟».",["نمو الأسئلة","زيادة التوصيات","ارتفاع الحفظ المرتبط بالموضوع"]);
  }
  function campaigns(){
    let rows=CAMPS.filter(r=>(state.category==="الكل"||r.category===state.category)&&(state.audience==="الكل"||r.audience===state.audience||r.audience==="الكل"));
    if(!rows.length)return header("الحملات والعروض","قراءة أداء حملات تجريبية للشركاء والعلامات التجارية.")+filters()+'<div class="notice">لا توجد حملات تجريبية مطابقة للفلاتر المحددة.</div>';
    if(!rows.some(r=>r.campaign===state.campaign))state.campaign=rows[0].campaign;const r=rows.find(x=>x.campaign===state.campaign);
    const geo=AREAS.map((a,i)=>({area:a,value:[1.18,1.02,.94,.82,.78,.69,.63][i]*r.handoffs/6}));
    return header("الحملات والعروض","قراءة أداء حملات تجريبية للشركاء والعلامات التجارية من الظهور حتى الانتقال إلى العرض أو الإجراء.")+filters()+
      '<div class="campaign-selector"><label>اختر حملة</label><select id="campaign-select">'+opts(rows.map(x=>x.campaign),state.campaign)+'</select></div>'+
      '<div class="kpi-grid">'+kpi("الظهور",fmt(r.impressions),r.growth)+kpi("المشاهدة",fmt(r.views),.12)+kpi("فتح التفاصيل",fmt(r.details),.09)+kpi("الحفظ",fmt(r.saves),.16)+kpi("الانتقال للعرض",fmt(r.handoffs),.13)+'</div>'+
      '<div class="grid-2">'+panel("قمع الحملة","أداء «"+r.campaign+"» عبر مراحل التفاعل.",funnel(["ظهور","مشاهدة","فتح التفاصيل","حفظ","إضافة إلى الخطة","انتقال إلى العرض"],[r.impressions,r.views,r.details,r.saves,Math.floor(r.saves*.44),r.handoffs]))+panel("الأداء الجغرافي","توزيع تجريبي للاستجابة حسب المنطقة.",bar(geo,"area","value"))+'</div>';
  }
  function opportunities(){
    const o=OPPS.filter(r=>(state.area==="مكة المكرمة"||r.area===state.area)&&(state.category==="الكل"||r.category===state.category)).sort((a,b)=>b.score-a.score),top=o[0];
    return header("الفرص والفجوات","إشارات دعم قرار تجمع الطلب والنمو ومستوى العرض. لا تمثل هذه الإشارات ضمانًا لجدوى مشروع أو استثمار.")+filters()+
      insight("أقوى إشارة في الفلاتر الحالية تظهر في <b>"+esc(top.area)+"</b> ضمن <b>"+esc(top.category)+"</b>: "+esc(top.reason)+". يوصى باستخدامها كنقطة بداية للتحقق الميداني ودراسة السوق.",["مؤشر طلب "+top.demand_index,"نمو "+Math.round(top.growth*100)+"%","مؤشر عرض "+top.supply_index])+
      '<div class="grid-2">'+panel("الطلب مقابل العرض","أعلى الطلب وأقل العرض يستحق تحققًا أعمق.",bar(o.slice(0,10).map(r=>({name:r.area+" · "+r.category,value:r.score})),"name","value",C.green))+panel("الإشارات الأعلى","ترتيب وفق مؤشر تجريبي مركب.",'<div>'+o.slice(0,6).map(r=>'<div class="signal"><b>'+esc(r.area)+' · '+esc(r.category)+'</b><span class="signal-score">'+r.score.toFixed(0)+'</span><small>'+esc(r.reason)+' · نمو '+Math.round(r.growth*100)+'%</small></div>').join("")+'</div>')+'</div>'+
      panel("جدول الفرص","تفاصيل الإشارات الداعمة للقرار.",table(o,[["area","المنطقة"],["category","الفئة"],["demand_index","مؤشر الطلب"],["growth","اتجاه النمو","pct"],["supply_index","مستوى العرض"],["reason","سبب ظهور الفرصة"],["score","مؤشر الإشارة"]]));
  }
  function reportRows(){
    const m=metrics(),rows=[];AREAS.forEach((a,ai)=>CATS.forEach((c,ci)=>AUD.forEach((u,ui)=>{const f=AF[a]*CF[c]*(ui?1.02:1.06)/12;rows.push({area:a,category:c,audience:u,interactions:Math.round(m.interactions*f),active_users:Math.round(m.active_users*f),searches:Math.round(m.searches*f),views:Math.round(m.views*f),saves:Math.round(m.saves*f),plans:Math.round(m.plans*f),joins:Math.round(m.joins*f),actions:Math.round(m.actions*f),completes:Math.round(m.completes*f),contributes:Math.round(m.contributes*f)});})));return rows;
  }
  function reports(){
    const rr=[["التقرير الشهري للطلب والاهتمام","ملخص البحث والحفظ والتخطيط واتجاهات الطلب."],["تحليل مناطق مكة","مقارنة المناطق والفئات ومؤشرات النمو."],["تقرير المجتمعات والاهتمامات","أنماط النقاش والمساهمة والموضوعات الصاعدة."],["أداء الحملات والعروض","قمع الحملات والأداء حسب الجمهور والمنطقة."],["تقرير الفرص والفجوات","إشارات الطلب مقابل العرض لدعم التحقق والدراسة."]],rows=reportRows();
    return header("التقارير","مركز مبسط لعرض التقارير الدورية وتصدير ملخصات البيانات التجريبية.")+filters()+
      rr.map(x=>'<details class="report"><summary>'+esc(x[0])+'</summary><div class="report-body">'+esc(x[1])+'<br><small>الفترة: '+esc(state.period)+' · المنطقة: '+esc(state.area)+' · الفئة: '+esc(state.category)+' · الجمهور: '+esc(state.audience)+'</small><br>يعرض النموذج بنية التقرير وتجربة التفاعل. البيانات توضيحية وليست بيانات تشغيلية حية.</div></details>').join("")+
      panel("تصدير ملخص CSV","يحتوي الملف على مؤشرات مجمعة وفق الفلاتر الحالية.",'<button class="download-btn" id="download-csv">تصدير CSV</button><div style="height:10px"></div>'+table(rows.slice(0,30),[["area","المنطقة"],["category","الفئة"],["audience","الجمهور"],["interactions","التفاعلات","num"],["active_users","المستخدمون النشطون","num"],["searches","البحث","num"],["views","العرض","num"],["saves","الحفظ","num"],["plans","الإضافة إلى خطتي","num"],["actions","الانتقال للإجراء","num"]]))+
      '<script id="report-data" type="application/json">'+JSON.stringify(rows).replace(/</g,"\\u003c")+'</script>';
  }

  function page(){switch(state.page){case"لوحة المعلومات":return dashboard();case"تحليل الطلب":return demand();case"تحليل المناطق":return areas();case"الأنشطة والتجارب":return activities();case"المجتمعات والاهتمامات":return communities();case"الحملات والعروض":return campaigns();case"الفرص والفجوات":return opportunities();case"التقارير":return reports();default:return dashboard();}}
  function shell(){
    return '<div class="bi-shell"><aside class="sidebar"><div class="brand"><div class="brand-main">EyeMakkah</div><div class="brand-sub">منصة ذكاء الأعمال</div><span class="brand-badge">BI PROTOTYPE</span></div><nav class="nav">'+
      PAGES.map(x=>'<button data-page="'+esc(x[0])+'" class="'+(state.page===x[0]?"active":"")+'"><span class="nav-icon">'+x[1]+'</span><span>'+esc(x[0])+'</span></button>').join("")+
      '</nav><div class="sidebar-meta">آخر تحديث للنموذج: 21 سبتمبر 2026<br>بيانات اصطناعية لأغراض العرض<br>لا تتضمن معلومات شخصية.</div><a class="back-link" href="/">العودة إلى EyeMakkah ↗</a></aside><main class="main"><div class="mobile-nav"><select id="mobile-page">'+opts(PAGES.map(x=>x[0]),state.page)+'</select></div><div id="page">'+page()+'</div><div class="data-note">البيانات المعروضة في هذا النموذج توضيحية لأغراض تصميم وتجربة المنصة، ولا تمثل بيانات تشغيلية حية أو معلومات عن أفراد.</div><div class="footer-links"><a href="/">EyeMakkah</a> · Business Intelligence Prototype</div></main></div>';
  }
  function downloadCsv(){
    const e=document.getElementById("report-data");if(!e)return;const rows=JSON.parse(e.textContent),cols=["area","category","audience","interactions","active_users","searches","views","saves","plans","joins","actions","completes","contributes"],heads=["المنطقة","الفئة","الجمهور","التفاعلات","المستخدمون النشطون","البحث","العرض","الحفظ","الإضافة إلى خطتي","الانضمام","الانتقال للإجراء","الإكمال","المساهمات"],q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"',csv="\uFEFF"+[heads].concat(rows.map(r=>cols.map(c=>r[c]))).map(r=>r.map(q).join(",")).join("\n"),blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="EyeMakkah_BI_demo_summary.csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500);
  }
  function attach(){
    document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render();scrollTo({top:0,behavior:"smooth"})});
    const mp=document.getElementById("mobile-page");if(mp)mp.onchange=e=>{state.page=e.target.value;render()};
    document.querySelectorAll("[data-filter]").forEach(s=>s.onchange=e=>{state[e.target.dataset.filter]=e.target.value;render()});
    const ad=document.getElementById("area-detail");if(ad)ad.onchange=e=>{state.selectedArea=e.target.value;render()};
    const cp=document.getElementById("campaign-select");if(cp)cp.onchange=e=>{state.campaign=e.target.value;render()};
    const dl=document.getElementById("download-csv");if(dl)dl.onclick=downloadCsv;
  }
  function render(){document.getElementById("app").innerHTML=shell();attach()}
  render();
})();