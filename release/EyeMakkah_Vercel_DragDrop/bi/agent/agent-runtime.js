(function(){
  "use strict";
  const A=window.EyeMakkahAgentAdapter;
  if(!A)return;
  const FILES=[
    "./agent/eyemakkah_platform_agent_bank_01_core.json",
    "./agent/eyemakkah_platform_agent_bank_02_analytics.json",
    "./agent/eyemakkah_platform_agent_bank_03_business.json",
    "./agent/eyemakkah_platform_agent_bank_04_context.json"
  ];
  let ready=false,failed=false,pending=false,intents=[],aliases={},suggestionBank={},history=[];
  let ctx={lastIntent:null,lastStandaloneIntent:null,lastResult:"",lastRankedResults:[],lastEntities:[],lastSourcePage:null,lastMetric:null,turnCount:0};

  const arRe=/[\u0600-\u06FF]/;
  function langOf(q){return arRe.test(q)?"ar":(/[A-Za-z]/.test(q)?"en":A.getState().lang)}
  function norm(s){return String(s||"").toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}%]+/gu," ").replace(/\s+/g," ").trim()}
  function toks(s){return norm(s).split(" ").filter(x=>x.length>1)}
  function overlap(a,b){const A1=new Set(toks(a)),B1=new Set(toks(b));if(!A1.size||!B1.size)return 0;let n=0;A1.forEach(x=>{if(B1.has(x))n++});return n/Math.max(A1.size,B1.size)}
  function h01(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
  function say(ar,en,lang){return lang==="ar"?ar:en}
  function name(v,lang){return lang==="ar"?String(v==null?"—":v):A.enText(String(v==null?"—":v))}
  function pct(v){return Math.round((Number(v)||0)*100)+"%"}
  function num(v){return A.fmt(Number(v)||0)}
  function stripHtml(s){const d=document.createElement("div");d.innerHTML=String(s||"");return d.textContent||""}

  async function init(){
    try{
      const banks=await Promise.all(FILES.map(u=>fetch(u,{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error(u+" "+r.status);return r.json()})));
      intents=banks.flatMap(b=>b.intents||[]);
      const c=banks.find(b=>b.part==="04_context")||{};
      aliases=c.aliases||{}; suggestionBank=c.contextual_suggestions||{};
      ready=intents.length===150;
      if(!ready)throw new Error("Expected 150 intents, loaded "+intents.length);
    }catch(e){console.error("EyeMakkah agent bank load error",e);failed=true}
    A.render();
  }

  function aliasEntities(q){
    const nq=norm(q),out={};
    Object.entries(aliases).forEach(([group,map])=>{
      const hits=[];
      Object.entries(map||{}).forEach(([canonical,vars])=>{
        [canonical].concat(vars||[]).forEach(v=>{const nv=norm(v);if(nv&&nq.includes(nv)&&!hits.includes(canonical))hits.push(canonical)})
      });
      if(hits.length)out[group]=hits;
    });
    return out;
  }
  function pageCategory(){
    return {"لوحة المعلومات":"dashboard","تحليل الطلب":"demand","تحليل المناطق":"areas","الأنشطة والتجارب":"activities","المجتمعات والاهتمامات":"communities","الحملات والعروض":"campaigns","الفرص والفجوات":"opportunities","التقارير":"reports"}[A.getState().page]||"";
  }
  function contextAvailable(it){
    const req=(it.context&&it.context.required_context)||[];
    return req.every(k=>{
      if(k==="last_intent")return !!ctx.lastStandaloneIntent;
      if(k==="last_result")return !!ctx.lastResult;
      if(k==="last_ranked_results")return ctx.lastRankedResults.length>1;
      if(k==="last_entities")return ctx.lastEntities.length>0;
      if(k==="active_filters"||k==="current_page")return true;
      return true
    })
  }
  function scoreIntent(it,q,lang){
    const nq=norm(q); if(!nq)return -1;
    if(it.category==="conversation_context"&&!contextAvailable(it))return -1;
    const examples=(it.examples&&it.examples[lang])||[];
    let best=0;
    for(const ex of examples){
      const ne=norm(ex);if(!ne)continue;
      if(nq===ne)best=Math.max(best,1.5);
      else if(nq.includes(ne)||ne.includes(nq))best=Math.max(best,.82);
      best=Math.max(best,overlap(nq,ne)*.78);
    }
    const kws=(it.matching&&it.matching[lang==="ar"?"keywords_ar":"keywords_en"])||[];
    let kh=0;kws.forEach(k=>{if(norm(k)&&nq.includes(norm(k)))kh++});
    best+=Math.min(.28,kh*.055);
    const pg=pageCategory();
    if(it.category===pg)best+=.13;
    const pages=(it.context&&it.context.applicable_pages)||[];
    if(pages.includes(A.getState().page))best+=.08;
    if(it.category==="conversation_context"&&toks(q).length<=7)best+=.18;
    if(it.category==="fallback")best-=.18;
    if(it.category==="out_of_scope"&&best<.7)best-=.12;
    best+=(Number(it.priority)||50)/1000;
    return best
  }
  function matchIntent(q,lang){
    const nq=norm(q),short=toks(q).length<=5;
    if(ctx.lastStandaloneIntent&&short){
      const quick=[
        ["followup_same_metric_visitors",["زوار","visitor","visitors"]],
        ["followup_same_metric_residents",["سكان","سكان مكه","resident","residents"]],
        ["followup_same_metric_period",["7 ايام","30 يوم","3 اشهر","12 شهر","اسبوع","شهر","سنه","last 7","last 30","3 months","12 months","week","month","year"]],
        ["followup_same_metric_area",["العزيزيه","الشوقيه","العوالي","النسيم","الزاهر","الشرائع","بطحاء","aziziyah","awali","shawqiyah","naseem","zahir","shara","batha"]],
        ["followup_same_metric_category",["مطاعم","مقاهي","انشطه","تجارب","تسوق","ترفيه","ثقافه","خدمات","مجتمعات","ضيافه","restaurants","cafes","activities","shopping","entertainment","culture","services","communities","hospitality"]]
      ];
      for(const [id,terms] of quick){if(terms.some(x=>nq.includes(norm(x)))){const hit=intents.find(x=>x.id===id);if(hit&&contextAvailable(hit))return {intent:hit,score:2}}}
    }
    let best=null,bs=-1;
    for(const it of intents){const s=scoreIntent(it,q,lang);if(s>bs){bs=s;best=it}}
    if(!best||bs<.43)best=intents.find(x=>x.id==="fallback_unclear");
    return {intent:best,score:bs}
  }
  function chooseFixed(it,lang,q){
    const arr=((it.answer||{}).responses||{})[lang]||[];
    if(it.id==="greeting_general"&&arr.length){
      const nq=norm(q);
      if(lang==="ar"&&nq.includes("السلام"))return arr[2]||arr[0];
      return arr[0];
    }
    return arr.length?arr[Math.floor(h01(q+"|"+it.id)*arr.length)%arr.length]:say("ما عندي إجابة جاهزة لهذا السؤال ضمن النموذج الحالي.","I don't have a prepared answer for that question in the current prototype.",lang)
  }
  function snapshot(){return A.snapshot()}
  function rankedAreas(s){return s.areaGrowth.slice().sort((a,b)=>b.growth-a.growth)}
  function opps(s){return (s.opportunities.length?s.opportunities:s.allOpportunities).slice()}
  function named(list,key,vals){if(vals&&vals.length){const hit=list.find(r=>vals.includes(r[key]));if(hit)return hit}return list[0]}
  function top(list,key){return list.slice().sort((a,b)=>(Number(b[key])||0)-(Number(a[key])||0))[0]}
  function topN(list,key,n){return list.slice().sort((a,b)=>(Number(b[key])||0)-(Number(a[key])||0)).slice(0,n||5)}
  function stageDrop(labels,vals){let max=-1,label=labels[0];for(let i=1;i<vals.length;i++){const d=(vals[i-1]||0)-(vals[i]||0);if(d>max){max=d;label=labels[i-1]+" → "+labels[i]}}return label}
  function entityLabel(r,lang){if(!r)return "—";return name(r.activity||r.community||r.campaign||r.term||(r.area&&r.category?r.area+" · "+r.category:r.area||r.category),lang)}
  function rankRows(rows,metric,lang,n){return topN(rows,metric,n).map((r,i)=>({entity:entityLabel(r,lang),value:metric==="growth"?pct(r[metric]):(metric==="score"?(Number(r[metric])||0).toFixed(0)+"/100":num(r[metric])),raw:r}))}
  function sourceFor(it){
    const m={dashboard:"لوحة المعلومات",demand:"تحليل الطلب",areas:"تحليل المناطق",activities:"الأنشطة والتجارب",communities:"المجتمعات والاهتمامات",campaigns:"الحملات والعروض",opportunities:"الفرص والفجوات",reports:"التقارير",cross_page:"لوحة المعلومات"};
    return m[it.category]||A.getState().page
  }

  function dynamic(it,q,lang,entities,opts){
    opts=opts||{};const s=snapshot(),m=s.metrics,h=it.answer.handler||"",st=s.state;
    const ar=lang==="ar";
    const areaNames=(entities.areas||[]),catNames=(entities.categories||[]),campNames=(entities.campaigns||[]),actNames=(entities.activities||[]),commNames=(entities.communities||[]);
    const area=areaNames[0]||st.selectedArea||st.area, category=catNames[0]||(st.category!=="الكل"?st.category:null);
    const areaProfile=s.areaProfiles.find(x=>x.area===area)||s.areaProfiles[0];
    const opList=opps(s),gapSort=opList.slice().sort((a,b)=>(b.demand_index-b.supply_index)-(a.demand_index-a.supply_index)),sigSort=opList.slice().sort((a,b)=>b.score-a.score),growthOpp=opList.slice().sort((a,b)=>b.growth-a.growth);
    const cats=s.categoryRank,areaRanks=rankedAreas(s),acts=s.activities,comms=s.communities,terms=s.terms,camps=s.campaigns;
    const topActPlans=top(acts,"plans"),topComm=top(comms,"engagement"),topTerm=top(terms,"index"),fastTerm=top(terms,"growth");
    const audienceSearches={resident:Math.round(m.searches*.58),visitor:Math.round(m.searches*.42)};
    const labels={searches:say("بحث","Search",lang),views:say("عرض التفاصيل","Detail views",lang),saves:say("حفظ","Saves",lang),plans:say("خطتي","My Plan",lang),actions:say("إجراء","Action",lang)};
    let text="",ranked=[],entitiesOut=[],metric=null;

    // Core actions / filters.
    if(h==="describe_current_filters") text=say("الفلاتر الحالية: ","Current filters: ",lang)+name(st.period,lang)+" · "+name(st.area,lang)+" · "+name(st.category,lang)+" · "+name(st.audience,lang);
    else if(h==="reset_filters"){A.resetFilters();text=say("تمت إعادة الفلاتر للإعدادات الافتراضية.","Filters were reset to their defaults.",lang)}
    else if(h==="set_period_from_query"||h==="set_area_from_query"||h==="set_category_from_query"||h==="set_audience_from_query"){
      const groups={set_period_from_query:["periods","period"],set_area_from_query:["areas","area"],set_category_from_query:["categories","category"],set_audience_from_query:["audiences","audience"]},g=groups[h],v=(entities[g[0]]||[])[0];
      if(v){A.applyFilters({[g[1]]:v});text=say("تم تحديث الفلتر إلى ","Filter updated to ",lang)+"<b>"+name(v,lang)+"</b>."}
      else text=say("حدد القيمة التي تريد تطبيقها على الفلتر.","Tell me which filter value you want to apply.",lang);
    }
    // Dashboard.
    else if(h==="dashboard_summary"){const sig=sigSort[0],ca=cats[0],aa=areaRanks[0];text=say("ضمن الفلاتر الحالية: ","Under the active filters: ",lang)+num(m.interactions)+" "+say("تفاعل، ","interactions, ",lang)+num(m.active_users)+" "+say("مستخدم نشط، ","active users, ",lang)+num(m.searches)+" "+say("بحث، ","searches, ",lang)+num(m.plans)+" "+say("إضافة إلى «خطتي»، و","My Plan additions, and ",lang)+num(m.actions)+" "+say(" انتقالًا للإجراء. أبرز ما يظهر: "," action handoffs. Main highlight: ",lang)+"<b>"+name(ca&&ca.category,lang)+"</b> · "+name(aa&&aa.area,lang)+" · "+(sig?name(sig.area+" · "+sig.category,lang):"—");ranked=rankRows(cats,"value",lang,5)}
    else if(h==="dashboard_top_category"){const x=cats[0];text=say("أعلى فئة ضمن السياق الحالي هي ","The leading category in the current context is ",lang)+"<b>"+name(x&&x.category,lang)+"</b>، "+say("بتفاعل تجريبي يقارب ","with illustrative engagement of about ",lang)+"<b>"+num(x&&x.value)+"</b>.";ranked=rankRows(cats,"value",lang,5);entitiesOut=x?[x.category]:[];metric="interactions"}
    else if(h==="dashboard_fastest_area"){const x=areaRanks[0];text=say("أسرع نمو في الاهتمام يظهر في ","The fastest interest growth appears in ",lang)+"<b>"+name(x&&x.area,lang)+"</b> "+say("بنحو ","at about ",lang)+"<b>"+pct(x&&x.growth)+"</b>.";ranked=rankRows(areaRanks,"growth",lang,5);entitiesOut=x?[x.area]:[];metric="growth"}
    else if(h==="dashboard_key_signal"){const x=sigSort[0];text=say("أبرز إشارة تحتاج متابعة تظهر في ","The signal that most needs attention appears in ",lang)+"<b>"+name(x?x.area+" · "+x.category:"—",lang)+"</b> "+say("بمؤشر ","with a ",lang)+"<b>"+((x&&x.score)||0).toFixed(0)+"/100</b>. "+say("هذه إشارة للتحقق وليست ضمانًا تجاريًا.","This is a validation signal, not a commercial guarantee.",lang);ranked=rankRows(sigSort,"score",lang,5);entitiesOut=x?[x.area,x.category]:[];metric="score"}
    else if(h==="dashboard_metric_snapshot") text=say("الأرقام الحالية: ","Current figures: ",lang)+num(m.interactions)+" "+say("تفاعل · ","interactions · ",lang)+num(m.active_users)+" "+say("مستخدم نشط · ","active users · ",lang)+num(m.searches)+" "+say("بحث · ","searches · ",lang)+num(m.plans)+" "+say("خطتي · ","My Plan · ",lang)+num(m.actions)+" "+say("إجراء.","actions.",lang);
    else if(h==="dashboard_demand_trend"){const tr=s.demandTrend.searches,dir=tr[tr.length-1]>=tr[0]?say("صاعد","upward",lang):say("متراجع","downward",lang);text=say("اتجاه الطلب في الفترة الحالية ","Demand in the current period is ",lang)+"<b>"+dir+"</b>، "+say("مع ","with ",lang)+num(m.searches)+" "+say("بحث و","searches, ",lang)+num(m.saves)+" "+say(" حفظ و","saves, and ",lang)+num(m.plans)+" "+say(" إضافة إلى «خطتي».","My Plan additions.",lang)}
    else if(h==="dashboard_community_highlight"){const x=topComm;text=say("المجتمع الأبرز حاليًا هو ","The leading community right now is ",lang)+"<b>"+name(x&&x.community,lang)+"</b> "+say("بتفاعل ","with ",lang)+num(x&&x.engagement)+" "+say("ونمو ","engagement and ",lang)+pct(x&&x.growth)+" "+say("نمو.","growth.",lang);ranked=rankRows(comms,"engagement",lang,5);entitiesOut=x?[x.community]:[]}
    else if(h==="dashboard_compare_previous_period") text=say("مقارنة بالفترة السابقة، المؤشرات التجريبية تظهر تغيرات بين ","Versus the previous period, illustrative KPI changes range between ",lang)+Math.round(deltaLike(3)*100)+"%–"+Math.round(deltaLike(5)*100)+"%. "+say("اقرأها كاتجاه داخل النموذج لا كبيانات تشغيلية حية.","Treat this as a prototype trend, not live operational data.",lang);

    // Demand.
    else if(h==="demand_top_search_term"){const x=topTerm;text=say("أعلى مصطلح بحث هو ","The top search term is ",lang)+"<b>"+name(x&&x.term,lang)+"</b> "+say("بمؤشر طلب ","with a demand index of ",lang)+(x?x.index:0)+"/100 "+say("ونمو ","and ",lang)+pct(x&&x.growth)+".";ranked=rankRows(terms,"index",lang,5);entitiesOut=x?[x.term]:[];metric="demand_index"}
    else if(h==="demand_fastest_search_growth"){const x=fastTerm;text=say("أسرع مصطلح بحث نموًا هو ","The fastest-growing search term is ",lang)+"<b>"+name(x&&x.term,lang)+"</b> "+say("بنمو ","at ",lang)+pct(x&&x.growth)+"، "+say("ضمن فئة ","in ",lang)+name(x&&x.category,lang)+".";ranked=rankRows(terms,"growth",lang,5);entitiesOut=x?[x.term]:[];metric="growth"}
    else if(h==="demand_search_volume")text=say("حجم البحث الحالي هو ","Current search volume is ",lang)+"<b>"+num(m.searches)+"</b>.";
    else if(h==="demand_search_to_plan")text=say("رحلة الطلب الحالية: ","Current demand journey: ",lang)+num(m.searches)+" "+labels.searches+" → "+num(m.views)+" "+labels.views+" → "+num(m.saves)+" "+labels.saves+" → "+num(m.plans)+" "+labels.plans+".";
    else if(h==="demand_save_to_plan_rate"){const r=m.saves?m.plans/m.saves:0;text=say("ينتقل تقريبًا ","About ",lang)+"<b>"+pct(r)+"</b> "+say("من الحفظ إلى «خطتي»: ","moves from saves to My Plan: ",lang)+num(m.saves)+" → "+num(m.plans)+"."}
    else if(h==="demand_plan_to_action_rate"){const r=m.plans?m.actions/m.plans:0;text=say("من «خطتي» إلى الإجراء، النسبة التقريبية ","From My Plan to action, the illustrative rate is ",lang)+"<b>"+pct(r)+"</b>: "+num(m.plans)+" → "+num(m.actions)+"."}
    else if(h==="demand_audience_compare")text=say("ضمن النموذج الحالي، البحث المنسوب لسكان مكة نحو ","In the current model, searches attributed to Makkah residents are about ",lang)+"<b>"+num(audienceSearches.resident)+"</b> "+say("مقابل ","versus ",lang)+"<b>"+num(audienceSearches.visitor)+"</b> "+say("للزوار.","for visitors.",lang);
    else if(h==="demand_residents_profile"||h==="demand_visitors_profile"){const isRes=h.includes("residents"),f=isRes?.58:.42; text=(isRes?say("لسكان مكة: ","For Makkah residents: ",lang):say("للزوار: ","For visitors: ",lang))+num(m.searches*f)+" "+say("بحث · ","searches · ",lang)+num(m.plans*(isRes?.61:.39))+" "+say("خطتي · ","My Plan · ",lang)+num(m.actions*(isRes?.57:.43))+" "+say("إجراء.","actions.",lang)}
    else if(h==="demand_funnel_summary"){const vals=[m.searches,m.views,m.saves,m.plans,m.actions],labs=[labels.searches,labels.views,labels.saves,labels.plans,labels.actions];text=say("رحلة الطلب: ","Demand journey: ",lang)+vals.map((v,i)=>num(v)+" "+labs[i]).join(" → ")+". "+say("أكبر انخفاض يظهر عند ","The largest stage drop appears at ",lang)+"<b>"+stageDrop(labs,vals)+"</b>."}

    // Areas.
    else if(h==="areas_top_demand_area"){const rows=s.areaProfiles.slice().sort((a,b)=>b.interest-a.interest),x=rows[0];text=say("أعلى منطقة طلبًا هي ","The highest-demand area is ",lang)+"<b>"+name(x&&x.area,lang)+"</b> "+say("بمؤشر ","with a ",lang)+(x?x.interest:0)+"/100.";ranked=rows.map(x=>({entity:name(x.area,lang),value:x.interest+"/100",raw:x}));entitiesOut=x?[x.area]:[]}
    else if(h==="areas_fastest_growth_area"){const x=areaRanks[0];text=say("أعلى نمو يظهر في ","The highest growth appears in ",lang)+"<b>"+name(x&&x.area,lang)+"</b> "+pct(x&&x.growth)+".";ranked=rankRows(areaRanks,"growth",lang,5);entitiesOut=x?[x.area]:[]}
    else if(h==="areas_selected_profile"){const x=areaProfile;text=say("ملف ","",lang)+"<b>"+name(x.area,lang)+"</b>: "+x.interest+"/100 "+say("اهتمام، نمو ","interest, ",lang)+pct(x.growth)+say(" نمو، الفئة الأبرز "," growth, leading category ",lang)+name(x.top_category,lang)+"، "+say("والذروة ","peak time ",lang)+name(x.peak_time,lang)+".";entitiesOut=[x.area]}
    else if(h==="areas_top_category"){const rows=opList.filter(o=>o.area===area),x=top(rows,"demand_index");text=say("الفئة الأبرز في ","The leading category in ",lang)+name(area,lang)+" "+say("هي ","is ",lang)+"<b>"+name(x&&x.category,lang)+"</b> "+say("بطلب ","with demand ",lang)+(x?x.demand_index:0)+"/100 "+say("ونمو ","and growth ",lang)+pct(x&&x.growth)+".";ranked=rankRows(rows,"demand_index",lang,5);entitiesOut=x?[area,x.category]:[area]}
    else if(h==="areas_peak_time")text=say("وقت الذروة التجريبي في ","The illustrative peak time in ",lang)+name(areaProfile.area,lang)+" "+say("هو ","is ",lang)+"<b>"+name(areaProfile.peak_time,lang)+"</b>.";
    else if(h==="areas_demand_supply_gap"){const rows=opList.filter(o=>o.area===area),x=rows.slice().sort((a,b)=>(b.demand_index-b.supply_index)-(a.demand_index-a.supply_index))[0],g=x?x.demand_index-x.supply_index:0;text=say("أكبر فجوة داخل ","The largest gap within ",lang)+name(area,lang)+" "+say("تظهر في ","appears in ",lang)+"<b>"+name(x&&x.category,lang)+"</b>: "+(x?x.demand_index:0)+"/100 "+say("طلب مقابل ","demand versus ",lang)+(x?x.supply_index:0)+"/100 "+say("عرض، بفارق ","supply, a ",lang)+g+say(" نقطة.","-point difference.",lang);ranked=rows.map(x=>({entity:name(x.category,lang),value:(x.demand_index-x.supply_index)+say(" نقطة"," points",lang),raw:x})).sort((a,b)=>(b.raw.demand_index-b.raw.supply_index)-(a.raw.demand_index-a.raw.supply_index));entitiesOut=x?[area,x.category]:[area]}
    else if(h==="areas_compare_two"){const names=areaNames.length>=2?areaNames:[areaProfile.area,(s.areaProfiles.find(x=>x.area!==areaProfile.area)||{}).area],a=s.areaProfiles.find(x=>x.area===names[0]),b=s.areaProfiles.find(x=>x.area===names[1]);text=say("مقارنة ","Comparing ",lang)+name(names[0],lang)+" / "+name(names[1],lang)+": "+say("الطلب ","demand ",lang)+(a?a.interest:0)+" مقابل "+(b?b.interest:0)+"، "+say("النمو ","growth ",lang)+pct(a&&a.growth)+" مقابل "+pct(b&&b.growth)+".";entitiesOut=names.filter(Boolean)}
    else if(h==="areas_top_signal"){const rows=opList.filter(o=>o.area===area),x=top(rows,"score");text=say("أعلى إشارة في ","The strongest signal in ",lang)+name(area,lang)+" "+say("هي ","is ",lang)+name(x&&x.category,lang)+" <b>"+((x&&x.score)||0).toFixed(0)+"/100</b>. "+say("إشارة للتحقق لا ضمانًا للجدوى.","It is for validation, not a feasibility guarantee.",lang)}
    else if(h==="areas_category_across_areas"){const c=category||((cats[0]||{}).category),rows=s.allOpportunities.filter(o=>o.category===c),x=top(rows,"demand_index");text=say("لفئة ","For ",lang)+name(c,lang)+"، "+say("أعلى منطقة هي ","the leading area is ",lang)+"<b>"+name(x&&x.area,lang)+"</b> "+say("بطلب ","with demand ",lang)+(x?x.demand_index:0)+"/100.";ranked=rankRows(rows,"demand_index",lang,5)}

    // Activities.
    else if(/^activities_/.test(h)){const metricMap={activities_top_views:"views",activities_top_saves:"saves",activities_top_plans:"plans",activities_top_joins:"joins",activities_top_actions:"actions",activities_top_completion:"complete",activities_fastest_growth:"growth"},mk=metricMap[h];
      if(mk){const x=top(acts,mk);text=say("النتيجة الأعلى هي ","The leading result is ",lang)+"<b>"+name(x&&x.activity,lang)+"</b> "+say("عند ","at ",lang)+(mk==="growth"?pct(x&&x[mk]):num(x&&x[mk]))+".";ranked=rankRows(acts,mk,lang,5);entitiesOut=x?[x.activity]:[];metric=mk}
      else if(h==="activities_detail"){const x=named(acts,"activity",actNames)||topActPlans;text="<b>"+name(x&&x.activity,lang)+"</b>: "+num(x&&x.views)+" "+say("مشاهدة · ","views · ",lang)+num(x&&x.saves)+" "+say("حفظ · ","saves · ",lang)+num(x&&x.plans)+" "+say("خطتي · ","My Plan · ",lang)+num(x&&x.joins)+" "+say("انضمام · ","joins · ",lang)+num(x&&x.actions)+" "+say("إجراء · ","actions · ",lang)+num(x&&x.complete)+" "+say("إكمال · نمو ","completions · growth ",lang)+pct(x&&x.growth);entitiesOut=x?[x.activity]:[]}
      else if(h==="activities_compare_two"){const ns=actNames.length>=2?actNames:[(top(acts,"plans")||{}).activity,(acts.find(x=>x.activity!==(top(acts,"plans")||{}).activity)||{}).activity],a=named(acts,"activity",[ns[0]]),b=named(acts,"activity",[ns[1]]);text=name(ns[0],lang)+" / "+name(ns[1],lang)+": "+num(a&&a.views)+" / "+num(b&&b.views)+" "+say("مشاهدة، ","views; ",lang)+num(a&&a.plans)+" / "+num(b&&b.plans)+" "+say("خطتي.","My Plan.",lang);entitiesOut=ns.filter(Boolean)}
      else if(h==="activities_funnel_summary"){const vals=["views","saves","plans","joins","actions","complete"].map(k=>s.activities.reduce((z,r)=>z+(r[k]||0),0)),labs=[say("عرض","Views",lang),say("حفظ","Saves",lang),say("خطتي","My Plan",lang),say("انضمام","Joins",lang),say("إجراء","Action",lang),say("إكمال","Completion",lang)];text=vals.map((v,i)=>num(v)+" "+labs[i]).join(" → ")+". "+say("أكبر انخفاض عند ","Largest drop at ",lang)+stageDrop(labs,vals)+"."}
    }

    // Communities.
    else if(/^communities_/.test(h)){
      if(h==="communities_most_active"){const x=top(comms,"engagement");text=say("المجتمع الأكثر نشاطًا هو ","The most active community is ",lang)+"<b>"+name(x&&x.community,lang)+"</b> "+num(x&&x.engagement)+" "+say("تفاعل، نمو ","engagement, growth ",lang)+pct(x&&x.growth)+".";ranked=rankRows(comms,"engagement",lang,5);entitiesOut=x?[x.community]:[]}
      else if(h==="communities_fastest_growth"){const x=top(comms,"growth");text=say("أسرع مجتمع نموًا هو ","The fastest-growing community is ",lang)+"<b>"+name(x&&x.community,lang)+"</b> "+pct(x&&x.growth)+".";ranked=rankRows(comms,"growth",lang,5);entitiesOut=x?[x.community]:[]}
      else if(h==="communities_top_topic"){const x=s.topics[0];text=say("أسرع موضوع زخمًا هو ","The fastest-rising topic is ",lang)+"<b>"+name(x&&x.topic,lang)+"</b> "+pct(x&&x.growth)+" — "+name(x&&x.theme,lang)+".";ranked=s.topics.map(x=>({entity:name(x.topic,lang),value:pct(x.growth),raw:x}));entitiesOut=x?[x.topic]:[]}
      else if(h==="communities_topics_summary")text=s.topics.map(x=>"<b>"+name(x.topic,lang)+"</b> "+pct(x.growth)).join(" · ");
      else if(h==="communities_contribution_pattern"){const rows=Object.entries(s.contribution).sort((a,b)=>b[1]-a[1]),tot=rows.reduce((z,x)=>z+x[1],0),x=rows[0];text=say("أبرز نمط مساهمة هو ","The leading contribution pattern is ",lang)+"<b>"+name(x&&x[0],lang)+"</b> "+say("بحصة ","at ",lang)+pct(x?x[1]/tot:0)+"."}
      else if(h==="communities_detail"){const x=named(comms,"community",commNames)||topComm;text="<b>"+name(x&&x.community,lang)+"</b>: "+num(x&&x.members)+" "+say("عضو · ","members · ",lang)+num(x&&x.engagement)+" "+say("تفاعل · نمو ","engagement · growth ",lang)+pct(x&&x.growth)+" · "+name(x&&x.themes,lang);entitiesOut=x?[x.community]:[]}
      else if(h==="communities_compare_two"){const ns=commNames.length>=2?commNames:[(top(comms,"engagement")||{}).community,(comms.find(x=>x.community!==(top(comms,"engagement")||{}).community)||{}).community],a=named(comms,"community",[ns[0]]),b=named(comms,"community",[ns[1]]);text=name(ns[0],lang)+" / "+name(ns[1],lang)+": "+num(a&&a.engagement)+" / "+num(b&&b.engagement)+" "+say("تفاعل، نمو ","engagement; growth ",lang)+pct(a&&a.growth)+" / "+pct(b&&b.growth)+".";entitiesOut=ns.filter(Boolean)}
      else if(h==="communities_privacy_boundary")text=say("تحليل المجتمعات مجمّع ويركز على الموضوعات والمشاركة؛ لا يعرض تعريف أفراد أو بيانات شخصية.","Community analysis is aggregated and focuses on topics and participation; it does not identify individuals or expose personal data.",lang)
    }

    // Campaigns.
    else if(/^campaign_/.test(h)){const selected=named(camps,"campaign",campNames.length?campNames:[st.campaign])||camps[0],campMetric={campaign_top_impressions:"impressions",campaign_top_views:"views",campaign_top_saves:"saves",campaign_top_handoffs:"handoffs"}[h];
      if(campMetric){const x=top(camps,campMetric);text=say("أعلى حملة هي ","The leading campaign is ",lang)+"<b>"+name(x&&x.campaign,lang)+"</b> "+say("عند ","at ",lang)+num(x&&x[campMetric])+".";ranked=rankRows(camps,campMetric,lang,5);entitiesOut=x?[x.campaign]:[]}
      else if(h==="campaign_summary"){const x=selected,vr=x&&x.impressions?x.views/x.impressions:0,hr=x&&x.views?x.handoffs/x.views:0;text="<b>"+name(x&&x.campaign,lang)+"</b>: "+num(x&&x.impressions)+" "+say("ظهور · ","impressions · ",lang)+num(x&&x.views)+" "+say("مشاهدة · ","views · ",lang)+num(x&&x.details)+" "+say("تفاصيل · ","details · ",lang)+num(x&&x.saves)+" "+say("حفظ · ","saves · ",lang)+num(x&&x.handoffs)+" "+say("انتقال. معدل المشاهدة ","handoffs. View rate ",lang)+pct(vr)+say("، ومعدل الانتقال ","; handoff rate ",lang)+pct(hr)+".";entitiesOut=x?[x.campaign]:[]}
      else if(h==="campaign_view_rate"){const x=selected,r=x&&x.impressions?x.views/x.impressions:0;text=say("معدل المشاهدة لحملة ","View rate for ",lang)+name(x&&x.campaign,lang)+" <b>"+pct(r)+"</b>: "+num(x&&x.views)+" / "+num(x&&x.impressions)+"."}
      else if(h==="campaign_handoff_rate"){const x=selected,r=x&&x.views?x.handoffs/x.views:0;text=say("معدل الانتقال للعرض في ","Offer handoff rate for ",lang)+name(x&&x.campaign,lang)+" <b>"+pct(r)+"</b>: "+num(x&&x.handoffs)+" / "+num(x&&x.views)+"."}
      else if(h==="campaign_funnel"){const x=selected,plans=Math.round((x&&x.saves||0)*.58),vals=[x&&x.impressions,x&&x.views,x&&x.details,x&&x.saves,plans,x&&x.handoffs].map(Number),labs=[say("ظهور","Impressions",lang),say("مشاهدة","Views",lang),say("تفاصيل","Details",lang),say("حفظ","Saves",lang),say("خطتي","My Plan",lang),say("انتقال","Handoffs",lang)];text=vals.map((v,i)=>num(v)+" "+labs[i]).join(" → ")+". "+say("أكبر انخفاض عند ","Largest drop at ",lang)+stageDrop(labs,vals)+"."}
      else if(h==="campaign_geographic_performance"){const arw=s.areaGrowth[0];text=say("أقوى استجابة جغرافية تقديرية للحملة تظهر في ","The strongest illustrative geographic response appears in ",lang)+"<b>"+name(arw&&arw.area,lang)+"</b> "+say("ضمن نموذج الأداء الحالي.","under the current performance model.",lang);entitiesOut=arw?[arw.area]:[]}
      else if(h==="campaign_compare_two"){const ns=campNames.length>=2?campNames:[(top(camps,"handoffs")||{}).campaign,(camps.find(x=>x.campaign!==(top(camps,"handoffs")||{}).campaign)||{}).campaign],a=named(camps,"campaign",[ns[0]]),b=named(camps,"campaign",[ns[1]]);text=name(ns[0],lang)+" / "+name(ns[1],lang)+": "+num(a&&a.views)+" / "+num(b&&b.views)+" "+say("مشاهدة، ","views; ",lang)+num(a&&a.saves)+" / "+num(b&&b.saves)+" "+say("حفظ، ","saves; ",lang)+num(a&&a.handoffs)+" / "+num(b&&b.handoffs)+" "+say("انتقال.","handoffs.",lang);entitiesOut=ns.filter(Boolean)}
    }

    // Opportunities.
    else if(/^opportunity_/.test(h)){
      if(h==="opportunity_top_signal"){const x=sigSort[0];text=say("أعلى إشارة تظهر في ","The highest signal appears in ",lang)+"<b>"+name(x?x.area+" · "+x.category:"—",lang)+"</b> "+((x&&x.score)||0).toFixed(0)+"/100. "+name(x&&x.reason,lang)+". "+say("إشارة للتحقق وليست ضمانًا تجاريًا.","A validation signal, not a commercial guarantee.",lang);ranked=rankRows(sigSort,"score",lang,5);entitiesOut=x?[x.area,x.category]:[]}
      else if(h==="opportunity_largest_gap"){const x=gapSort[0],g=x?x.demand_index-x.supply_index:0;text=say("أكبر فجوة تظهر في ","The largest gap appears in ",lang)+"<b>"+name(x?x.area+" · "+x.category:"—",lang)+"</b>: "+(x?x.demand_index:0)+"/100 "+say("طلب مقابل ","demand versus ",lang)+(x?x.supply_index:0)+"/100 "+say("عرض، بفارق ","supply, a ",lang)+g+say(" نقطة.","-point difference.",lang);ranked=gapSort.map(x=>({entity:name(x.area+" · "+x.category,lang),value:(x.demand_index-x.supply_index)+say(" نقطة"," points",lang),raw:x}));entitiesOut=x?[x.area,x.category]:[]}
      else if(h==="opportunity_average_demand_supply"){const av=k=>opList.length?opList.reduce((z,x)=>z+x[k],0)/opList.length:0,d=av("demand_index"),su=av("supply_index");text=say("متوسط الطلب ","Average demand ",lang)+d.toFixed(0)+"/100، "+say("ومتوسط العرض ","average supply ",lang)+su.toFixed(0)+"/100، "+say("بفارق ","a ",lang)+Math.round(d-su)+say(" نقطة.","-point gap.",lang)}
      else if(h==="opportunity_reason"){const x=sigSort[0];text=say("ظهرت الإشارة في ","The signal in ",lang)+name(x?x.area+" · "+x.category:"—",lang)+" "+say("لأن ","appears because ",lang)+"<b>"+name(x&&x.reason,lang)+"</b>، "+say("مع طلب ","with demand ",lang)+(x?x.demand_index:0)+"/100، "+say("نمو ","growth ",lang)+pct(x&&x.growth)+"، "+say("وعرض ","and supply ",lang)+(x?x.supply_index:0)+"/100."}
      else if(h==="opportunity_top_growth"){const x=growthOpp[0];text=say("أعلى نمو بين الإشارات يظهر في ","The highest growth among signals appears in ",lang)+"<b>"+name(x?x.area+" · "+x.category:"—",lang)+"</b> "+pct(x&&x.growth)+".";ranked=rankRows(growthOpp,"growth",lang,5)}
      else if(h==="opportunity_low_supply_high_demand"){const x=gapSort[0];text=say("أوضح حالة طلب مرتفع مع عرض أقل تظهر في ","The clearest high-demand, lower-supply case appears in ",lang)+"<b>"+name(x?x.area+" · "+x.category:"—",lang)+"</b>: "+(x?x.demand_index:0)+"/100 "+say("طلب مقابل ","demand versus ",lang)+(x?x.supply_index:0)+"/100 "+say("عرض.","supply.",lang)}
      else if(h==="opportunity_rank_top"){ranked=rankRows(sigSort,"score",lang,5);text=ranked.slice(0,5).map((x,i)=>(i+1)+". <b>"+x.entity+"</b> "+x.value).join("<br>")+"<br><span>"+say("الترتيب للتحقق التحليلي وليس للجدوى المالية.","The ranking is for analytical validation, not financial feasibility.",lang)+"</span>"}
      else if(h==="opportunity_compare_two"){const a=sigSort[0],b=sigSort[1];text=name(a?a.area+" · "+a.category:"—",lang)+" / "+name(b?b.area+" · "+b.category:"—",lang)+": "+say("الطلب ","demand ",lang)+(a?a.demand_index:0)+" / "+(b?b.demand_index:0)+"، "+say("العرض ","supply ",lang)+(a?a.supply_index:0)+" / "+(b?b.supply_index:0)+"، "+say("الإشارة ","signal ",lang)+(a?a.score.toFixed(0):0)+" / "+(b?b.score.toFixed(0):0)+".";entitiesOut=[a&&a.area,b&&b.area].filter(Boolean)}
      else if(h==="opportunity_validation_guidance")text=say("استخدم الإشارة كنقطة بداية للتحقق: راجع الطلب والنمو والعرض في نفس المنطقة والفئة، ثم اربطها ببحث متخصص قبل أي قرار. ليست ضمانًا للجدوى.","Use the signal as a starting point: review demand, growth, and supply in the same area/category, then combine it with specialist validation before any decision. It is not a feasibility guarantee.",lang)
      else if(h==="opportunity_not_financial")text=say("لا. مؤشر الإشارة لا يقيس الربح أو ROI أو الجدوى المالية؛ هو يجمع الطلب والنمو والعرض لدعم التحقق فقط.","No. The signal index does not measure profit, ROI, or financial feasibility; it combines demand, growth, and supply for validation support only.",lang)
    }

    // Reports.
    else if(/^reports_/.test(h)){
      if(h==="reports_available")text=say("التقارير المتاحة: التقرير الشهري للطلب والاهتمام، تحليل مناطق مكة، تقرير المجتمعات والاهتمامات، أداء الحملات والعروض، وتقرير الفرص والفجوات.","Available reports: Monthly Demand & Interest, Makkah Area Analysis, Communities & Interests, Campaigns & Offers Performance, and Opportunities & Gaps.",lang)
      else if(h==="reports_current_summary")text=say("ملخص التقارير: ","Reports summary: ",lang)+num(m.searches)+" "+say("بحث · ","searches · ",lang)+num(m.plans)+" "+say("خطتي · ","My Plan · ",lang)+num(m.actions)+" "+say("إجراء.","actions.",lang)
      else if(h==="reports_filter_scope"||h==="cross_page_filter_effect")text=name(st.period,lang)+" · "+name(st.area,lang)+" · "+name(st.category,lang)+" · "+name(st.audience,lang)
      else if(h==="reports_export_csv"){if(st.page==="التقارير"){A.downloadCsv();text=say("تم تشغيل تصدير CSV وفق الفلاتر الحالية.","CSV export was triggered using the active filters.",lang)}else{text=say("تصدير CSV متاح من صفحة «التقارير». انتقل إلى التقارير وسيُطبّق التصدير على الفلاتر الحالية.","CSV export is available from the Reports page. Open Reports and the export will use the current filters.",lang)}}
      else if(h==="reports_export_contents")text=say("ملف CSV يتضمن المنطقة، الفئة، الجمهور، التفاعلات، المستخدمين النشطين، البحث، العرض، الحفظ، «خطتي»، والانتقال للإجراء.","The CSV includes area, category, audience, interactions, active users, searches, views, saves, My Plan additions, and action handoffs.",lang)
      else if(h==="reports_row_breakdown"){const rows=s.reportRows.slice(0,5);text=rows.map(r=>"<b>"+name(r.area,lang)+" · "+name(r.category,lang)+"</b> — "+num(r.interactions)+" "+say("تفاعل","interactions",lang)).join("<br>")}
      else if(h==="reports_demo_disclosure")text=say("هذه تقارير نموذج أولي مبنية على بيانات اصطناعية/توضيحية، وليست تقارير تشغيلية حية أو بيانات أفراد.","These are prototype reports based on synthetic/illustrative data, not live operational reports or individual-level data.",lang)
    }

    // Cross page.
    else if(/^cross_page_/.test(h)){
      if(h==="cross_page_top_growth"){const candidates=[{entity:(areaRanks[0]||{}).area,domain:"areas",growth:(areaRanks[0]||{}).growth},{entity:(fastTerm||{}).term,domain:"demand",growth:(fastTerm||{}).growth},{entity:(top(acts,"growth")||{}).activity,domain:"activities",growth:(top(acts,"growth")||{}).growth},{entity:(top(comms,"growth")||{}).community,domain:"communities",growth:(top(comms,"growth")||{}).growth}].sort((a,b)=>(b.growth||0)-(a.growth||0));const x=candidates[0];text=say("أقوى نمو ظاهر هو ","The strongest visible growth is ",lang)+"<b>"+name(x.entity,lang)+"</b> ("+name(x.domain,lang)+") "+pct(x.growth)+"."}
      else if(h==="cross_page_top_interest"){const x=cats[0];text=say("أقوى اهتمام ظاهر حاليًا هو ","The strongest visible interest is ",lang)+"<b>"+name(x&&x.category,lang)+"</b> "+say("بتفاعل ","with engagement ",lang)+num(x&&x.value)+"."}
      else if(h==="cross_page_top_action"){const a=top(acts,"actions"),c=top(camps,"handoffs");if((a&&a.actions||0)>=(c&&c.handoffs||0))text=name(a.activity,lang)+" — "+num(a.actions)+" "+say("إجراء.","actions.",lang);else text=name(c.campaign,lang)+" — "+num(c.handoffs)+" "+say("انتقالًا للعرض.","offer handoffs.",lang)}
      else if(h==="cross_page_demand_activity"){text=say("أعلى إشارة طلب هي ","The leading demand signal is ",lang)+"<b>"+name(topTerm&&topTerm.term,lang)+"</b>، "+say("بينما أقوى سلوك تخطيط نشاطي هو ","while the strongest activity planning behavior is ",lang)+"<b>"+name(topActPlans&&topActPlans.activity,lang)+"</b>. "+say("هذه مقارنة سياقية وليست علاقة سببية.","This is a contextual comparison, not a causal claim.",lang)}
      else if(h==="cross_page_area_opportunity"){const x=areaProfile.signal;text=name(areaProfile.area,lang)+": "+say("الفئة الأبرز ","leading category ",lang)+name(areaProfile.top_category,lang)+"، "+say("وأقوى إشارة ","strongest signal ",lang)+name(x&&x.category,lang)+" "+((x&&x.score)||0).toFixed(0)+"/100."}
      else if(h==="cross_page_audience_compare")text=say("السكان والزوار يختلفون نسبيًا في البحث والتخطيط والإجراء داخل النموذج. البحث الحالي تقريبًا ","Residents and visitors differ in relative search, planning, and action behavior in the model. Current searches are about ",lang)+num(audienceSearches.resident)+" / "+num(audienceSearches.visitor)+".";
      else if(h==="cross_page_filter_effect")text=say("الإجابة الحالية محسوبة على ","The current answer uses ",lang)+name(st.period,lang)+" · "+name(st.area,lang)+" · "+name(st.category,lang)+" · "+name(st.audience,lang)+".";
      else if(h==="cross_page_decision_brief"){const p1=cats[0],p2=areaRanks[0],p3=sigSort[0];text="1) "+name(p1&&p1.category,lang)+" — "+say("أعلى اهتمام","top interest",lang)+"<br>2) "+name(p2&&p2.area,lang)+" — "+say("أسرع نمو","fastest growth",lang)+"<br>3) "+name(p3?p3.area+" · "+p3.category:"—",lang)+" — "+say("إشارة للتحقق، وليست توصية مالية.","validation signal, not a financial recommendation.",lang)}
    }

    // Context follow-ups.
    else if(/^followup_/.test(h)){
      if(h==="followup_reset_conversation_context"){ctx={lastIntent:null,lastStandaloneIntent:null,lastResult:"",lastRankedResults:[],lastEntities:[],lastSourcePage:null,lastMetric:null,turnCount:ctx.turnCount};text=say("تم بدء سياق محادثة جديد مع الإبقاء على فلاتر الـBI الحالية.","Started a fresh conversation context while keeping the current BI filters.",lang)}
      else if(h==="followup_explain_previous")text=say("النتيجة السابقة تتبع نفس الفلاتر والمقياس المستخدمين. ","The previous result follows the same active filters and metric. ",lang)+reasonFor(ctx.lastStandaloneIntent,lang);
      else if(h==="followup_second_ranked"||h==="followup_third_ranked"){const idx=h==="followup_second_ranked"?1:2,x=ctx.lastRankedResults[idx];text=x?say("النتيجة هي ","The result is ",lang)+"<b>"+x.entity+"</b> — "+x.value:say("ما عندي ترتيب كافٍ من السؤال السابق. اطلب ترتيبًا أولًا.","I don't have enough ranked results from the previous question. Ask for a ranking first.",lang)}
      else if(h==="followup_compare_top_two"){const a=ctx.lastRankedResults[0],b=ctx.lastRankedResults[1];text=a&&b?"<b>"+a.entity+"</b> "+a.value+" / <b>"+b.entity+"</b> "+b.value:say("أحتاج نتيجة مرتبة أولًا حتى أقارن الأول والثاني.","I need a ranked result first to compare the top two.",lang)}
      else if(h==="followup_expand_previous")text=(ctx.lastResult||"")+"<br><span>"+say("السياق: ","Context: ",lang)+name(st.period,lang)+" · "+name(st.area,lang)+" · "+name(st.category,lang)+" · "+name(st.audience,lang)+"</span>";
      else if(h==="followup_shorten_previous")text=(ctx.lastResult||"").split(/[.!؟]/)[0]+".";
      else if(h==="followup_expand_ranking")text=ctx.lastRankedResults.slice(0,5).map((x,i)=>(i+1)+". <b>"+x.entity+"</b> — "+x.value).join("<br>")||say("ما عندي ترتيب محفوظ من السؤال السابق.","No ranking is stored from the previous question.",lang);
      else if(["followup_repeat_previous_intent","followup_with_audience_visitors","followup_with_audience_residents","followup_with_period","followup_with_area","followup_with_category"].includes(h)){
        const patch={}; if(h==="followup_with_audience_visitors")patch.audience="الزوار";if(h==="followup_with_audience_residents")patch.audience="سكان مكة";if(h==="followup_with_period"&&(entities.periods||[])[0])patch.period=entities.periods[0];if(h==="followup_with_area"&&(entities.areas||[])[0])patch.area=entities.areas[0];if(h==="followup_with_category"&&(entities.categories||[])[0])patch.category=entities.categories[0];
        if(Object.keys(patch).length)A.applyFilters(patch);
        const prev=intents.find(x=>x.id===ctx.lastStandaloneIntent);if(prev)return dynamic(prev,ctx.lastQuery||q,lang,aliasEntities(ctx.lastQuery||q),{repeat:true});
        text=say("ما عندي سؤال تحليلي سابق أكرره.","I don't have a previous analytical question to repeat.",lang)
      }
      else if(h==="followup_explain_calculation")text=calculationFor(ctx.lastStandaloneIntent,lang);
      else if(h==="followup_interpret_previous")text=say("بشكل مبسط، هذه النتيجة تصف ترتيبًا أو حجمًا نسبيًا داخل بيانات النموذج وتحت الفلاتر الحالية؛ لا تعني سببًا مؤكدًا أو توقعًا مضمونًا.","In plain language, this result describes a relative ranking or volume inside the prototype under the active filters; it does not prove causality or guarantee an outcome.",lang);
      else if(h==="followup_resolve_previous_entity")text=ctx.lastEntities.length?say("الكيان المقصود: ","Resolved entity: ",lang)+"<b>"+ctx.lastEntities.map(x=>name(x,lang)).join(" · ")+"</b>. "+(ctx.lastResult||""):say("حدد الاسم أو المقياس بكلمة واحدة حتى أربطه بشكل صحيح.","Give me the name or metric in one phrase so I can resolve it correctly.",lang);
      else if(h==="followup_source_page")text=say("تقدر تتحقق منها في ","You can verify it on ",lang)+"<b>"+name(ctx.lastSourcePage||A.getState().page,lang)+"</b> "+say("وتحت نفس الفلاتر.","using the same filters.",lang);
      else if(h==="followup_context_suggestions"){const ss=getSuggestions(lang);text=ss.length?say("ممكن تسأل: ","You could ask: ",lang)+ss.map(x=>"«"+x+"»").join(" · "):say("اكتب أي سؤال تحليلي بطريقتك عن البيانات الحالية.","Ask any analytical question in your own words about the current data.",lang)}
      else if(h==="followup_return_summary"){const prev=intents.find(x=>x.id==="dashboard_summary");return dynamic(prev,q,lang,entities,{repeat:true})}
    }

    if(!text){
      const responses=(it.answer.responses||{})[lang]||[];
      text=responses[0]||say("فهمت السؤال، لكن هذه الصياغة تحتاج تحديدًا أكثر ضمن بيانات EyeMakkah الحالية.","I understand the question, but this phrasing needs a little more specificity within the current EyeMakkah data.",lang);
      text=text.replace(/\{\{[^}]+\}\}/g,say("القيمة الحالية","current value",lang))
    }
    return {html:text,ranked,entities:entitiesOut,intent:it.id,metric,source:sourceFor(it)}
  }

  function deltaLike(seed){return .03+((seed*7+30)%16)/100}
  function reasonFor(id,lang){
    if(!id)return say("ما عندي نتيجة سابقة كافية لتفسيرها.","I don't have enough previous context to explain.",lang);
    if(/opportunit|gap|signal/.test(id))return say("الإشارة تعتمد على توازن الطلب والنمو والعرض داخل النموذج.","The signal reflects the combination of demand, growth, and supply in the prototype.",lang);
    if(/area/.test(id))return say("الترتيب يتأثر بمؤشرات المنطقة والفئة والفلاتر الحالية.","The ranking is shaped by area/category indicators and the active filters.",lang);
    if(/activit/.test(id))return say("النتيجة تعتمد على مرحلة التفاعل المطلوبة مثل المشاهدة أو الحفظ أو «خطتي» أو الإجراء.","The result depends on the requested engagement stage such as views, saves, My Plan, or action.",lang);
    return say("النتيجة ناتجة من المقياس المطلوب بعد تطبيق الفلاتر الحالية على البيانات التجريبية.","The result comes from the requested metric after applying the active filters to the demo data.",lang)
  }
  function calculationFor(id,lang){
    if(/gap/.test(id||""))return say("الفجوة = مؤشر الطلب − مؤشر العرض.","Gap = demand index − supply index.",lang);
    if(/rate|funnel|plan_to|save_to/.test(id||""))return say("النسبة = المرحلة اللاحقة ÷ المرحلة السابقة، مع عرضها كنسبة مئوية تقريبية.","Rate = later-stage count ÷ previous-stage count, shown as an approximate percentage.",lang);
    if(/signal|opportunit/.test(id||""))return say("مؤشر الإشارة في النموذج يجمع الطلب والنمو وانخفاض العرض بأوزان ثابتة؛ لا يمثل جدوى مالية.","The prototype signal index combines demand, growth, and lower supply with fixed weights; it is not financial feasibility.",lang);
    return say("يُرتّب النموذج القيم الحالية لنفس المقياس بعد تطبيق الفترة والمنطقة والفئة والجمهور.","The prototype ranks current values for the same metric after applying period, area, category, and audience filters.",lang)
  }

  function getSuggestions(lang){
    if(!ready||!suggestionBank.by_page)return [];
    let arr=[];
    if(ctx.lastRankedResults.length>1)arr.push(say("والثاني؟","What about the second one?",lang));
    if(ctx.lastStandaloneIntent&&/opportunit|gap|signal/.test(ctx.lastStandaloneIntent))arr.push(say("ليش ظهرت هذي الإشارة؟","Why did this signal appear?",lang));
    const pg=suggestionBank.by_page[A.getState().page],base=pg&&pg[lang]||[];
    for(const x of base){if(arr.length>=2)break;if(!arr.includes(x))arr.push(x)}
    return arr.slice(0,2)
  }

  function processQuery(q,fromSuggestion){
    q=String(q||"").trim();if(!q||pending)return;
    const lang=langOf(q);history.push({role:"user",html:A.esc(q)});history=history.slice(-8);pending=true;A.render();
    window.setTimeout(()=>{
      const entities=aliasEntities(q),match=matchIntent(q,lang),it=match.intent;
      let result;
      if(!it)result={html:say("ما قدرت أحدد المقصود. اكتب السؤال بطريقتك مع اسم المقياس أو الصفحة.","I couldn't identify the intent. Ask in your own words and include the metric or page.",lang),ranked:[],entities:[]};
      else if((it.answer||{}).type==="fixed")result={html:chooseFixed(it,lang,q),ranked:[],entities:[],intent:it.id,source:sourceFor(it)};
      else result=dynamic(it,q,lang,entities);
      pending=false;ctx.turnCount++;
      history.push({role:"assistant",html:result.html||""});history=history.slice(-8);
      if(it){
        ctx.lastIntent=it.id;
        if(["dashboard","demand","areas","activities","communities","campaigns","opportunities","reports","cross_page"].includes(it.category)){ctx.lastStandaloneIntent=it.id;ctx.lastQuery=q}
        if(result.html)ctx.lastResult=result.html;
        if(result.ranked&&result.ranked.length)ctx.lastRankedResults=result.ranked;
        if(result.entities&&result.entities.length)ctx.lastEntities=result.entities;
        if(result.source)ctx.lastSourcePage=result.source;
        if(result.metric)ctx.lastMetric=result.metric;
      }
      A.render();
    },180)
  }

  function render(){
    const st=A.getState(),lang=st.lang,thread=history.length?history.map(m=>'<div class="agent-message '+m.role+'"><div class="agent-avatar">'+(m.role==="assistant"?A.iconSvg("sparkles",14):'<span>A</span>')+'</div><div class="agent-bubble">'+m.html+'</div></div>').join(""):'<div class="agent-welcome">'+say("اسألني بطريقتك. أفهم التحيات، أسئلة المنصة، التحليلات، والفلاتر، وأتابع معك بالسياق.","Ask in your own words. I can handle greetings, platform questions, analytics, filters, and contextual follow-ups.",lang)+'</div>';
    const thinking=pending?'<div class="agent-message assistant"><div class="agent-avatar">'+A.iconSvg("sparkles",14)+'</div><div class="agent-bubble"><span class="agent-typing"><i></i><i></i><i></i></span></div></div>':'';
    const suggestions=getSuggestions(lang).map(x=>'<button type="button" class="agent-suggestion" data-agent-suggestion="'+A.esc(x)+'">'+A.esc(x)+'</button>').join("");
    const status=failed?'<div class="agent-error">'+say("تعذر تحميل بنك المساعد. أعد تحميل الصفحة.","The assistant bank could not be loaded. Reload the page.",lang)+'</div>':"";
    return '<section class="ai-agent agent-free"><div class="ai-accent" aria-hidden="true"></div><div class="ai-head"><div class="ai-symbol">'+A.iconSvg("sparkles",19)+'</div><div class="ai-copy"><h2>'+say("مساعد EyeMakkah التحليلي","EyeMakkah Analytics Assistant",lang)+'</h2><p>'+say("اسأل بطريقتك عن البيانات الحالية؛ المساعد يقرأ الصفحة والفلاتر وسياق السؤال السابق.","Ask naturally about the current data; the assistant uses the page, active filters, and recent conversation context.",lang)+'</p></div></div>'+status+'<div class="agent-thread" id="agent-thread">'+thread+thinking+'</div>'+(ready&&!pending?'<div class="agent-suggestions">'+suggestions+'</div>':'')+'<form class="agent-form" id="agent-form"><textarea class="agent-input" id="agent-input" rows="1" autocomplete="off" '+(ready&&!pending?"":"disabled")+' placeholder="'+A.esc(say("اسأل EyeMakkah…","Ask EyeMakkah…",lang))+'"></textarea><button class="agent-send" type="submit" '+(ready&&!pending?"":"disabled")+' aria-label="'+A.esc(say("إرسال","Send",lang))+'">'+A.iconSvg("send",18)+'</button></form><div class="agent-foot"><span>'+say("تعتمد الإجابات على بيانات النموذج الاصطناعية والفلاتر الحالية.","Answers use the prototype's synthetic data and active filters.",lang)+'</span><span class="agent-context">'+name(st.period,lang)+' · '+name(st.area,lang)+' · '+name(st.audience,lang)+'</span></div></section>'
  }

  function attach(){
    const form=document.getElementById("agent-form"),input=document.getElementById("agent-input");
    if(form&&input){form.onsubmit=e=>{e.preventDefault();const q=input.value;input.value="";processQuery(q,false)};input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}}}
    document.querySelectorAll("[data-agent-suggestion]").forEach(b=>b.onclick=()=>processQuery(b.dataset.agentSuggestion,true));
    const t=document.getElementById("agent-thread");if(t)t.scrollTop=t.scrollHeight;
  }

  window.EyeMakkahAgentRuntime={render,attach,processQuery,getState:()=>({ready,failed,pending,intentCount:intents.length,history:history.slice(),context:Object.assign({},ctx)})};
  init();
})();