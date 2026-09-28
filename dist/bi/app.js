(() => {
  "use strict";

  const C={green:"#17463A",deep:"#0E3129",gold:"#B8944A",clay:"#A65F45",sand:"#E8DDC9",sandDeep:"#DED2BE",muted:"#756E64",paper:"#FFFCF6",brassSoft:"#D8BE86",ok:"#3D725E",warn:"#A6522D",line:"rgba(33,30,25,.12)",lineSoft:"rgba(33,30,25,.07)"};
  const AREAS=["العزيزية","الشوقية","العوالي","النسيم","الزاهر","الشرائع","بطحاء قريش"];
  const CATS=["المطاعم والمقاهي","التجارب والأنشطة","التسوق","الترفيه","الثقافة","الخدمات","المجتمعات","الضيافة"];
  const AUD=["سكان مكة","الزوار"];
  const PAGES=[["لوحة المعلومات","dashboard"],["تحليل الطلب","demand"],["تحليل المناطق","map"],["الأنشطة والتجارب","activities"],["المجتمعات والاهتمامات","community"],["الحملات والعروض","campaigns"],["الفرص والفجوات","opportunities"],["التقارير","reports"]];
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
  const savedLang=localStorage.getItem("eyemakkah-ba-lang");
  const state={page:PAGES[0][0],period:"آخر 30 يومًا",area:"مكة المكرمة",category:"الكل",audience:"الكل",selectedArea:"العزيزية",campaign:"نكهات مكة",lang:savedLang==="en"?"en":"ar"};
  const session={logged:sessionStorage.getItem("eyemakkah-ba-session")==="1",name:"مستخدم تجريبي",email:"demo@eyemakkah.sa"};
  let flow=session.logged?"app":(savedLang?"login":"welcome");
  const tr=(ar,en)=>state.lang==="ar"?ar:en;

  const ICON_PATHS={
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    demand:'<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/>',
    map:'<path d="M9 18 3.5 21V6L9 3l6 3 5.5-3v15L15 21l-6-3Z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    activities:'<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="m8 15 2 2 4-4"/>',
    community:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    campaigns:'<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.1 13 21H8l-1.2-6"/><path d="M21 9v6"/>',
    opportunities:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/>',
    reports:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/>',
    languages:'<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    chevronDown:'<path d="m6 9 6 6 6-6"/>',
    settings:'<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9v-.1A1.7 1.7 0 0 0 8.6 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.23 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H1V9h.1A1.7 1.7 0 0 0 2 8.6a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 7 3.23a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V1h4.6v.1a1.7 1.7 0 0 0 .4 1.1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 18.77 7a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4H21V13h-.1a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.4 1Z"/>',
    logOut:'<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
    logOutRtl:'<path d="M14 17l-5-5 5-5"/><path d="M9 12h12"/><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/>',
    sparkles:'<path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14Z"/><path d="m19 13-.8 2.2L16 16l2.2.8L19 19l.8-2.2L22 16l-2.2-.8L19 13Z"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    compass:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2.4 5.6L8 16l2.4-5.6L16 8Z"/>',
    alertTriangle:'<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    refreshCw:'<path d="M21 12a9 9 0 0 0-15.2-6.5L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15.2 6.5L21 16"/><path d="M16 16h5v5"/>'
  };
  function iconSvg(name,size){
    const key=name==="logOut"&&state.lang==="ar"?"logOutRtl":name,p=ICON_PATHS[key]||ICON_PATHS.dashboard,s=size||18,directional=name==="logOut"?" directional-icon":"";
    return '<svg class="ui-icon'+directional+'" aria-hidden="true" viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'
  }
  function wordmark(size,light){
    return '<div class="wordmark '+(light?"wordmark-light":"wordmark-dark")+'" style="--wm-size:'+(size||32)+'px" dir="ltr"><div class="wordmark-text"><span>Eye</span><strong>Makkah</strong></div><i></i></div>'
  }

  const CHART_COLORS=[C.green,"#8C6B4F","#5C6E4A","#9E6B52","#4A6B7C","#7A5B8C",C.gold,C.clay];
  function tipText(value){const raw=String(value==null?"":value);return esc(state.lang==="en"?enText(raw):raw)}

  const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const fmt=v=>{v=Number(v)||0;return Math.abs(v)>=1e6?(v/1e6).toFixed(1)+"M":Math.abs(v)>=1e3?(v/1e3).toFixed(1)+"K":Math.round(v).toLocaleString("en-US")};
  const sum=(a,k)=>a.reduce((s,r)=>s+(Number(r[k])||0),0);
  const days=()=>({"آخر 7 أيام":7,"آخر 30 يومًا":30,"آخر 3 أشهر":90,"آخر 12 شهرًا":365}[state.period]);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function periodIntensity(){return ({7:1.10,30:1,90:.95,365:.90}[days()]||1)}
  function hash01(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
  function rowNoise(key){return .92+hash01(key+"|"+state.period+"|"+state.area+"|"+state.category+"|"+state.audience)*.16}
  function contextScale(){return factor()*(days()/30)*periodIntensity()}
  function scaledCount(v,key,scale){return Math.max(0,Math.round((Number(v)||0)*(scale==null?contextScale():scale)*rowNoise(key)))}
  function scaledRate(v,key){
    const adj=.9+(factor()-1)*.32+(periodIntensity()-1)*.8;
    return clamp((Number(v)||0)*adj*(.96+hash01(key+"|"+state.area+"|"+state.category+"|"+state.audience)*.08),.01,.95)
  }
  function activityRows(){
    return ACTIVITIES
      .filter(r=>(state.area==="مكة المكرمة"||r.area===state.area)&&(state.category==="الكل"||r.category===state.category))
      .map(r=>Object.assign({},r,{
        views:scaledCount(r.views,r.activity+"v"),saves:scaledCount(r.saves,r.activity+"s"),
        plans:scaledCount(r.plans,r.activity+"p"),joins:scaledCount(r.joins,r.activity+"j"),
        actions:scaledCount(r.actions,r.activity+"a"),complete:scaledCount(r.complete,r.activity+"c"),
        growth:scaledRate(r.growth,r.activity+"g")
      }))
  }
  function communityRows(){
    const scale=factor()*periodIntensity()*(.9+Math.min(days(),90)/900);
    return COMM.map(r=>Object.assign({},r,{
      members:scaledCount(r.members,r.community+"m",scale),
      engagement:scaledCount(r.engagement,r.community+"e"),
      growth:scaledRate(r.growth,r.community+"g")
    }))
  }
  function campaignRows(){
    return CAMPS
      .filter(r=>(state.category==="الكل"||r.category===state.category)&&(state.audience==="الكل"||r.audience===state.audience||r.audience==="الكل"))
      .map(r=>Object.assign({},r,{
        impressions:scaledCount(r.impressions,r.campaign+"i"),views:scaledCount(r.views,r.campaign+"v"),
        details:scaledCount(r.details,r.campaign+"d"),saves:scaledCount(r.saves,r.campaign+"s"),
        handoffs:scaledCount(r.handoffs,r.campaign+"h"),growth:scaledRate(r.growth,r.campaign+"g")
      }))
  }
  function termRows(){
    return TERMS
      .filter(r=>state.category==="الكل"||r.category===state.category)
      .map(r=>Object.assign({},r,{
        index:clamp(Math.round(r.index*(.88+factor()*.12)*periodIntensity()*rowNoise(r.term+"i")),18,100),
        growth:scaledRate(r.growth,r.term+"g")
      }))
  }
  function scaledOppRows(source){
    return source.map(r=>{
      const demand=clamp(Math.round(r.demand_index*(.88+factor()*.12)*periodIntensity()*rowNoise(r.area+r.category+"d")),20,100);
      const growth=scaledRate(r.growth,r.area+r.category+"g");
      const supply=clamp(Math.round(r.supply_index*(1.08-(factor()-1)*.08)*(1.02-(periodIntensity()-1)*.3)/rowNoise(r.area+r.category+"s")),10,95);
      const score=+(0.56*demand+80*Math.max(growth,0)+.35*(100-supply)).toFixed(1);
      return Object.assign({},r,{demand_index:demand,growth,supply_index:supply,score})
    })
  }

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
    const d=Math.min(days(),90),f=factor()*periodIntensity(),out={}; keys.forEach(k=>out[k]=[]);
    for(let i=0;i<d;i++){
      const wave=1+.12*Math.sin(i/4)+.05*Math.cos(i/9),up=.86+.23*(i/Math.max(1,d-1));
      keys.forEach((k,j)=>{const base={searches:3600,saves:1620,plans:880,actions:330}[k]||1000;out[k].push(Math.round(base*f*wave*up*(1+j*.02)));});
    }
    return out;
  }
  function delta(seed){return .03+((seed*7+days()+Math.round(factor()*100))%16)/100}

  function opts(values,current){return values.map(v=>'<option'+(v===current?' selected':'')+'>'+esc(v)+'</option>').join("")}
  function filters(){
    return '<div class="filters" aria-label="'+esc(tr("فلاتر التحليل","Analytics filters"))+'">'+
      '<div class="filter"><label>الفترة الزمنية</label><select data-filter="period">'+opts(["آخر 30 يومًا","آخر 7 أيام","آخر 3 أشهر","آخر 12 شهرًا"],state.period)+'</select></div>'+
      '<div class="filter"><label>المنطقة</label><select data-filter="area">'+opts(["مكة المكرمة"].concat(AREAS),state.area)+'</select></div>'+
      '<div class="filter"><label>القطاع / الفئة</label><select data-filter="category">'+opts(["الكل"].concat(CATS),state.category)+'</select></div>'+
      '<div class="filter"><label>نوع الجمهور</label><select data-filter="audience">'+opts(["الكل"].concat(AUD),state.audience)+'</select></div></div>';
  }
  function userMenu(){
    const langAr=state.lang==="ar",langEn=state.lang==="en";
    return '<details class="user-menu"><summary class="user-trigger" aria-label="'+esc(tr("حساب المستخدم","User account"))+'"><span class="avatar">A</span><span class="user-trigger-chevron">'+iconSvg("chevronDown",14)+'</span></summary><div class="user-pop"><div class="user-pop-name"><strong>'+esc(session.name)+'</strong><small>'+esc(session.email)+'</small></div><button type="button" class="menu-row '+(langAr?"selected":"")+'" data-menu-lang="ar"><span class="menu-icon">'+iconSvg("languages",17)+'</span><span>العربية</span></button><button type="button" class="menu-row '+(langEn?"selected":"")+'" data-menu-lang="en"><span class="menu-icon">'+iconSvg("languages",17)+'</span><span>English</span></button><div class="menu-separator"></div><button type="button" class="menu-row" data-settings><span class="menu-icon">'+iconSvg("settings",17)+'</span><span>'+esc(tr("الإعدادات","Settings"))+'</span></button><button type="button" class="menu-row danger" data-logout><span class="menu-icon">'+iconSvg("logOut",17)+'</span><span>'+esc(tr("تسجيل الخروج","Sign out"))+'</span></button></div></details>'
  }
  function header(t,s){return '<header class="topbar"><div class="page-heading"><h1 class="title">'+esc(t)+'</h1><div class="subtitle">'+esc(s)+'</div></div><div class="top-actions"><div class="header-meta"><span>'+esc(tr("آخر تحديث للبيانات","Data updated"))+'</span><b>'+esc(tr("22 سبتمبر 2026","22 September 2026"))+'</b></div>'+userMenu()+'</div></header>'}
  function kpi(l,v,d,n,text){d=d==null?.08:d;return '<div class="kpi-card"><div class="kpi-label">'+esc(l)+'</div><div class="kpi-value'+(text?' text':'')+'">'+esc(v)+'</div><div class="kpi-meta"><div class="delta '+(d>=0?'up':'down')+'">'+(d>=0?'↑ ':'↓ ')+Math.round(Math.abs(d)*100)+'%</div><div class="kpi-note">'+esc(n||"مقارنة بالفترة السابقة")+'</div></div></div>'}
  function panel(t,c,b){return '<section class="panel"><header class="panel-head"><div class="panel-title">'+esc(t)+'</div>'+(c?'<div class="panel-copy">'+esc(c)+'</div>':'')+'</header><div class="panel-body">'+b+'</div></section>'}
  function insight(t,r){return '<aside class="insight"><div class="insight-label">رؤية تحليلية · نموذج توضيحي</div><div class="insight-text">'+t+'</div>'+(r&&r.length?'<div class="insight-reasons"><b>لماذا ظهرت هذه الرؤية؟</b> · '+r.map(esc).join(" · ")+'</div>':'')+'</aside>'}
  function bar(rows,label,value,color,percent){
    const mx=Math.max.apply(null,rows.map(r=>Number(r[value])||0).concat([1]));
    return '<div class="bar-list">'+rows.map(r=>{const shown=percent?Math.round(r[value]*100)+"%":fmt(r[value]),tip=r[label]+" · "+shown;return '<div class="bar-row" data-tip="'+tipText(tip)+'"><div class="bar-label">'+esc(r[label])+'</div><div class="bar-track"><div class="bar-fill" style="background:'+(color||C.green)+';width:'+Math.max(2,(Number(r[value])||0)/mx*100)+'%"></div></div><div class="bar-value">'+shown+'</div></div>'}).join("")+'</div>';
  }
  function funnel(names,vals){
    const mx=Math.max.apply(null,vals.concat([1])),cols=[C.green,"#5E7E6B",C.gold,"#A8763F",C.clay,"#7C5A3A"];
    return '<div class="funnel">'+names.map((n,i)=>'<div class="funnel-step" data-tip="'+tipText(n+" · "+fmt(vals[i]))+'" style="width:'+(35+65*vals[i]/mx)+'%;background:'+cols[i%cols.length]+'"><span>'+esc(n)+'</span><b>'+fmt(vals[i])+'</b></div>').join("")+'</div><div class="funnel-caption">كل مرحلة إشارة مستقلة ولا تعني إتمام المرحلة التالية.</div>';
  }
  function line(series){
    const w=680,h=270,p=26,all=[].concat.apply([],series.map(s=>s.values)),mx=Math.max.apply(null,all.concat([1])),n=series[0].values.length;
    const x=i=>p+(n<=1?0:i/(n-1)*(w-p*2)),y=v=>18+(1-v/mx)*(h-56);
    let g=""; for(let i=0;i<4;i++){let yy=20+i*(h-62)/3;g+='<line x1="'+p+'" y1="'+yy+'" x2="'+(w-p)+'" y2="'+yy+'" stroke="'+C.lineSoft+'"/>'}
    const paths=series.map(s=>'<path class="trend-path" d="'+s.values.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+","+y(v).toFixed(1)).join(" ")+'" fill="none" stroke="'+s.color+'" stroke-width="2.3" stroke-linecap="round"/>').join("");
    const dots=series.map(s=>s.values.map((v,i)=>i%Math.max(1,Math.floor(n/10))===0?'<circle class="trend-dot" data-tip="'+tipText(s.name+" · "+fmt(v))+'" cx="'+x(i).toFixed(1)+'" cy="'+y(v).toFixed(1)+'" r="3.2" fill="'+s.color+'"></circle>':'').join("")).join("");
    const lg='<div class="legend">'+series.map(s=>'<span><i style="background:'+s.color+'"></i>'+esc(s.name)+'</span>').join("")+'</div>';
    return '<div class="chart">'+lg+'<svg viewBox="0 0 '+w+' '+h+'">'+g+paths+dots+'<text x="'+p+'" y="'+(h-7)+'" font-size="11">بداية الفترة</text><text x="'+(w-p)+'" y="'+(h-7)+'" font-size="11" text-anchor="end">آخر تحديث</text></svg></div>';
  }
  function table(rows,cols){
    return '<div class="table-wrap"><table class="data-table"><thead><tr>'+cols.map(c=>'<th>'+esc(c[1])+'</th>').join("")+'</tr></thead><tbody>'+
      rows.map(r=>'<tr>'+cols.map(c=>'<td'+(c[2]==="pct"||c[2]==="num"?' class="num-cell" dir="ltr"':'')+'>'+(c[2]==="pct"?Math.round((Number(r[c[0]])||0)*100)+'%':esc(c[2]==="num"?fmt(r[c[0]]):r[c[0]]))+'</td>').join("")+'</tr>').join("")+
      '</tbody></table></div>';
  }
  function donut(source){
    source=source||communityRows();
    const by={};source.forEach(r=>by[r.type]=(by[r.type]||0)+r.engagement);
    const items=Object.keys(by).map(k=>({name:k,value:by[k]})),tot=sum(items,"value"),cols=CHART_COLORS;let deg=0,st=[];
    items.forEach((r,i)=>{const d=r.value/tot*360;st.push(cols[i%cols.length]+" "+deg+"deg "+(deg+d)+"deg");deg+=d});
    return '<div class="donut-wrap"><div class="donut" data-tip="'+tipText("إجمالي · "+fmt(tot))+'" style="background:conic-gradient('+st.join(",")+')"><div class="donut-center">'+fmt(tot)+'</div></div><div class="donut-legend">'+items.map((r,i)=>'<div data-tip="'+tipText(r.name+" · "+fmt(r.value))+'"><i style="background:'+cols[i%cols.length]+'"></i>'+esc(r.name)+' · '+Math.round(r.value/tot*100)+'%</div>').join("")+'</div></div>';
  }


  function donutData(rows,label,value){
    const vals=rows.map(r=>Number(r[value])||0),tot=vals.reduce((a,b)=>a+b,0)||1,cols=CHART_COLORS;let deg=0,st=[];
    rows.forEach((r,i)=>{const d=(Number(r[value])||0)/tot*360;st.push(cols[i%cols.length]+" "+deg+"deg "+(deg+d)+"deg");deg+=d});
    return '<div class="donut-wrap data-donut"><div class="donut" data-tip="'+tipText("إجمالي · "+fmt(tot))+'" style="background:conic-gradient('+st.join(",")+')"><div class="donut-center">'+fmt(tot)+'</div></div><div class="donut-legend">'+rows.map((r,i)=>'<div data-tip="'+tipText(r[label]+" · "+fmt(r[value]))+'"><i style="background:'+cols[i%cols.length]+'"></i>'+esc(r[label])+' · '+Math.round((Number(r[value])||0)/tot*100)+'%</div>').join("")+'</div></div>'
  }
  function stackedAudience(rows){
    const total=sum(rows,"searches")||1,cols=[C.green,C.gold];
    return '<div class="stacked-audience"><div class="stack-track">'+rows.map((r,i)=>'<div class="stack-seg" data-tip="'+tipText(r.aud+" · "+fmt(r.searches))+'" style="width:'+(r.searches/total*100)+'%;background:'+cols[i%cols.length]+'">'+Math.round(r.searches/total*100)+'%</div>').join("")+'</div><div class="stack-legend">'+rows.map((r,i)=>'<span><i style="background:'+cols[i%cols.length]+'"></i>'+esc(r.aud)+' · '+fmt(r.searches)+'</span>').join("")+'</div></div>'
  }
  function groupedDemandSupply(rows){
    const shown=rows.slice(0,8);
    return '<div class="grouped-bars">'+shown.map(r=>'<div class="grouped-item" data-tip="'+tipText(r.category+" · الطلب "+r.demand_index+" · العرض "+r.supply_index)+'"><div class="grouped-pair"><i class="demand-bar" style="height:'+r.demand_index+'%"></i><i class="supply-bar" style="height:'+r.supply_index+'%"></i></div><span>'+esc(r.category)+'</span></div>').join("")+'<div class="group-key"><span><i class="demand-key"></i>'+esc("الطلب")+'</span><span><i class="supply-key"></i>'+esc("العرض")+'</span></div></div>'
  }
  function bubbleActivities(rows){
    const shown=rows.slice().sort((a,b)=>b.views-a.views).slice(0,8),maxV=Math.max(...shown.map(r=>r.views),1),maxS=Math.max(...shown.map(r=>r.saves),1);
    return '<div class="bubble-chart"><svg viewBox="0 0 680 280">'+shown.map((r,i)=>{const x=55+(r.views/maxV)*560,y=235-(r.saves/maxS)*190,rad=8+Math.min(18,r.growth*45),c=CHART_COLORS[i%CHART_COLORS.length];return '<circle class="bubble-dot" data-tip="'+tipText(r.activity+" · عرض "+fmt(r.views)+" · الحفظ "+fmt(r.saves))+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rad.toFixed(1)+'" fill="'+c+'" fill-opacity=".72"></circle>'}).join("")+'<text x="55" y="270">'+esc("المشاهدات")+' →</text><text x="8" y="24">'+esc("الحفظ")+'</text></svg></div>'
  }
  function scatterOpp(rows){
    const shown=rows.slice(0,18),w=680,h=300,p=42;
    const x=v=>p+(v/100)*(w-p*2),y=v=>18+(1-v/100)*(h-62);
    return '<div class="scatter-chart"><svg viewBox="0 0 '+w+' '+h+'"><rect x="'+p+'" y="18" width="'+(x(50)-p)+'" height="'+(y(65)-18)+'" fill="rgba(184,148,74,.045)"/><line x1="'+x(50)+'" y1="18" x2="'+x(50)+'" y2="'+(h-44)+'" stroke="'+C.lineSoft+'" stroke-dasharray="4 5"/><line x1="'+p+'" y1="'+y(65)+'" x2="'+(w-p)+'" y2="'+y(65)+'" stroke="'+C.lineSoft+'" stroke-dasharray="4 5"/><text x="'+(p+8)+'" y="36">'+esc("طلب مرتفع · عرض أقل")+'</text>'+shown.map(r=>'<circle class="scatter-dot" data-tip="'+tipText(r.area+" · "+r.category+" · الطلب "+r.demand_index+" · العرض "+r.supply_index+" · الإشارة "+r.score)+'" cx="'+x(r.supply_index).toFixed(1)+'" cy="'+y(r.demand_index).toFixed(1)+'" r="'+(5+Math.min(12,r.score/12)).toFixed(1)+'" fill="'+(r.demand_index>65&&r.supply_index<50?C.gold:C.green)+'" fill-opacity=".72"></circle>').join("")+'<text x="'+p+'" y="'+(h-9)+'">'+esc("مستوى العرض")+' →</text><text x="7" y="18">'+esc("مؤشر الطلب")+'</text></svg></div>'
  }


  const AI_QUESTIONS=[
    ["top-category","ما أكثر الفئات طلبًا؟","What categories have the highest demand?"],
    ["top-area","أي منطقة تشهد أعلى نمو في الاهتمام؟","Which area has the fastest interest growth?"],
    ["largest-gap","أين تظهر أكبر فجوة بين الطلب والعرض؟","Where is the largest gap between demand and supply?"],
    ["top-activity","ما أكثر الأنشطة إضافة إلى «خطتي»؟","Which activity is added to My Plan most often?"],
    ["audience","كيف يختلف السكان عن الزوار؟","How do residents and visitors differ?"],
    ["watch-signal","ما أبرز إشارة تحتاج متابعة؟","What signal needs the most attention?"]
  ];
  let aiQuestion="top-category";
  let uiIssue=null;
  function aiAnswer(id){
    const m=metrics(),op=scaledOppRows(OPPS.filter(r=>(state.area==="مكة المكرمة"||r.area===state.area)&&(state.category==="الكل"||r.category===state.category))).sort((a,b)=>b.score-a.score),acts=activityRows(),areas=(state.area==="مكة المكرمة"?AREAS:[state.area]).map(a=>({area:a,growth:scaledRate(.04+(AF[a]-.68)*.18,a+"ai")})).sort((a,b)=>b.growth-a.growth),cats=(state.category==="الكل"?CATS:[state.category]).map(c=>({category:c,value:Math.round(m.interactions*CF[c]*rowNoise(c+"ai"))})).sort((a,b)=>b.value-a.value),gaps=op.slice().sort((a,b)=>(b.demand_index-b.supply_index)-(a.demand_index-a.supply_index)),topAct=acts.slice().sort((a,b)=>b.plans-a.plans)[0],residents=Math.round(m.searches*.58),visitors=Math.round(m.searches*.42);
    if(id==="top-category"){const x=cats[0];return tr("الفئة الأعلى طلبًا ضمن الفلاتر الحالية هي <b>"+esc(x?x.category:"—")+"</b>، مع مستوى تفاعل تجريبي يقارب <b>"+fmt(x?x.value:0)+"</b>.","The highest-demand category under the active filters is <b>"+esc(enText(x?x.category:"—"))+"</b>, with illustrative engagement of about <b>"+fmt(x?x.value:0)+"</b>.")}
    if(id==="top-area"){const x=areas[0];return tr("أعلى نمو في الاهتمام يظهر في <b>"+esc(x?x.area:"—")+"</b> بنحو <b>"+Math.round((x?x.growth:0)*100)+"%</b>.","The fastest interest growth appears in <b>"+esc(enText(x?x.area:"—"))+"</b> at about <b>"+Math.round((x?x.growth:0)*100)+"%</b>.")}
    if(id==="largest-gap"){const x=gaps[0];return tr("أكبر فجوة تجريبية تظهر في <b>"+esc(x?x.area:"—")+" · "+esc(x?x.category:"—")+"</b>، بفارق <b>"+((x?x.demand_index:0)-(x?x.supply_index:0))+" نقطة</b> بين الطلب والعرض.","The largest illustrative gap appears in <b>"+esc(enText(x?x.area:"—"))+" · "+esc(enText(x?x.category:"—"))+"</b>, with a <b>"+((x?x.demand_index:0)-(x?x.supply_index:0))+"-point</b> difference between demand and supply.")}
    if(id==="top-activity"){return tr(topAct?"أكثر نشاط إضافة إلى «خطتي» هو <b>"+esc(topAct.activity)+"</b> بعدد تجريبي <b>"+fmt(topAct.plans)+"</b>.":"لا توجد أنشطة مطابقة للفلاتر الحالية.","The activity most often added to My Plan is <b>"+esc(topAct?enText(topAct.activity):"—")+"</b> with an illustrative <b>"+fmt(topAct?topAct.plans:0)+"</b> additions.")}
    if(id==="audience"){return tr("ضمن النموذج الحالي، تمثل عمليات البحث المنسوبة لسكان مكة نحو <b>"+fmt(residents)+"</b> مقابل <b>"+fmt(visitors)+"</b> للزوار. استخدم فلتر الجمهور لقراءة كل شريحة منفصلة.","In the current model, searches attributed to Makkah residents are about <b>"+fmt(residents)+"</b> versus <b>"+fmt(visitors)+"</b> for visitors. Use the audience filter to inspect each segment separately.")}
    const x=op[0];return tr("أبرز إشارة تحتاج متابعة تظهر في <b>"+esc(x?x.area:"—")+" · "+esc(x?x.category:"—")+"</b> بمؤشر <b>"+(x?x.score.toFixed(0):0)+"/100</b>. هذه إشارة للتحقق وليست ضمانًا تجاريًا.","The signal needing the most attention appears in <b>"+esc(enText(x?x.area:"—"))+" · "+esc(enText(x?x.category:"—"))+"</b> with a <b>"+(x?x.score.toFixed(0):0)+"/100</b> signal index. It is a validation signal, not a commercial guarantee.")
  }
  function aiAssistant(){
    const q=AI_QUESTIONS.find(x=>x[0]===aiQuestion)||AI_QUESTIONS[0];
    return '<section class="ai-agent"><div class="ai-accent" aria-hidden="true"></div><div class="ai-head"><div class="ai-symbol">'+iconSvg("sparkles",19)+'</div><div class="ai-copy"><h2>'+tr("مساعد EyeMakkah التحليلي","EyeMakkah Analytics Assistant")+'</h2><p>'+tr("اختر سؤالًا من البنك الثابت، وسأجيب وفق الفلاتر والبيانات التجريبية الحالية.","Choose a question from the fixed bank and the answer will use the current filters and synthetic data.")+'</p></div></div><div class="ai-grid"><div class="ai-questions">'+AI_QUESTIONS.map(x=>'<button type="button" data-ai-question="'+x[0]+'" class="'+(x[0]===aiQuestion?"active":"")+'">'+esc(state.lang==="ar"?x[1]:x[2])+'</button>').join("")+'</div><div class="ai-answer"><div class="ai-answer-label">'+tr("الإجابة التحليلية","Analytical answer")+'</div><div class="ai-answer-text">'+aiAnswer(q[0])+'</div><div class="ai-foot">'+tr("إجابة نموذجية مبنية على بيانات اصطناعية وليست مخرجات من نموذج ذكاء اصطناعي حي.","Prototype answer based on synthetic data; not generated by a live AI model.")+'</div></div></div></section>'
  }

  function dashboard(){
    const m=metrics(),tr=trend(["searches","saves","plans"]),catSet=state.category==="الكل"?CATS:[state.category],areaSet=state.area==="مكة المكرمة"?AREAS:[state.area],cats=catSet.map(c=>({name:c,value:Math.round(m.interactions*CF[c]/catSet.reduce((s,x)=>s+CF[x],0)*rowNoise(c+"dash"))})).sort((a,b)=>b.value-a.value),ag=areaSet.map(a=>({area:a,growth:scaledRate(.04+(AF[a]-.68)*.18,a+"dash")})).sort((a,b)=>b.growth-a.growth),top=scaledOppRows(OPPS.filter(r=>(state.area==="مكة المكرمة"||r.area===state.area)&&(state.category==="الكل"||r.category===state.category))).sort((a,b)=>b.score-a.score)[0],comm=communityRows();
    return header("لوحة المعلومات","لقطة تنفيذية لما يحدث عبر تجربة EyeMakkah، من الاهتمام والاكتشاف إلى التخطيط والانتقال للإجراء.")+filters()+
      '<div class="kpi-grid">'+kpi("إجمالي التفاعلات",fmt(m.interactions),delta(1))+kpi("المستخدمون النشطون",fmt(m.active_users),delta(2))+kpi("عمليات البحث",fmt(m.searches),delta(3))+kpi("الإضافات إلى «خطتي»",fmt(m.plans),delta(4))+kpi("الانتقال إلى الإجراء",fmt(m.actions),delta(5))+'</div>'+aiAssistant()+
      '<div class="grid-2">'+panel("اتجاهات الطلب عبر الزمن","البحث والحفظ والإضافة إلى خطتي.",line([{name:"بحث",color:C.green,values:tr.searches},{name:"حفظ",color:C.gold,values:tr.saves},{name:"إضافة إلى خطتي",color:C.clay,values:tr.plans}]))+panel("أكثر القطاعات جذبًا للاهتمام","حصة التفاعلات حسب الفئة.",donutData(cats,"name","value"))+'</div>'+
      insight("يتسارع الاهتمام في <b>"+esc(ag[0].area)+"</b> بالتزامن مع إشارات طلب مرتفعة في <b>"+esc(top.category)+"</b>. الإشارة مناسبة للاستكشاف واتخاذ القرار، وليست توقعًا تجاريًا مضمونًا.",["نمو متوسط "+Math.round(ag[0].growth*100)+"%","ارتفاع البحث والحفظ","مقارنة مستوى العرض بالطلب"])+
      '<div class="grid-2 equal">'+panel("المناطق الأعلى نموًا في الاهتمام","اتجاه النمو التجريبي.",bar(ag,"area","growth",C.gold,true))+panel("مختصر المجتمعات","الموضوعات التي تجمع نمو النقاش مع نشاط مرتفع.",'<div class="community-list">'+comm.slice().sort((a,b)=>b.growth-a.growth).slice(0,5).map(r=>'<div class="community-row"><strong>'+esc(r.community)+'</strong><span class="growth">'+Math.round(r.growth*100)+'% ↑</span><p>'+esc(r.themes)+'</p></div>').join("")+'</div>')+'</div>';
  }
  function demand(){
    const m=metrics(),trn=trend(["searches","plans","actions"]),terms=termRows(),fast=terms.slice().sort((a,b)=>b.growth-a.growth).slice(0,7),audAll=[{aud:"سكان مكة",searches:m.searches*.58,plans:m.plans*.61,actions:m.actions*.57},{aud:"الزوار",searches:m.searches*.42,plans:m.plans*.39,actions:m.actions*.43}],aud=state.audience==="الكل"?audAll:audAll.filter(x=>x.aud===state.audience),topTerm=fast[0],saveToPlan=m.saves?Math.round(m.plans/m.saves*100):0;
    return header("تحليل الطلب","فهم ما يبحث عنه المستخدمون، متى يرتفع الاهتمام، وكيف ينتقل الطلب من البحث إلى الإجراء.")+filters()+
      '<div class="grid-2">'+panel("الطلب عبر الزمن","البحث والخطة والإجراء.",line([{name:"بحث",color:C.green,values:trn.searches},{name:"خطتي",color:C.gold,values:trn.plans},{name:"إجراء",color:C.clay,values:trn.actions}]))+panel("أسرع عمليات البحث نموًا","مؤشر تجريبي مبني على بيانات اصطناعية.",bar(fast,"term","growth",C.gold,true))+'</div>'+
      '<div class="grid-2 equal">'+panel("أكثر مصطلحات البحث","ترتيب نسبي للاهتمام.",table(terms.slice().sort((a,b)=>b.index-a.index),[["term","مصطلح البحث"],["category","الفئة"],["index","مؤشر الطلب"],["growth","النمو","pct"]]))+panel("سكان مكة مقابل الزوار","مقارنة الطلب حسب نوع الجمهور.",stackedAudience(aud))+'</div>'+
      panel("رحلة الطلب","الحفظ لا يساوي الإضافة إلى خطتي، والإضافة لا تعني حجزًا أو إكمالًا.",funnel(["بحث","عرض التفاصيل","حفظ","إضافة إلى خطتي","انتقال للإجراء"],[m.searches,m.views,m.saves,m.plans,m.actions]))+
      insight("أعلى نمو في البحث حاليًا يظهر في <b>"+esc(topTerm?topTerm.term:"—")+"</b> بنسبة <b>"+(topTerm?Math.round(topTerm.growth*100):0)+"%</b>، بينما ينتقل نحو <b>"+saveToPlan+"%</b> من الحفظ إلى «خطتي».",["الفئة: "+(topTerm?topTerm.category:"—"),"الحفظ "+fmt(m.saves),"الإضافة إلى خطتي "+fmt(m.plans)]);
  }
  function areas(){
    const area=state.selectedArea,oo=scaledOppRows(OPPS.filter(o=>o.area===area&&(state.category==="الكل"||o.category===state.category))),d=Math.round(sum(oo,"demand_index")/oo.length),g=sum(oo,"growth")/oo.length,top=oo.slice().sort((a,b)=>b.demand_index-a.demand_index)[0],best=oo.slice().sort((a,b)=>b.score-a.score)[0],rows=oo.slice().sort((a,b)=>b.demand_index-a.demand_index);
    return header("تحليل المناطق","قراءة جغرافية مبسطة للاهتمام والطلب والفرص على مستوى أحياء ومناطق مكة.")+filters()+
      '<div class="area-selector"><label>المنطقة قيد التحليل</label><select id="area-detail">'+opts(AREAS,area)+'</select></div>'+
      '<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">'+kpi("مستوى الاهتمام",d+"/100",g)+kpi("نمو الطلب",Math.round(g*100)+"%",g)+kpi("الفئة الأبرز",top.category,CG[top.category],"ضمن النموذج",true)+kpi("وقت الذروة",["العوالي","العزيزية","الشوقية"].includes(area)?"المساء 7–10 م":"العصر 4–7 م",.06,"ضمن النموذج",true)+'</div>'+
      '<div class="grid-2 equal">'+panel("الطلب مقابل العرض","مقارنة مباشرة بين مؤشر الطلب ومستوى العرض حسب الفئة.",groupedDemandSupply(rows))+panel("ملف المنطقة","مؤشرات الفجوة والطلب.",table(rows,[["category","الفئة"],["demand_index","الطلب"],["growth","النمو","pct"],["supply_index","العرض"],["score","الإشارة"]]))+'</div>'+
      insight("شهدت <b>"+esc(area)+"</b> نموًا في الاهتمام بـ <b>"+esc(best.category)+"</b>، بينما يظل مؤشر العرض التجريبي أقل من مؤشر الطلب. هذه إشارة لدراسة الاحتياج، وليست ضمانًا لفرصة تجارية.",["مؤشر طلب "+best.demand_index+"/100","نمو "+Math.round(best.growth*100)+"%","مؤشر عرض "+best.supply_index+"/100"]);
  }
  function activities(){
    const a=activityRows();
    if(!a.length)return header("الأنشطة والتجارب","تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض والحفظ والتخطيط والانضمام والإجراء والإكمال.")+filters()+emptyState("لا توجد أنشطة تجريبية مطابقة لهذه الفلاتر.","No demo activities match these filters.");
    const max=k=>a.slice().sort((x,y)=>y[k]-x[k])[0],lead=max("plans");
    return header("الأنشطة والتجارب","تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض والحفظ والتخطيط والانضمام والإجراء والإكمال.")+filters()+
      '<div class="kpi-grid">'+kpi("الأكثر مشاهدة",max("views").activity,.12,"ضمن بيانات النموذج",true)+kpi("الأكثر حفظًا",max("saves").activity,.16,"ضمن بيانات النموذج",true)+kpi("الأكثر إضافة إلى خطتي",lead.activity,lead.growth,"ضمن بيانات النموذج",true)+kpi("الأعلى في نية الحضور",max("joins").activity,.09,"ضمن بيانات النموذج",true)+kpi("الأعلى انتقالًا للإجراء",max("actions").activity,.11,"ضمن بيانات النموذج",true)+'</div>'+
      '<div class="grid-2 equal">'+panel("قمع التفاعل","المراحل منفصلة ولا يتم دمجها في «تحويل» واحد.",funnel(["عرض","حفظ","إضافة إلى خطتي","انضمام / نية حضور","انتقال للإجراء","إكمال"],["views","saves","plans","joins","actions","complete"].map(k=>sum(a,k))))+panel("المشاهدة مقابل الحفظ","كل نقطة تمثل نشاطًا؛ حجم النقطة يعكس اتجاه النمو.",bubbleActivities(a))+'</div>'+
      insight("يتصدر <b>"+esc(lead.activity)+"</b> الإضافة إلى «خطتي» ضمن الفلاتر الحالية، مع نمو تجريبي قدره <b>"+Math.round(lead.growth*100)+"%</b>.",["مشاهدة "+fmt(lead.views),"حفظ "+fmt(lead.saves),"خطتي "+fmt(lead.plans)])+
      panel("أداء الأنشطة","ترتيب تفاعلي للأنشطة مع مؤشرات كل مرحلة.",table(a.slice().sort((x,y)=>y.plans-x.plans),[["activity","النشاط"],["category","الفئة"],["area","المنطقة"],["views","عرض","num"],["saves","حفظ","num"],["plans","خطتي","num"],["joins","انضمام","num"],["actions","إجراء","num"],["complete","إكمال","num"],["growth","النمو","pct"]]));
  }
  function communities(){
    const comm=communityRows(),topics=[
      ["أنشطة الأطفال",scaledRate(.34,"topic1"),"أسئلة وتوصيات نهاية الأسبوع"],
      ["تجارب المساء",scaledRate(.29,"topic2"),"اقتراحات لأنشطة اجتماعية"],
      ["الورش الإبداعية",scaledRate(.27,"topic3"),"بحث عن تجارب قصيرة"],
      ["أماكن قريبة",scaledRate(.18,"topic4"),"طلب خيارات حسب الحي"]
    ],lead=comm.slice().sort((a,b)=>b.engagement-a.engagement)[0],topic=topics.slice().sort((a,b)=>b[1]-a[1])[0];
    return header("المجتمعات والاهتمامات","ذكاء مجتمعي يركز على أنماط الموضوعات والمشاركة، دون ملفات نفسية أو تعرّف على الأفراد.")+filters()+
      '<div class="grid-2">'+panel("المجتمعات الأكثر نشاطًا","حجم التفاعل ونمو النقاش.",bar(comm.slice().sort((a,b)=>b.engagement-a.engagement),"community","engagement"))+panel("أنماط المساهمة","نوع المساهمة الأكثر ظهورًا في كل مجتمع.",donut(comm))+'</div>'+
      panel("موضوعات تكتسب زخمًا","ملخص نوعي للنقاشات التجريبية.",'<div class="grid-4" style="margin-top:0">'+topics.map(x=>'<div class="kpi-card"><div class="kpi-label">'+esc(x[2])+'</div><div class="kpi-value text">'+esc(x[0])+'</div><div class="delta up">↑ '+Math.round(x[1]*100)+'%</div></div>').join("")+'</div>')+
      insight("المجتمع الأكثر نشاطًا حاليًا هو <b>"+esc(lead.community)+"</b>، بينما يحقق موضوع <b>"+esc(topic[0])+"</b> أسرع زخم تجريبي.",["تفاعل "+fmt(lead.engagement),"نمو المجتمع "+Math.round(lead.growth*100)+"%","نمو الموضوع "+Math.round(topic[1]*100)+"%"]);
  }
  function campaigns(){
    let rows=campaignRows();
    if(!rows.length)return header("الحملات والعروض","قراءة أداء حملات تجريبية للشركاء والعلامات التجارية.")+filters()+emptyState("لا توجد حملات تجريبية مطابقة للفلاتر المحددة.","No demo campaigns match the selected filters.");
    if(!rows.some(r=>r.campaign===state.campaign))state.campaign=rows[0].campaign;
    const r=rows.find(x=>x.campaign===state.campaign);
    const areaSet=state.area==="مكة المكرمة"?AREAS:[state.area];
    const geo=areaSet.map(a=>({area:a,value:scaledCount(r.handoffs/Math.max(1,areaSet.length),r.campaign+a+"geo",AF[a]*periodIntensity())}));
    const viewRate=r.impressions?Math.round(r.views/r.impressions*100):0,handoffRate=r.views?Math.round(r.handoffs/r.views*100):0;
    return header("الحملات والعروض","قراءة أداء حملات تجريبية للشركاء والعلامات التجارية من الظهور حتى الانتقال إلى العرض أو الإجراء.")+filters()+
      '<div class="campaign-selector"><label>اختر حملة</label><select id="campaign-select">'+opts(rows.map(x=>x.campaign),state.campaign)+'</select></div>'+
      '<div class="kpi-grid">'+kpi("الظهور",fmt(r.impressions),r.growth)+kpi("المشاهدة",fmt(r.views),delta(11))+kpi("فتح التفاصيل",fmt(r.details),delta(12))+kpi("الحفظ",fmt(r.saves),delta(13))+kpi("الانتقال للعرض",fmt(r.handoffs),delta(14))+'</div>'+
      '<div class="grid-2">'+panel("قمع الحملة","أداء «"+r.campaign+"» عبر مراحل التفاعل.",funnel(["ظهور","مشاهدة","فتح التفاصيل","حفظ","إضافة إلى خطتي","انتقال إلى العرض"],[r.impressions,r.views,r.details,r.saves,Math.floor(r.saves*(.38+.08*periodIntensity())),r.handoffs]))+panel("الأداء الجغرافي","توزيع تجريبي للاستجابة حسب المنطقة.",bar(geo,"area","value"))+'</div>'+
      insight("حققت حملة <b>"+esc(r.campaign)+"</b> معدل مشاهدة تقريبيًا <b>"+viewRate+"%</b> من الظهور، ومعدل انتقال للعرض <b>"+handoffRate+"%</b> من المشاهدات.",["المشاهدة "+fmt(r.views),"الحفظ "+fmt(r.saves),"الانتقال للعرض "+fmt(r.handoffs)]);
  }
  function opportunities(){
    const o=scaledOppRows(OPPS.filter(r=>(state.area==="مكة المكرمة"||r.area===state.area)&&(state.category==="الكل"||r.category===state.category))).sort((a,b)=>b.score-a.score),top=o[0],gaps=o.map(r=>Object.assign({},r,{gap:r.demand_index-r.supply_index})).sort((a,b)=>b.gap-a.gap),avgDemand=Math.round(sum(o,"demand_index")/Math.max(o.length,1)),avgSupply=Math.round(sum(o,"supply_index")/Math.max(o.length,1));
    return header("الفرص والفجوات","إشارات دعم قرار تجمع الطلب والنمو ومستوى العرض. لا تمثل هذه الإشارات ضمانًا لجدوى مشروع أو استثمار.")+filters()+
      '<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">'+kpi("متوسط مؤشر الطلب",avgDemand+"/100",top.growth)+kpi("متوسط مستوى العرض",avgSupply+"/100",-.03)+kpi("أكبر فجوة",gaps[0].gap+" نقطة",gaps[0].growth,"طلب − عرض",true)+kpi("أعلى إشارة",top.score.toFixed(0)+"/100",top.growth,top.area+" · "+top.category,true)+'</div>'+
      insight("أقوى إشارة في الفلاتر الحالية تظهر في <b>"+esc(top.area)+"</b> ضمن <b>"+esc(top.category)+"</b>: "+esc(top.reason)+". يوصى باستخدامها كنقطة بداية للتحقق الميداني ودراسة السوق.",["مؤشر طلب "+top.demand_index,"نمو "+Math.round(top.growth*100)+"%","مؤشر عرض "+top.supply_index])+
      '<div class="grid-2">'+panel("الطلب مقابل العرض","كل نقطة تمثل منطقة × فئة؛ أعلى الطلب مع عرض أقل يستحق تحققًا أعمق.",scatterOpp(o))+panel("الإشارات الأعلى","ترتيب وفق مؤشر تجريبي مركب.",'<div>'+o.slice(0,7).map(r=>'<div class="signal"><b>'+esc(r.area)+' · '+esc(r.category)+'</b><span class="signal-score">'+r.score.toFixed(0)+'</span><small>'+esc(r.reason)+' · نمو '+Math.round(r.growth*100)+'%</small></div>').join("")+'</div>')+'</div>'+
      panel("جدول الفرص","تفاصيل الإشارات الداعمة للقرار.",table(o,[["area","المنطقة"],["category","الفئة"],["demand_index","مؤشر الطلب"],["growth","اتجاه النمو","pct"],["supply_index","مستوى العرض"],["reason","سبب ظهور الفرصة"],["score","مؤشر الإشارة"]]));
  }
  function reportRows(){
    const m=metrics(),rows=[];
    const areas=state.area==="مكة المكرمة"?AREAS:[state.area];
    const cats=state.category==="الكل"?CATS:[state.category];
    const auds=state.audience==="الكل"?AUD:[state.audience];
    areas.forEach(a=>cats.forEach(c=>auds.forEach(u=>{
      const f=AF[a]*CF[c]*(u==="الزوار"?1.02:1.06)/Math.max(4,areas.length*cats.length*.7);
      rows.push({
        area:a,category:c,audience:u,
        interactions:Math.round(m.interactions*f*rowNoise(a+c+u+"ri")),
        active_users:Math.round(m.active_users*f*rowNoise(a+c+u+"ru")),
        searches:Math.round(m.searches*f*rowNoise(a+c+u+"rs")),
        views:Math.round(m.views*f*rowNoise(a+c+u+"rv")),
        saves:Math.round(m.saves*f*rowNoise(a+c+u+"rsa")),
        plans:Math.round(m.plans*f*rowNoise(a+c+u+"rp")),
        joins:Math.round(m.joins*f*rowNoise(a+c+u+"rj")),
        actions:Math.round(m.actions*f*rowNoise(a+c+u+"ra")),
        completes:Math.round(m.completes*f*rowNoise(a+c+u+"rc")),
        contributes:Math.round(m.contributes*f*rowNoise(a+c+u+"rco"))
      });
    })));
    return rows;
  }
  function reports(){
    const rr=[["التقرير الشهري للطلب والاهتمام","ملخص البحث والحفظ والتخطيط واتجاهات الطلب."],["تحليل مناطق مكة","مقارنة المناطق والفئات ومؤشرات النمو."],["تقرير المجتمعات والاهتمامات","أنماط النقاش والمساهمة والموضوعات الصاعدة."],["أداء الحملات والعروض","قمع الحملات والأداء حسب الجمهور والمنطقة."],["تقرير الفرص والفجوات","إشارات الطلب مقابل العرض لدعم التحقق والدراسة."]],rows=reportRows(),m=metrics(),trn=trend(["searches","plans"]),
    exportBlock=uiIssue&&uiIssue.scope==="export"
      ?errorState("export","تعذّر تجهيز ملف التصدير","The export could not be prepared","لم يتم تنزيل الملف. أعد المحاولة؛ بيانات التقرير والفلاتر الحالية لم تتأثر.","The file was not downloaded. Try again; the report data and active filters were not affected.","export")
      :'<section class="report-export"><div class="report-export-head"><div><div class="panel-title">تصدير ملخص CSV</div><div class="panel-copy">يحتوي الملف على مؤشرات مجمعة وفق الفلاتر الحالية.</div></div><button class="download-btn" id="download-csv">'+iconSvg("download",16)+'<span>تصدير CSV</span></button></div>'+table(rows.slice(0,30),[["area","المنطقة"],["category","الفئة"],["audience","الجمهور"],["interactions","التفاعلات","num"],["active_users","المستخدمون النشطون","num"],["searches","البحث","num"],["views","العرض","num"],["saves","الحفظ","num"],["plans","الإضافة إلى خطتي","num"],["actions","الانتقال إلى الإجراء","num"]])+'</section>';
    return header("التقارير","مركز مبسط لعرض التقارير الدورية وتصدير ملخصات البيانات التجريبية.")+filters()+
      '<div class="report-summary"><div class="report-kpis">'+kpi("عمليات البحث",fmt(m.searches),delta(21))+kpi("الإضافات إلى «خطتي»",fmt(m.plans),delta(22))+kpi("الانتقال إلى الإجراء",fmt(m.actions),delta(23))+'</div>'+panel("اتجاه مختصر","ملخص بصري للفترة الحالية.",line([{name:"بحث",color:C.green,values:trn.searches},{name:"خطتي",color:C.gold,values:trn.plans}]))+'</div>'+
      '<div class="reports-list">'+rr.map(x=>'<details class="report"><summary><span>'+esc(x[0])+'</span><span class="report-chevron">'+iconSvg("chevronDown",16)+'</span></summary><div class="report-body">'+esc(x[1])+'<br><small>الفترة: '+esc(state.period)+' · المنطقة: '+esc(state.area)+' · الفئة: '+esc(state.category)+' · الجمهور: '+esc(state.audience)+'</small><br>يعرض النموذج بنية التقرير وتجربة التفاعل. البيانات توضيحية وليست بيانات تشغيلية حية.</div></details>').join("")+'</div>'+
      exportBlock+
      '<script id="report-data" type="application/json">'+JSON.stringify(rows).replace(/</g,"\\u003c")+'</script>';
  }


  const EN_MAP={
    "لوحة المعلومات":"Dashboard","تحليل الطلب":"Demand Analysis","تحليل المناطق":"Area Analysis","الأنشطة والتجارب":"Activities & Experiences","المجتمعات والاهتمامات":"Communities & Interests","الحملات والعروض":"Campaigns & Offers","الفرص والفجوات":"Opportunities & Gaps","التقارير":"Reports",
    "الفترة الزمنية":"Time period","المنطقة":"Area","القطاع / الفئة":"Sector / Category","نوع الجمهور":"Audience type",
    "الكل":"All","مكة المكرمة":"Makkah","العزيزية":"Al Aziziyah","الشوقية":"Ash Shawqiyah","العوالي":"Al Awali","النسيم":"An Naseem","الزاهر":"Az Zahir","الشرائع":"Ash Shara'i","بطحاء قريش":"Batha Quraysh",
    "المطاعم والمقاهي":"Restaurants & Cafés","التجارب والأنشطة":"Experiences & Activities","التسوق":"Shopping","الترفيه":"Entertainment","الثقافة":"Culture","الخدمات":"Services","المجتمعات":"Communities","الضيافة":"Hospitality","سكان مكة":"Makkah Residents","الزوار":"Visitors",
    "آخر 7 أيام":"Last 7 days","آخر 30 يومًا":"Last 30 days","آخر 3 أشهر":"Last 3 months","آخر 12 شهرًا":"Last 12 months",
    "إجمالي التفاعلات":"Total interactions","المستخدمون النشطون":"Active users","عمليات البحث":"Searches","الإضافات إلى «خطتي»":"Added to My Plan","الانتقال إلى الإجراء":"Action handoff","مقارنة بالفترة السابقة":"vs previous period",
    "اتجاهات الطلب عبر الزمن":"Demand trends over time","أكثر القطاعات جذبًا للاهتمام":"Top categories by interest","المناطق الأعلى نموًا في الاهتمام":"Fastest-growing areas by interest","مختصر المجتمعات":"Community summary",
    "الطلب عبر الزمن":"Demand over time","أسرع عمليات البحث نموًا":"Fastest-growing searches","أكثر مصطلحات البحث":"Top search terms","سكان مكة مقابل الزوار":"Residents vs Visitors","رحلة الطلب":"Demand journey",
    "المنطقة قيد التحليل":"Area under analysis","مستوى الاهتمام":"Interest level","نمو الطلب":"Demand growth","الفئة الأبرز":"Top category","وقت الذروة":"Peak time","الفئات الأعلى طلبًا":"Highest-demand categories","ملف المنطقة":"Area profile",
    "الأكثر مشاهدة":"Most viewed","الأكثر حفظًا":"Most saved","الأكثر إضافة إلى خطتي":"Most added to My Plan","الأعلى في نية الحضور":"Highest attendance intent","الأعلى انتقالًا للإجراء":"Highest action handoff","قمع التفاعل":"Interaction funnel","أعلى الأنشطة نموًا":"Fastest-growing activities","أداء الأنشطة":"Activity performance",
    "المجتمعات الأكثر نشاطًا":"Most active communities","أنماط المساهمة":"Contribution patterns","موضوعات تكتسب زخمًا":"Topics gaining momentum",
    "اختر حملة":"Select campaign","الظهور":"Impressions","المشاهدة":"Views","فتح التفاصيل":"Detail opens","الحفظ":"Saves","الانتقال للعرض":"Offer handoff","قمع الحملة":"Campaign funnel","الأداء الجغرافي":"Geographic performance",
    "الطلب مقابل العرض":"Demand vs supply","الإشارات الأعلى":"Top signals","جدول الفرص":"Opportunity table",
    "تصدير ملخص CSV":"Export CSV summary","تصدير CSV":"Export CSV","رؤية تحليلية · نموذج توضيحي":"Analytical insight · illustrative model","لماذا ظهرت هذه الرؤية؟":"Why did this insight appear?","بداية الفترة":"Period start","آخر تحديث":"Latest update",
    "بحث":"Search","عرض التفاصيل":"View details","إضافة إلى خطتي":"Add to My Plan","خطتي":"My Plan","إجراء":"Action","عرض":"View","انضمام / نية حضور":"Join / attendance intent","إكمال":"Complete","انضمام":"Join",
    "مصطلح البحث":"Search term","الفئة":"Category","مؤشر الطلب":"Demand index","النمو":"Growth","الطلب":"Demand","العرض":"Supply","الإشارة":"Signal","النشاط":"Activity","الجمهور":"Audience","التفاعلات":"Interactions","الإضافة إلى خطتي":"Added to My Plan","سبب ظهور الفرصة":"Signal reason","اتجاه النمو":"Growth trend","مستوى العرض":"Supply level","مؤشر الإشارة":"Signal index",
    "جولة ذاكرة مكة":"Makkah Memory Walk","مساء الخط العربي":"Arabic Calligraphy Evening","تجربة القهوة السعودية":"Saudi Coffee Experience","مسار الأسواق القديمة":"Old Markets Trail","مختبر الصغار الإبداعي":"Kids Creative Lab","جلسة تصوير معالم مكة":"Makkah Landmarks Photo Session","ورشة الحرف المحلية":"Local Crafts Workshop","ليلة القصص المكية":"Makkah Stories Night","مشي العوالي المسائي":"Al Awali Evening Walk","تجربة المذاقات الحجازية":"Hijazi Flavours Experience",
    "الأحياء":"Neighborhoods","زوار مكة":"Makkah Visitors","الحج والعمرة":"Hajj & Umrah","المطاعم والتجارب":"Restaurants & Experiences","الثقافة والتاريخ":"Culture & History","التطوع والمبادرات":"Volunteering & Initiatives","التعليم والهوايات":"Education & Hobbies","الحياة في مكة":"Life in Makkah","توصيات":"Recommendations","أسئلة":"Questions","تحديثات":"Updates","مساهمات":"Contributions",
    "عطلة نهاية الأسبوع":"Weekend","تجارب المساء":"Evening Experiences","نكهات مكة":"Flavours of Makkah","اكتشف الثقافة":"Discover Culture","قريب منك":"Near You",
    "مطاعم عائلية":"Family restaurants","قهوة مختصة":"Specialty coffee","أنشطة للأطفال":"Kids activities","فعاليات نهاية الأسبوع":"Weekend events","تجارب ثقافية":"Cultural experiences","أماكن هادئة":"Quiet places","ورش فنية":"Art workshops","أماكن قريبة":"Nearby places","مطاعم بإطلالة":"Restaurants with a view","أنشطة مسائية":"Evening activities","تجارب للعائلة":"Family experiences","متاحف":"Museums",
    "طلب مرتفع مع عرض محدود":"High demand with limited supply","اهتمام متزايد مع قلة الخيارات":"Growing interest with few options","بحث متكرر مقابل نتائج محدودة":"Repeated searches with limited results","إشارة تستحق المتابعة":"Signal worth monitoring",
    "منصة EyeMakkah لتحليلات الأعمال":"EyeMakkah Business Analytics Platform","نموذج تحليلات الأعمال":"Business Analytics Prototype",
    "آخر تحديث للنموذج: 22 سبتمبر 2026":"Prototype updated: 22 September 2026","بيانات اصطناعية لأغراض العرض":"Synthetic data for demonstration","لا تتضمن معلومات شخصية.":"No personal information is included."
  };
  Object.assign(EN_MAP,{
    "مرحباً، مستخدم تجريبي":"Welcome, Demo User","آخر تحديث للبيانات: 22 سبتمبر 2026":"Data updated: 22 September 2026","مستخدم تجريبي":"Demo User","الإعدادات":"Settings","تسجيل الخروج":"Sign out",
    "إجمالي":"Total","المشاهدات":"Views","المشاهدة مقابل الحفظ":"Views vs saves","كل نقطة تمثل نشاطًا؛ حجم النقطة يعكس اتجاه النمو.":"Each point represents an activity; bubble size reflects the growth trend.",
    "مقارنة مباشرة بين مؤشر الطلب ومستوى العرض حسب الفئة.":"Direct comparison of demand and supply by category.","كل نقطة تمثل منطقة × فئة؛ أعلى الطلب مع عرض أقل يستحق تحققًا أعمق.":"Each point represents an area × category; higher demand with lower supply warrants deeper validation.",
    "اختر لغة المنصة":"Choose platform language","ابدأ بالعربية":"Continue in Arabic","Continue in English":"Continue in English","تسجيل الدخول":"Sign in","البريد الإلكتروني":"Email","كلمة المرور":"Password","نسيت كلمة المرور؟":"Forgot password?","الدخول إلى النسخة التجريبية":"Enter demo","منصة تحليلات أعمال تساعد على فهم الطلب والاهتمامات والإشارات المكانية لدعم القرار.":"A business analytics platform for understanding demand, interests, and geographic signals to support decisions."
  });
  const EN_PARTS=[
    ["لقطة تنفيذية لما يحدث عبر تجربة EyeMakkah، من الاهتمام والاكتشاف إلى التخطيط والانتقال للإجراء.","Executive view of the EyeMakkah journey, from interest and discovery to planning and action handoff."],
    ["فهم ما يبحث عنه المستخدمون، متى يرتفع الاهتمام، وكيف ينتقل الطلب من البحث إلى الإجراء.","Understand what users search for, when interest rises, and how demand moves from search to action."],
    ["قراءة جغرافية مبسطة للاهتمام والطلب والفرص على مستوى أحياء ومناطق مكة.","A simplified geographic view of interest, demand, and opportunity signals across Makkah areas."],
    ["تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض والحفظ والتخطيط والانضمام والإجراء والإكمال.","Analyze participation behavior while keeping view, save, plan, join, action, and completion distinct."],
    ["ذكاء مجتمعي يركز على أنماط الموضوعات والمشاركة، دون ملفات نفسية أو تعرّف على الأفراد.","Community analytics focused on topic and participation patterns, without profiling or identifying individuals."],
    ["قراءة أداء حملات تجريبية للشركاء والعلامات التجارية من الظهور حتى الانتقال إلى العرض أو الإجراء.","Illustrative campaign performance from impression through offer or action handoff."],
    ["قراءة أداء حملات تجريبية للشركاء والعلامات التجارية.","Illustrative campaign performance for partners and brands."],
    ["إشارات دعم قرار تجمع الطلب والنمو ومستوى العرض. لا تمثل هذه الإشارات ضمانًا لجدوى مشروع أو استثمار.","Decision-support signals combining demand, growth, and supply. These signals do not guarantee project or investment feasibility."],
    ["مركز مبسط لعرض التقارير الدورية وتصدير ملخصات البيانات التجريبية.","A simple center for periodic reports and export of illustrative data summaries."],
    ["البيانات المعروضة في هذا النموذج توضيحية لأغراض تصميم وتجربة المنصة، ولا تمثل بيانات تشغيلية حية أو معلومات عن أفراد.","The data shown in this prototype is illustrative for product design and testing. It is not live operational data and does not represent individuals."],
    ["كل مرحلة إشارة مستقلة ولا تعني إتمام المرحلة التالية.","Each stage is a separate signal and does not imply completion of the next stage."],
    ["الحفظ لا يساوي الإضافة إلى خطتي، والإضافة لا تعني حجزًا أو إكمالًا.","Saving is not the same as adding to a plan, and adding to a plan does not mean booking or completion."],
    ["ضمن بيانات النموذج","Within demo data"],["ضمن النموذج","Within demo"],
    ["لا توجد أنشطة تجريبية مطابقة لهذه الفلاتر.","No illustrative activities match these filters."],["لا توجد حملات تجريبية مطابقة للفلاتر المحددة.","No illustrative campaigns match the selected filters."],
    ["ملخص البحث والحفظ والتخطيط واتجاهات الطلب.","Summary of search, saves, planning, and demand trends."],["مقارنة المناطق والفئات ومؤشرات النمو.","Comparison of areas, categories, and growth indicators."],["أنماط النقاش والمساهمة والموضوعات الصاعدة.","Discussion, contribution, and emerging-topic patterns."],["قمع الحملات والأداء حسب الجمهور والمنطقة.","Campaign funnel and performance by audience and area."],["إشارات الطلب مقابل العرض لدعم التحقق والدراسة.","Demand-versus-supply signals for validation and study."],
    ["التقرير الشهري للطلب والاهتمام","Monthly demand & interest report"],["تحليل مناطق مكة","Makkah area analysis"],["تقرير المجتمعات والاهتمامات","Communities & interests report"],["أداء الحملات والعروض","Campaigns & offers performance"],["تقرير الفرص والفجوات","Opportunities & gaps report"],
    ["الفترة: ","Period: "],[" · المنطقة: "," · Area: "],[" · الفئة: "," · Category: "],[" · الجمهور: "," · Audience: "],
    ["نمو ","Growth "],["مؤشر طلب ","Demand index "],["مؤشر عرض ","Supply index "],["داخل ","Within "],[" للفترة الحالية."," for the current period."]
  ];
  Object.assign(EN_MAP,{
    "لقطة تنفيذية لما يحدث عبر تجربة EyeMakkah، من الاهتمام والاكتشاف إلى التخطيط والانتقال للإجراء.":"Executive view of the EyeMakkah journey, from interest and discovery to planning and action handoff.",
    "البحث والحفظ والإضافة إلى خطتي.":"Search, saves, and additions to My Plan.","حصة التفاعلات حسب الفئة.":"Share of interactions by category.","اتجاه النمو التجريبي.":"Illustrative growth trend.","الموضوعات التي تجمع نمو النقاش مع نشاط مرتفع.":"Topics combining discussion growth with strong activity.",
    "فهم ما يبحث عنه المستخدمون، متى يرتفع الاهتمام، وكيف ينتقل الطلب من البحث إلى الإجراء.":"Understand what users search for, when interest rises, and how demand moves from search to action.","البحث والخطة والإجراء.":"Search, planning, and action handoff.","مؤشر تجريبي مبني على بيانات اصطناعية.":"Illustrative indicator based on synthetic data.","ترتيب نسبي للاهتمام.":"Relative interest ranking.","مقارنة الطلب حسب نوع الجمهور.":"Demand comparison by audience type.","الحفظ لا يساوي الإضافة إلى خطتي، والإضافة لا تعني حجزًا أو إكمالًا.":"Saving is not the same as adding to a plan, and adding to a plan does not mean booking or completion.",
    "قراءة جغرافية مبسطة للاهتمام والطلب والفرص على مستوى أحياء ومناطق مكة.":"A simplified geographic view of interest, demand, and opportunity signals across Makkah areas.","مؤشرات الفجوة والطلب.":"Demand and gap indicators.","طلب − عرض":"Demand − Supply","أكبر فجوة":"Largest gap","أعلى إشارة":"Top signal","متوسط مؤشر الطلب":"Average demand index","متوسط مستوى العرض":"Average supply level",
    "تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض والحفظ والتخطيط والانضمام والإجراء والإكمال.":"Analyze participation behavior while keeping views, saves, planning, joining, action, and completion distinct.","المراحل منفصلة ولا يتم دمجها في «تحويل» واحد.":"Stages remain distinct and are not collapsed into a single conversion metric.","ترتيب تفاعلي للأنشطة مع مؤشرات كل مرحلة.":"Interactive activity ranking with metrics for every stage.",
    "ذكاء مجتمعي يركز على أنماط الموضوعات والمشاركة، دون ملفات نفسية أو تعرّف على الأفراد.":"Community analytics focused on topics and participation patterns without profiling or identifying individuals.","حجم التفاعل ونمو النقاش.":"Engagement volume and discussion growth.","نوع المساهمة الأكثر ظهورًا في كل مجتمع.":"Most visible contribution type in each community.","ملخص نوعي للنقاشات التجريبية.":"Qualitative summary of illustrative discussions.",
    "قراءة أداء حملات تجريبية للشركاء والعلامات التجارية من الظهور حتى الانتقال إلى العرض أو الإجراء.":"Illustrative campaign performance from impression through offer or action handoff.","توزيع تجريبي للاستجابة حسب المنطقة.":"Illustrative response distribution by area.",
    "إشارات دعم قرار تجمع الطلب والنمو ومستوى العرض. لا تمثل هذه الإشارات ضمانًا لجدوى مشروع أو استثمار.":"Decision-support signals combining demand, growth, and supply. These signals do not guarantee project or investment feasibility.","ترتيب وفق مؤشر تجريبي مركب.":"Ranking based on an illustrative composite index.","تفاصيل الإشارات الداعمة للقرار.":"Decision-support signal details.","طلب مرتفع · عرض أقل":"High demand · lower supply",
    "مركز مبسط لعرض التقارير الدورية وتصدير ملخصات البيانات التجريبية.":"A simple center for periodic reports and exporting illustrative data summaries.","اتجاه مختصر":"Quick trend","ملخص بصري للفترة الحالية.":"Visual summary for the current period.","يحتوي الملف على مؤشرات مجمعة وفق الفلاتر الحالية.":"The file contains aggregated indicators based on the active filters.","يعرض النموذج بنية التقرير وتجربة التفاعل. البيانات توضيحية وليست بيانات تشغيلية حية.":"The prototype demonstrates report structure and interaction. Data is illustrative and not live operational data.",
    "جرّب توسيع الفلاتر أو العودة إلى الإعدادات الافتراضية.":"Try broadening the filters or return to the default settings.","إعادة ضبط الفلاتر":"Reset filters","الإعدادات — قريبًا":"Settings — coming soon","سيتم تفعيل استعادة الحساب عند ربط نظام الدخول.":"Account recovery will be enabled when live authentication is connected.",
    "المشاهدات":"Views","ضمن بيانات النموذج":"Within demo data","ضمن النموذج":"Within demo"
  });
  const EXTRA_EN_PARTS=[
    ["أعلى نمو في البحث حاليًا يظهر في ","The fastest search growth currently appears in "],[" بنسبة "," at "],["، بينما ينتقل نحو "," while about "],[" من الحفظ إلى «خطتي»."," move from saves to My Plan."],
    ["يتصدر ",""],[" الإضافة إلى «خطتي» ضمن الفلاتر الحالية، مع نمو تجريبي قدره "," leads additions to My Plan under the active filters, with illustrative growth of "],
    ["المجتمع الأكثر نشاطًا حاليًا هو ","The most active community is "],["، بينما يحقق موضوع "," while the topic "],[" أسرع زخم تجريبي."," shows the fastest illustrative momentum."],
    ["حققت حملة ","Campaign "],[" معدل مشاهدة تقريبيًا "," reached an approximate view rate of "],[" من الظهور، ومعدل انتقال للعرض "," from impressions, with an offer-handoff rate of "],[" من المشاهدات."," from views."],
    ["أقوى إشارة في الفلاتر الحالية تظهر في ","The strongest signal under the active filters appears in "],[" ضمن "," within "],[". يوصى باستخدامها كنقطة بداية للتحقق الميداني ودراسة السوق.",". Use it as a starting point for field validation and market study."],
    ["الفئة: ","Category: "],["مشاهدة ","Views "],["حفظ ","Saves "],["الإضافة إلى خطتي ","Added to My Plan "],["تفاعل ","Engagement "],["نمو المجتمع ","Community growth "],["نمو الموضوع ","Topic growth "],["الانتقال للعرض ","Offer handoff "]
  ];
  EN_PARTS.push(...EXTRA_EN_PARTS);
  Object.assign(EN_MAP,{
    "حفظ":"Save",
    "أنشطة الأطفال":"Children's activities",
    "انتقال للإجراء":"Action handoff",
    "الانتقال للإجراء":"Action handoff",
    "يتسارع الاهتمام في":"Interest is accelerating in",
    "بالتزامن مع إشارات طلب مرتفعة في":"alongside strong demand signals in",
    ". الإشارة مناسبة للاستكشاف واتخاذ القرار، وليست توقعًا تجاريًا مضمونًا.":". The signal supports exploration and decision-making; it is not a guaranteed commercial forecast.",
    "مطاعم عائلية، قهوة، تجارب":"Family restaurants, coffee, experiences",
    "المعالم، الحكايات، المتاحف":"Landmarks, stories, museums",
    "أماكن قريبة، تنظيم اليوم":"Nearby places, day planning",
    "ورش، تعلم، نوادٍ":"Workshops, learning, clubs",
    "الخدمات اليومية، العائلة":"Daily services, family",
    "الخدمات المحلية، توصيات الأحياء":"Local services, neighborhood recommendations",
    "التجهيز، التنقل، التجربة":"Preparation, mobility, experience",
    "فرص التطوع، مبادرات الحي":"Volunteering opportunities, neighborhood initiatives",
    "أعلى نمو في البحث حاليًا يظهر في":"The fastest search growth currently appears in",
    "بنسبة":"at",
    "، بينما ينتقل نحو":"while about",
    "من الحفظ إلى «خطتي».":"move from saves to My Plan.",
    "شهدت":"In",
    "نموًا في الاهتمام بـ":", interest is growing in",
    "، بينما يظل مؤشر العرض التجريبي أقل من مؤشر الطلب. هذه إشارة لدراسة الاحتياج، وليست ضمانًا لفرصة تجارية.":", while the illustrative supply index remains below the demand index. This is a signal for needs validation, not a guaranteed commercial opportunity.",
    "تقارير":"Reports",
    "أسئلة وتوصيات نهاية الأسبوع":"Weekend questions and recommendations",
    "اقتراحات لأنشطة اجتماعية":"Suggestions for social activities",
    "بحث عن تجارب قصيرة":"Searches for short experiences",
    "الورش الإبداعية":"Creative workshops",
    "طلب خيارات حسب الحي":"Demand for neighborhood-based options",
    "المجتمع الأكثر نشاطًا حاليًا هو":"The most active community is",
    "، بينما يحقق موضوع":", while the topic",
    "أسرع زخم تجريبي.":"shows the fastest illustrative momentum.",
    "ظهور":"Impressions",
    "مشاهدة":"Views",
    "انتقال إلى العرض":"Offer handoff",
    "حققت حملة":"Campaign",
    "معدل مشاهدة تقريبيًا":"reached an approximate view rate of",
    "من الظهور، ومعدل انتقال للعرض":"from impressions, with an offer-handoff rate of",
    "من المشاهدات.":"from views.",
    "أقوى إشارة في الفلاتر الحالية تظهر في":"The strongest signal under the active filters appears in",
    "ضمن":"within",
    "البحث":"Search",
    "العصر 4–7 م":"Afternoon 4–7 PM",
    "المساء 7–10 م":"Evening 7–10 PM",
    "ملخص البحث والحفظ والتخطيط واتجاهات الطلب.":"Summary of search, saves, planning, and demand trends.",
    "إشارات الطلب مقابل العرض لدعم التحقق والدراسة.":"Demand-versus-supply signals for validation and study."
  });
  EN_PARTS.unshift(
    ["· الإضافة إلى خطتي ","· Added to My Plan "],
    ["· الحفظ ","· Saves "],
    ["· المشاهدة ","· Views "],
    ["نمو متوسط ","Average growth "],
    ["ارتفاع البحث","Higher search"],
    ["والحفظ","and saves"],
    ["مقارنة مستوى العرض بالطلب","Supply-level comparison with demand"],
    ["تفاعل ","Engagement "],
    ["نمو المجتمع ","Community growth "],
    ["نمو الموضوع ","Topic growth "],
    ["أداء «","Performance of “"],
    ["» عبر مراحل التفاعل.","” across interaction stages."],
    [" نقطة"," pts"],
    ["يتصدر",""],
    ["الإضافة إلى «خطتي» ضمن الفلاتر الحالية، مع نمو تجريبي قدره","leads additions to My Plan under the active filters, with illustrative growth of"]
  );
  function enText(s){
    let out=String(s);
    if(EN_MAP[out])return EN_MAP[out];
    EN_PARTS.forEach(p=>{out=out.split(p[0]).join(p[1])});
    Object.keys(EN_MAP).sort((a,b)=>b.length-a.length).forEach(k=>{if(out.includes(k))out=out.split(k).join(EN_MAP[k])});
    return out
  }
  function localizeDom(){
    document.documentElement.lang=state.lang;
    document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";
    document.body.dir=document.documentElement.dir;
    if(state.lang!=="en")return;
    document.querySelectorAll("option").forEach(o=>{
      const raw=o.textContent;o.value=raw;o.textContent=enText(raw)
    });
    const root=document.querySelector(".bi-shell");if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const nodes=[];
    while(n=walker.nextNode())nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement;
      if(!p||p.closest(".lang-switch")||["SCRIPT","STYLE","OPTION"].includes(p.tagName))return;
      if(/[\u0600-\u06FF]/.test(t.nodeValue))t.nodeValue=enText(t.nodeValue)
    })
  }

  function welcomeScreen(){
    return '<div class="entry-screen welcome-gate"><div class="entry-content welcome-content">'+wordmark(52,true)+'<div class="entry-descriptor">'+esc(tr("منصة EyeMakkah لتحليلات الأعمال","EyeMakkah Business Analytics Platform"))+'</div><p class="entry-tagline">'+esc(tr("تحليلات عملية لفهم الطلب والاهتمامات والإشارات المكانية في مكة.","Practical analytics for understanding demand, interests, and geographic signals across Makkah."))+'</p><button type="button" class="entry-primary entry-start" data-enter-language>'+esc(tr("ابدأ","Enter EyeMakkah"))+'</button><small class="entry-disclosure">'+esc(tr("نموذج أولي — بيانات اصطناعية لأغراض العرض","Prototype — synthetic data for demonstration"))+'</small></div></div>'
  }
  function languageScreen(){
    const ar=state.lang==="ar";
    return '<div class="entry-screen language-gate"><div class="entry-content language-content">'+wordmark(30,true)+'<div class="language-heading"><b>اختر لغتك</b><span>—</span><span class="latin">Choose your language</span></div><div class="language-options"><button type="button" class="language-option '+(ar?"current":"")+'" data-start-lang="ar" dir="rtl"><span class="language-icon">'+iconSvg("languages",20)+'</span><span><strong>العربية</strong><small>التجربة الكاملة بالعربية</small></span><span class="language-arrow">‹</span></button><button type="button" class="language-option '+(!ar?"current":"")+'" data-start-lang="en" dir="ltr"><span class="language-icon">'+iconSvg("languages",20)+'</span><span><strong>English</strong><small>The same product, read in English</small></span><span class="language-arrow">›</span></button></div><small class="entry-disclosure">يمكنك تغيير اللغة لاحقًا من حسابك · You can change this later in your account</small></div></div>'
  }
  function loginScreen(){
    const ar=state.lang==="ar";
    return '<div class="entry-screen login-gate"><section class="login-card">'+wordmark(30,false)+'<div class="login-descriptor">'+esc(tr("منصة EyeMakkah لتحليلات الأعمال","EyeMakkah Business Analytics Platform"))+'</div><h1>'+esc(tr("تسجيل الدخول","Sign in"))+'</h1><p>'+esc(tr("استخدم بيانات الدخول المخصصة لك للوصول إلى لوحة التحليلات.","Use your assigned access to enter the analytics platform."))+'</p><form id="login-form"><label>'+esc(tr("البريد الإلكتروني","Email"))+'<input id="login-email" class="login-input login-input-ltr" type="email" dir="ltr" autocomplete="username" value="demo@eyemakkah.sa" required></label><label>'+esc(tr("كلمة المرور","Password"))+'<input id="login-pass" class="login-input login-input-ltr" type="password" dir="ltr" autocomplete="current-password" value="demo1234" required></label><div class="login-row"><button type="button" class="text-btn" data-forgot>'+esc(tr("نسيت كلمة المرور؟","Forgot password?"))+'</button></div><button class="entry-primary wide" type="submit">'+esc(tr("تسجيل الدخول","Sign in"))+'</button><button class="entry-secondary wide" type="button" data-demo-login>'+esc(tr("الدخول إلى النسخة التجريبية","Enter demo"))+'</button></form><div class="gate-lang"><button data-auth-lang="ar" class="'+(ar?"active":"")+'">العربية</button><button data-auth-lang="en" class="'+(!ar?"active":"")+'">English</button></div><small class="login-disclosure">'+esc(tr("تسجيل دخول تجريبي فقط — لا يوجد نظام مصادقة فعلي في هذه النسخة.","Prototype sign-in only — no live authentication backend in this version."))+'</small></section></div>'
  }
  function enterApp(){
    session.logged=true;sessionStorage.setItem("eyemakkah-ba-session","1");flow="app";render()
  }
  function signOut(){
    session.logged=false;sessionStorage.removeItem("eyemakkah-ba-session");flow="login";render()
  }
  function transitionUpdate(fn){
    document.body.classList.add("is-updating");
    window.setTimeout(()=>{uiIssue=null;fn();render()},220)
  }
  function resetFilters(){
    state.period="آخر 30 يومًا";state.area="مكة المكرمة";state.category="الكل";state.audience="الكل";state.selectedArea="العزيزية";state.campaign="نكهات مكة"
  }
  function emptyState(message,englishMessage){
    const title=state.lang==="en"?(englishMessage||enText(message)):message;
    return '<div class="state-view empty-state" role="status"><div class="state-icon state-icon-empty">'+iconSvg("compass",24)+'</div><div class="state-title">'+esc(title)+'</div><div class="state-body">'+esc(tr("جرّب توسيع الفلاتر أو العودة إلى الإعدادات الافتراضية.","Try broadening the filters or return to the default settings."))+'</div><button type="button" class="state-action" data-reset-filters>'+iconSvg("refreshCw",16)+'<span>'+esc(tr("إعادة ضبط الفلاتر","Reset filters"))+'</span></button></div>'
  }
  function errorState(kind,titleAr,titleEn,bodyAr,bodyEn,recovery){
    const action=recovery||"page";
    return '<div class="state-view error-state" role="alert"><div class="state-icon state-icon-error">'+iconSvg("alertTriangle",24)+'</div><div class="state-title">'+esc(tr(titleAr,titleEn))+'</div><div class="state-body">'+esc(tr(bodyAr,bodyEn))+'</div><button type="button" class="state-action" data-recover="'+esc(action)+'">'+iconSvg("refreshCw",16)+'<span>'+esc(tr(action==="export"?"إعادة المحاولة":"العودة إلى لوحة المعلومات",action==="export"?"Try again":"Back to Dashboard"))+'</span></button></div>'
  }
  function loadingSkeletons(){
    const kpis='<div class="skeleton-kpis">'+Array.from({length:5},()=>'<div class="skeleton-kpi"><i class="shim sk-label"></i><i class="shim sk-value"></i><i class="shim sk-meta"></i></div>').join("")+'</div>';
    const charts='<div class="skeleton-panels"><div class="skeleton-panel"><i class="shim sk-title"></i><i class="shim sk-chart"></i></div><div class="skeleton-panel"><i class="shim sk-title"></i><i class="shim sk-chart short"></i></div></div>';
    const rows='<div class="skeleton-table"><i class="shim sk-title"></i>'+Array.from({length:5},(_,i)=>'<div class="skeleton-row"><i class="shim" style="width:'+(30+i%3*8)+'%"></i><i class="shim" style="width:'+(18+i%2*7)+'%"></i><i class="shim" style="width:'+(14+i%3*5)+'%"></i></div>').join("")+'</div>';
    const reports='<div class="skeleton-reports">'+Array.from({length:5},()=>'<div class="skeleton-report"><i class="shim" style="width:38%"></i><i class="shim" style="width:18%"></i></div>').join("")+'</div>';
    return '<div class="loading-state" aria-hidden="true">'+kpis+(state.page==="التقارير"?reports:charts+rows)+'</div>'
  }
  function page(){switch(state.page){case"لوحة المعلومات":return dashboard();case"تحليل الطلب":return demand();case"تحليل المناطق":return areas();case"الأنشطة والتجارب":return activities();case"المجتمعات والاهتمامات":return communities();case"الحملات والعروض":return campaigns();case"الفرص والفجوات":return opportunities();case"التقارير":return reports();default:return errorState("unexpected","تعذّر عرض هذه الشاشة","This screen could not be displayed","حدثت حالة غير متوقعة. بياناتك التجريبية وإعدادات الفلاتر لم تتأثر.","An unexpected UI state occurred. Your demo data and filter settings were not affected.","page");}}
  function safePage(){
    try{return page()}catch(err){console.error("EyeMakkah BI render error",err);uiIssue={scope:"page"};return errorState("page","تعذّر عرض هذه الشاشة","This screen could not be displayed","حدث خطأ غير متوقع أثناء عرض التحليلات. جرّب العودة إلى لوحة المعلومات.","An unexpected error occurred while rendering analytics. Try returning to the Dashboard.","page")}
  }
  function shell(){
    const lang='<div class="lang-switch"><button data-lang="ar" class="'+(state.lang==="ar"?"active":"")+'">العربية</button><button data-lang="en" class="'+(state.lang==="en"?"active":"")+'">English</button></div>';
    return '<div class="bi-shell"><aside class="sidebar"><div class="brand">'+wordmark(28,false)+'<div class="brand-sub">'+esc(tr("منصة EyeMakkah لتحليلات الأعمال","EyeMakkah Business Analytics Platform"))+'</div>'+lang+'</div><nav class="nav">'+
      PAGES.map(x=>'<button data-page="'+esc(x[0])+'" class="'+(state.page===x[0]?"active":"")+'"><span class="nav-icon">'+iconSvg(x[1],19)+'</span><span>'+esc(x[0])+'</span></button>').join("")+
      '</nav><div class="sidebar-meta">'+esc(tr("آخر تحديث للنموذج: 22 سبتمبر 2026","Prototype updated: 22 September 2026"))+'<br>'+esc(tr("بيانات اصطناعية لأغراض العرض","Synthetic data for demonstration"))+'<br>'+esc(tr("لا تتضمن معلومات شخصية.","No personal information is included."))+'</div></aside><main class="main"><div class="mobile-tools"><select id="mobile-page">'+opts(PAGES.map(x=>x[0]),state.page)+'</select>'+lang+userMenu()+'</div><div class="loading-strip" aria-hidden="true"><span></span><span></span><span></span></div>'+loadingSkeletons()+'<div id="page" class="page-motion">'+safePage()+'</div><div class="data-note">'+esc(tr("البيانات المعروضة في هذا النموذج توضيحية لأغراض تصميم وتجربة المنصة، ولا تمثل بيانات تشغيلية حية أو معلومات عن أفراد.","Data shown in this prototype is illustrative for product design and testing. It is not live operational data and contains no individual information."))+'</div><div class="footer-links">'+esc(tr("نموذج تحليلات الأعمال · بيانات توضيحية","Business Analytics prototype · illustrative data"))+'</div><div id="chart-tooltip" class="chart-tooltip" role="tooltip" aria-hidden="true"></div></main></div>';
  }
  function downloadCsv(){
    try{
      const e=document.getElementById("report-data");if(!e)throw new Error("report-data missing");
      const rows=JSON.parse(e.textContent),cols=["area","category","audience","interactions","active_users","searches","views","saves","plans","joins","actions","completes","contributes"];
      const headsAr=["المنطقة","الفئة","الجمهور","التفاعلات","المستخدمون النشطون","البحث","العرض","الحفظ","الإضافة إلى خطتي","الانضمام","الانتقال إلى الإجراء","الإكمال","المساهمات"];
      const heads=state.lang==="en"?headsAr.map(enText):headsAr;
      const q=v=>'"'+String(state.lang==="en"?enText(v):(v==null?"":v)).replace(/"/g,'""')+'"';
      const csv="\uFEFF"+[heads].concat(rows.map(r=>cols.map(c=>r[c]))).map(r=>r.map(q).join(",")).join("\n");
      const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");
      a.href=URL.createObjectURL(blob);a.download="EyeMakkah_Business_Analytics_demo_summary.csv";
      document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500);uiIssue=null
    }catch(err){console.error("EyeMakkah BI export error",err);uiIssue={scope:"export"};render()}
  }
  function attach(){
    const enterLanguage=document.querySelector("[data-enter-language]");if(enterLanguage)enterLanguage.onclick=()=>{flow="language";render()};
    document.querySelectorAll("[data-start-lang]").forEach(b=>b.onclick=()=>{
      const next=b.dataset.startLang,screen=document.querySelector(".language-gate");
      state.lang=next;localStorage.setItem("eyemakkah-ba-lang",state.lang);
      document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";document.body.dir=document.documentElement.dir;
      if(screen)screen.classList.add(next==="ar"?"picking-rtl":"picking-ltr");
      document.querySelectorAll("[data-start-lang]").forEach(x=>x.classList.toggle("selected",x===b));
      window.setTimeout(()=>{flow="login";render()},260)
    });
    document.querySelectorAll("[data-auth-lang]").forEach(b=>b.onclick=()=>{state.lang=b.dataset.authLang;localStorage.setItem("eyemakkah-ba-lang",state.lang);render()});
    const form=document.getElementById("login-form");if(form)form.onsubmit=e=>{e.preventDefault();enterApp()};
    const demo=document.querySelector("[data-demo-login]");if(demo)demo.onclick=enterApp;
    const forgot=document.querySelector("[data-forgot]");if(forgot)forgot.onclick=()=>{forgot.textContent=tr("سيتم تفعيل استعادة الحساب عند ربط نظام الدخول.","Account recovery will be enabled when live authentication is connected.")};

    document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>transitionUpdate(()=>{state.page=b.dataset.page;scrollTo({top:0,behavior:"smooth"})}));
    const mp=document.getElementById("mobile-page");if(mp)mp.onchange=e=>transitionUpdate(()=>{state.page=e.target.value});
    document.querySelectorAll("[data-filter]").forEach(s=>s.onchange=e=>{const key=e.target.dataset.filter,val=e.target.value;transitionUpdate(()=>{state[key]=val;if(key==="area"&&state.area!=="مكة المكرمة")state.selectedArea=state.area})});
    const ad=document.getElementById("area-detail");if(ad)ad.onchange=e=>{const v=e.target.value;transitionUpdate(()=>{state.selectedArea=v})};
    const cp=document.getElementById("campaign-select");if(cp)cp.onchange=e=>{const v=e.target.value;transitionUpdate(()=>{state.campaign=v})};
    const dl=document.getElementById("download-csv");if(dl)dl.onclick=downloadCsv;
    document.querySelectorAll("[data-lang],[data-menu-lang]").forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang||b.dataset.menuLang;localStorage.setItem("eyemakkah-ba-lang",state.lang);render()});
    document.querySelectorAll("[data-reset-filters]").forEach(b=>b.onclick=()=>transitionUpdate(resetFilters));
    document.querySelectorAll("[data-recover]").forEach(b=>b.onclick=()=>{const scope=b.dataset.recover;uiIssue=null;if(scope==="page")state.page=PAGES[0][0];render()});
    document.querySelectorAll("[data-ai-question]").forEach(b=>b.onclick=()=>{aiQuestion=b.dataset.aiQuestion;const box=document.querySelector(".ai-answer");if(box)box.classList.add("refreshing");window.setTimeout(render,180)});
    const chartTip=document.getElementById("chart-tooltip");
    if(chartTip){
      const moveTip=e=>{const gap=12,w=chartTip.offsetWidth||240,h=chartTip.offsetHeight||44;chartTip.style.left=Math.max(gap,Math.min(e.clientX+14,window.innerWidth-w-gap))+"px";chartTip.style.top=Math.max(gap,Math.min(e.clientY+14,window.innerHeight-h-gap))+"px"};
      document.querySelectorAll("[data-tip]").forEach(el=>{
        el.addEventListener("pointerenter",e=>{chartTip.textContent=el.dataset.tip||"";chartTip.classList.add("show");chartTip.setAttribute("aria-hidden","false");moveTip(e)});
        el.addEventListener("pointermove",moveTip);
        el.addEventListener("pointerleave",()=>{chartTip.classList.remove("show");chartTip.setAttribute("aria-hidden","true")});
      });
    }
    document.querySelectorAll("[data-logout]").forEach(b=>b.onclick=signOut);
    document.querySelectorAll("[data-settings]").forEach(b=>b.onclick=()=>{b.textContent=tr("الإعدادات — قريبًا","Settings — coming soon")});
  }
  function render(){
    document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";document.body.dir=document.documentElement.dir;
    const root=document.getElementById("app");
    root.innerHTML=flow==="welcome"?welcomeScreen():flow==="language"?languageScreen():flow==="login"?loginScreen():shell();
    attach();
    if(flow==="app")localizeDom();requestAnimationFrame(()=>document.body.classList.remove("is-updating"))
  }
  render();
})();