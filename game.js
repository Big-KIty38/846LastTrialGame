'use strict';
/* Последний раунд v2.1: случайные участники, случайные способности, чистый интерфейс и мобильное управление. */
const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;

const SLOT_IDS=['p0','p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15'];
const TRAITS=[
  {name:'Осторожный',style:'Говорит тихо и держится у стен.',react:[
    'Оглядывает зал: «Главное — не высовываться первым и следить за выходами».',
    'Смотрит на копилку: «Те, кто побежал в панике, остались на песке. Нужно двигаться с холодной головой».',
    'Отряхивает руки: «Запах карамели стоял ещё с утра. Кто внимателен к мелочам — тот выживает».',
    'Проверяет крепление койки: «На башне нас спас только общий ритм. Ночью лучше держаться у края зала».',
    'Мрачно молчит: «Когда заставили играть против своего же напарника, я понял — здесь нельзя верить правилам».',
    'Всматривается в темноту: «Остался последний шаг. Не поворачивайся спиной ни к кому».'
  ]},
  {name:'Дерзкий',style:'Разговаривает резко и никого не боится.',react:[
    'Усмехается: «Собрали кучу должников в зелёных костюмах. Посмотрим, кто тут чего стоит».',
    'Глядит на деньги под потолком: «Вот это куш! Пусть слабаки жмут крестик, я заберу своё».',
    'Хрустит остатками сахара: «Чуть игла не сорвалась! На раздаче надо брать всё, пока дают».',
    'Разминает плечи после каната: «Чуть в пропасть не улетели! Ночью никто к моей койке не подойдёт».',
    'Подбрасывает шарик: «В переулке побеждает тот, кто умеет давить и менять условия».',
    'Сжимает кулаки: «Двенадцать пролётов стекла позади. В финале пощады не жди».'
  ]},
  {name:'Рассудительный',style:'Считает вероятности и ищет закономерности.',react:[
    'Считает койки: «Четыреста пятьдесят шесть человек. В одиночку шансы малы — нужна надёжная тройка».',
    'Смотрит на табло: «За каждого выбывшего добавляют по сто миллионов. Система играет на нашей жадности».',
    'Изучает стены за койками: «На стенах нарисованы все этапы. Всё было перед глазами с первого дня».',
    'Поправляет воротник: «На канате решила не грубая масса, а рычаг и синхронный упор».',
    'Складывает шарики в карман: «Слепая ставка — путь к проигрышу. Надо выбирать точный расчёт».',
    'Смотрит на песчаный корт: «В последнем круге можно победить тактикой, не ввязываясь в драку».'
  ]},
  {name:'Добродушный',style:'Старается поддержать соседей и делится припасами.',react:[
    'Улыбается: «Если будем помогать друг другу, никакие охранники в масках нас не сломают».',
    'Тяжело вздыхает: «Я пытался удержать соседа на красном сигнале... Нельзя бросать людей в беде».',
    'Делится водой: «Глоток воды помог размягчить карамель. Бери, если пересохло горло».',
    'Перевязывает ладонь: «Когда вся десятка тянет в один голос, даже на краю башни не страшно».',
    'Опускает взгляд: «Мы шли в переулок как друзья... Я дойду до конца ради тех, кто не вернулся».',
    'Кивает тебе: «Спасибо, что не потерял совесть в этом месте».'
  ]},
  {name:'Хитрый',style:'Ищет тайники, лазейки и выгодный обмен.',react:[
    'Прищуривается: «Эй, 456-й! Тут побеждают не самые сильные, а те, кто вовремя находит союзников».',
    'Косится на охрану: «В туалете у вентиляции камер нет. Там можно узнать много интересного».',
    'Прячет свёрток: «За трубой в кабинке всегда можно припрятать лишний жетон или камешек».',
    'Вытирает лоб: «Вовремя мы легли назад на канате! Смекалка бьёт любую силу».',
    'Хмыкает: «В шариках главное — вовремя сменить игру, пока не проиграл весь мешочек».',
    'Смотрит на выход: «На мосту главное было не прыгать первым вслепую».'
  ]},
  {name:'Нервный',style:'Постоянно оглядывается на двери и вздрагивает от звуков.',react:[
    'Теребит рукав куртки: «Как мы вообще сюда попали?! Сначала газ в фургоне, теперь этот зал...»',
    'Дрожит, глядя на свинью с деньгами: «Датчики куклы ловят малейшую дрожь! Я еле устоял за блоком».',
    'Пьёт воду мелкими глотками: «От запаха жжёного сахара до сих пор руки трясутся».',
    'Садится у нижней койки: «Когда погасят свет, начнётся хаос. Не отходи далеко от своих».',
    'Сжимает голову руками: «В парах остался только один из двоих... В зале теперь так пусто и гулко».',
    'Тяжело дышит: «Стекло звенело прямо под ногами. Остался всего один раунд».'
  ]},
  {name:'Молчаливый',style:'Говорит коротко и только по делу.',react:[
    'Коротко кивает: «Береги силы. Лишние слова здесь не помогут».',
    'Смотрит на ворота: «Кукла не видит сквозь бетон. Это главное».',
    'Показывает целую фигуру: «Не дави на иглу. Веди плавно».',
    'Показывает на канат: «Держи ритм и вовремя бери упор».',
    'Перебирает шарики: «Бросай точно в лунку. Не надейся на угадывание».',
    'Смотрит в глаза: «Последний раунд. Действуй наверняка».'
  ]},
  {name:'Спокойный',style:'Сохраняет выдержку даже в критический момент.',react:[
    'Ровно дышит: «Паника убивает быстрее любого испытания. Осмотрись и подготовься».',
    'Глядит на кнопки О и Х: «Каждый сам выбирает, зачем он здесь — ради денег или ради жизни».',
    'Складывает коробочку: «Даже сложный зонтик поддаётся, если не спешить».',
    'Стоит у лестницы коек: «Высота пугает только тех, кто смотрит вниз, а не на канат».',
    'Катит шарик по ладони: «Дружба и честный договор иногда сильнее любого соперничества».',
    'Смотрит на последние ворота: «Ты прошёл большой путь, 456-й. Заверши его достойно».'
  ]}
];

const PERK_POOL=[
  // Способности 1 сезона
  {perk:'mina',season:'С1',role:'Разведчик вентиляции',tip:'Во время красного сигнала прячься за блоком. Через вентиляцию в туалете можно подсмотреть следующую игру.',offer:'Союз: раннее предупреждение куклы и разведка через шахту в туалете.'},
  {perk:'ivan',season:'С1',role:'Тяжеловес',tip:'В канате важнее ритм и упор (C), чем частые нажатия.',offer:'Союз: +25% к силе каждого точного рывка каната.'},
  {perk:'lev',season:'С1',role:'Тактик',tip:'В финале можно победить без драки: активируй три золотые точки на разметке.',offer:'Союз: в полтора раза быстрее захват контрольных точек в финале.'},
  {perk:'asya',season:'С1',role:'Твёрдая рука',tip:'В сахарных сотах держи иглу на линии, а водой смягчай карамель.',offer:'Союз: шире допуск иглы и меньше трещин в сахарной фигуре.'},
  {perk:'boris',season:'С1',role:'Уличный боец',tip:'На стеклянном мосту проверяй плиты камешком перед прыжком.',offer:'Союз: дополнительный камешек на мосту и усиленный удар в финале.'},
  {perk:'tim',season:'С1',role:'Знаток дворовых игр',tip:'В шариках можно договориться с верным союзником без риска проиграть всё.',offer:'Союз: готов уступить шарики по-дружески при доверии ≥ 3.'},
  {perk:'dana',season:'С1',role:'Бывший стекольщик',tip:'Закалённое стекло иначе преломляет свет на грани. Нажми Q перед прыжком.',offer:'Союз: бесплатный осмотр закалённого стекла клавишей Q на мосту.'},
  {perk:'vera',season:'С1',role:'Ловкач и обменщик',tip:'В кабинках туалета за трубами можно найти спрятанные припасы.',offer:'Союз: тайник в туалете и +1 дополнительный жетон за каждый раунд.'},
  {perk:'dok',season:'С1',role:'Бывший врач',tip:'Следи за здоровьем перед утренним сигналом и не ходи на игру раненым.',offer:'Особенность: может перевязать раны (+25 здоровья) в общежитии.'},
  {perk:'matvey',season:'С1',role:'Марафонец',tip:'Экономь дыхание на длинной дистанции и вовремя переходи на шаг.',offer:'Союз: бег и прыжки расходуют на 20% меньше выносливости.'},
  {perk:'elena',season:'С1',role:'Повар-заготовитель',tip:'Правильно распределённый паёк восстанавливает гораздо больше сил.',offer:'Союз: каждый съеденный паёк даёт дополнительно +12 здоровья и +12 сил.'},
  {perk:'arkady',season:'С1',role:'Хладнокровный',tip:'Спокойствие даёт драгоценные секунды там, где остальные суетятся.',offer:'Союз: +12 секунд дополнительного времени в испытаниях.'},

  // Способности 2–3 сезонов
  {perk:'veteran2',season:'С2–3',role:'Ветеран прошлых игр',tip:'Я уже видел эту куклу! Когда я кричу «Замрите!», стой как вкопанный — прикрою тебя корпусом.',offer:'Союз (С2–3): команда «Замрите!» — один раз за раунд спасает, если кукла засекла движение на красном свете.'},
  {perk:'specops',season:'С2–3',role:'Бывший сержант спецназа',tip:'Держи низкую стойку и бей на выходе из блока. В ближнем бою главное — дисциплина.',offer:'Союз (С2–3): снижает получаемый урон на 35% и усиливает твои удары в финале.'},
  {perk:'cross',season:'С2–3',role:'Тусовщик с кулоном-крестом',tip:'Видишь этот крест на шее? Внутри секрет, от которого страх исчезает, а ноги сами несут вперёд!',offer:'Особенность (С2–3): может дать капсулу из креста — 100% сил и ускорение на следующий раунд.'},
  {perk:'gonggi',season:'С2–3',role:'Мастер костяшек гунги',tip:'В морской пехоте я тренировал пальцы на камушках гунги. Мелкая моторика решает всё!',offer:'Союз (С2–3): на 25% быстрее проход иглы в сотах и на 40% шире попадание шарика в лунку.'},
  {perk:'shaman',season:'С2–3',role:'Морская шаманка',tip:'Духи шепчут мне, кто упадёт в бездну, а какая тропа выдержит шаг...',offer:'Особенность (С2–3): предчувствие в зале — заранее открывает первые 2 плиты стеклянного моста.'},
  {perk:'crypto',season:'С2–3',role:'Крипто-аналитик',tip:'Любая игра — это математическое ожидание. Даже один лишний шарик меняет баланс.',offer:'Союз (С2–3): +1 бонусный шарик за каждую удачную ставку/бросок и выгодный обмен жетонов.'},
  {perk:'hairpin',season:'С2–3',role:'Хозяйка со шпилькой-клинком',tip:'Поешь сначала, родной. А в волосах у меня припрятана острая шпилька на крайний случай.',offer:'Союз (С2–3): домашний припас в зале (+25 сытости) и скрытая шпилька (+30% к удару в финале).'},
  {perk:'mingle',season:'С2–3',role:'Координатор по комнатам',tip:'Когда крутится карусель, выживают те, кто мгновенно собирает нужную группу!',offer:'Союз (С2–3): расширяет твой союз до 4 человек вместо 3 и ускоряет рывок каната.'},
  {perk:'guardian',season:'С3',role:'Хранитель до конца',tip:'Мы не бросим друг друга на последнем рубеже, чего бы это ни стоило.',offer:'Союз (С3): один раз за игру спасает тебя от гибели при критическом уроне, оставляя 35 здоровья.'},
  {perk:'diver',season:'С2–3',role:'Морской пловец',tip:'Держи ровный пульс — и сможешь пройти всю дистанцию на одном дыхании.',offer:'Союз (С2–3): на 30% медленнее падают силы и сытость + лишний камешек перед мостом.'}
];
const NONE_PERK={perk:'none',season:'',role:'Обычный участник',tip:'Держись надёжных людей, собирай информацию и не трать пайки впустую.',offer:'Обычный игрок: особых навыков нет, но делится слухами и участвует в жизни зала.'};

const HAIRS=['short','bob','bun','curly','buzz','grey'];
const HAIR_COLORS=[0x221e1d,0x3b2d26,0x523b2d,0x17191c,0xc5ccd0,0x613a2b];
const SKINS=[0xe6c3aa,0xdcb89d,0xd9b59a,0xc89a78,0xe2bfa4,0xd1a788];
const SUIT_COLORS=[0x1e8476,0x238d7e,0x1a776a,0x278a7c,0x1c7e71];

let PEOPLE=[];
let CROWD_NUMS=[];
const SURVIVOR_COUNTS=[456,201,108,40,16,4,1];
const PRIZE_BILLIONS=['0.0','25.5','34.8','41.6','44.0','45.2','45.6'];
const TITLES=['Тише едешь','Сахарная фигура','Перетягивание каната','Десять шариков','Стеклянный мост','Последний круг'];

function generateRandomRoster(seedList=null){
  if(seedList&&Array.isArray(seedList)&&seedList.length>=12){
    PEOPLE.length=0;PEOPLE.push(...seedList);
    if(!CROWD_NUMS.length)generateCrowdNums(seedList.map(x=>x.num));
    return seedList;
  }
  let used=new Set(['456']);
  function pickNum(){
    let n='456';
    while(used.has(n))n=String(2+Math.floor(Math.random()*453)).padStart(3,'0');
    used.add(n);return n;
  }
  // Из всех 22 способностей (С1 + С2-3) в каждую новую игру попадают ТОЛЬКО 7 случайных, а остальные 9 NPC — обычные игроки!
  let poolCopy=[...PERK_POOL];
  for(let i=poolCopy.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[poolCopy[i],poolCopy[j]]=[poolCopy[j],poolCopy[i]];}
  let chosenPerks=poolCopy.slice(0,7);
  let perks=[...chosenPerks];
  while(perks.length<16)perks.push(NONE_PERK);
  for(let i=perks.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[perks[i],perks[j]]=[perks[j],perks[i]];}
  let out=[];
  for(let i=0;i<16;i++){
    let id=SLOT_IDS[i], num=pickNum(), tr=TRAITS[Math.floor(Math.random()*TRAITS.length)], pk=perks[i];
    out.push({
      id,
      num,
      name:`Игрок №${num}`,
      trait:tr.name,
      traitStyle:tr.style,
      perk:pk.perk,
      role:`${tr.name} · ${pk.role}`,
      tip:pk.tip,
      offer:pk.offer,
      hair:HAIRS[Math.floor(Math.random()*HAIRS.length)],
      hairColor:HAIR_COLORS[Math.floor(Math.random()*HAIR_COLORS.length)],
      glasses:Math.random()<0.28,
      skin:SKINS[Math.floor(Math.random()*SKINS.length)],
      suitColor:SUIT_COLORS[Math.floor(Math.random()*SUIT_COLORS.length)],
      scale:+(0.94+Math.random()*0.12).toFixed(2),
      reactions:tr.react
    });
  }
  PEOPLE.length=0;PEOPLE.push(...out);
  generateCrowdNums([...used]);
  return out;
}

function generateCrowdNums(exclude=[]){
  let used=new Set(['456',...exclude]);
  CROWD_NUMS.length=0;
  for(let i=0;i<18;i++){
    let n='456';
    while(used.has(n))n=String(2+Math.floor(Math.random()*453)).padStart(3,'0');
    used.add(n);CROWD_NUMS.push(n);
  }
}
generateRandomRoster();

let state=null, mode='menu', overlay=true, paused=true, roundData={}, started=false, currentNpc=null;
let world, scene, camera, renderer, clock, player={x:0,z:0,y:0,vy:0,yaw:0,pitch:0}, bounds={}, obstacles=[], interactions=[], actors=[], items=[], keys={}, inputMouse=false, currentTarget=null, loopTime=0, messageTimeout=0, gameTime=0, audioCtx=null, soundOn=true, changingLock=false;
let isMobile=window.matchMedia?.('(pointer: coarse)').matches||('ontouchstart' in window)||innerWidth<=920;
let touchMode='auto', joyVec={x:0,y:0,active:false};
const SAVE='last-trial-save-v1', PREF='last-trial-options-v1';
let difficulty='normal';
try{let p=JSON.parse(localStorage.getItem(PREF)||'{}');difficulty=p.difficulty||'normal';soundOn=p.sound!==false;touchMode=p.touchMode||'auto';}catch(e){}

function showTouchUI(){return touchMode==='on'||(touchMode==='auto'&&(isMobile||innerWidth<=920));}
function syncTouchUI(){
  let el=$('touchUI');if(!el)return;
  let vis=started&&!overlay&&mode!=='carve'&&mode!=='menu'&&mode!=='ending'&&showTouchUI();
  el.classList.toggle('hidden',!vis);
  if(!vis)return;
  let act=$('btnAct'),jmp=$('btnJump'),cr=$('btnCrouch'),sk=$('btnSkill'),ex=$('btnExtra');
  if(mode==='tug'){
    act.textContent='Рывок';jmp.textContent='ТЯНУТЬ';cr.textContent='Упор';sk.textContent='Тактика';ex.classList.add('hidden');
  }else if(mode==='marbles'&&roundData.challenge==='aim'){
    act.textContent='Правила';jmp.textContent='БРОСОК';cr.textContent='Сила+';sk.textContent='Угол';ex.classList.add('hidden');
  }else if(mode==='final'){
    act.textContent='Точка E';jmp.textContent='Прыжок';cr.textContent='Блок';sk.textContent='Зов Q';ex.textContent='УДАР';ex.classList.remove('hidden');
  }else if(mode==='glass'){
    act.textContent='NPC (E)';jmp.textContent='Прыжок';cr.textContent='Присесть';sk.textContent='Стекло Q';ex.classList.add('hidden');
  }else{
    act.textContent='E';jmp.textContent='Прыжок';cr.textContent='Присесть';sk.textContent=mode==='hub'?'Зал':'Q';ex.classList.add('hidden');
  }
  act.classList.toggle('ready',!!currentTarget||mode==='tug');
}

function freshState(){
  let roster=generateRandomRoster(null);
  return {
    version:1,round:0,day:1,hp:100,energy:100,hunger:85,food:2,water:1,probes:3,tokens:0,
    roster,
    trust:{...Object.fromEntries(SLOT_IDS.map(id=>[id,0])),tim:0},allies:[],daily:{},completed:[],secrets:[],stimRound:-1,shamanHints:{},guardianUsed:false,
    vote:'none',ventScouted:{},muralRead:false,difficulty
  };
}
function ensureState(s){
  let base=freshState();
  let roster=(s&&Array.isArray(s.roster)&&s.roster.length>=12)?s.roster:base.roster;
  generateRandomRoster(roster);
  let merged={...base,...s,roster};
  merged.trust={...base.trust,...(s.trust||{})};
  merged.ventScouted=s.ventScouted||{};
  return merged;
}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state));return true;}catch(e){toast('Браузер запретил сохранение.');return false;}}
function load(){try{const s=JSON.parse(localStorage.getItem(SAVE)||'null');if(s&&s.version===1&&s.round>=0&&s.round<=6)return ensureState(s);}catch(e){}return null;}
function beep(freq=450,dur=.09,type='sine',vol=.055){if(!soundOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur);}catch(e){}}
function toast(t){$('toast').textContent=t;$('toast').classList.add('visible');messageTimeout=loopTime+4.2;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function setObjective(title,text){$('objectiveTitle').textContent=title;$('objectiveText').textContent=text;}
function closeModal(lock=true){overlay=false;paused=false;keys={};joyVec={x:0,y:0,active:false};$('modal').classList.remove('open');$('carvePanel').classList.toggle('open',mode==='carve');syncTouchUI();if(lock&&started&&mode!=='carve'&&!showTouchUI())lockPointer();}
function openModal(title,body,buttons=[],tag=''){keys={};joyVec={x:0,y:0,active:false};roundData.down=false;changingLock=true;document.exitPointerLock?.();setTimeout(()=>changingLock=false,100);overlay=true;paused=true;$('modal').classList.add('open');$('modalTag').textContent=tag;$('modalTitle').textContent=title;$('modalBody').innerHTML=body;$('modalButtons').innerHTML='';buttons.forEach((b,i)=>{let el=document.createElement('button');el.className=b.primary?'primary':'';el.textContent=`${i<9?i+1+'. ':''}${b.text}`;el.onclick=b.fn;$('modalButtons').appendChild(el);});syncTouchUI();}
function lockPointer(){if(showTouchUI())return;try{let p=renderer.domElement.requestPointerLock?.();if(p&&p.catch)p.catch(()=>{});}catch(e){}}

function mainMenu(){
  mode='menu';started=false;$('hud').classList.add('hidden');$('carvePanel').classList.remove('open');syncTouchUI();
  const checkpoint=load();
  openModal('ПОСЛЕДНИЙ РАУНД',
    `<p class="lead">456 случайных участников. Шесть игр на выживание.</p>`,
    [
      {text:'Новая игра',primary:true,fn:()=>{
        if(checkpoint){
          openModal('Начать заново?','<p>Текущее сохранение будет заменено новой группой случайных участников.</p>',[
            {text:'Начать',primary:true,fn:()=>begin(false)},
            {text:'Назад',fn:mainMenu}
          ]);
        }else begin(false);
      }},
      ...(checkpoint?[{text:`Продолжить · день ${Math.min(6,checkpoint.day)}`,fn:()=>begin(true)}]:[]),
      {text:'Настройки',fn:settings},
      {text:'Импорт сохранения',fn:importSave}
    ],
    '3D ИГРА НА ВЫЖИВАНИЕ'
  );
}
function settings(){
  let tmLabel=touchMode==='auto'?'Авто (телефон/планшет)':touchMode==='on'?'Всегда включены':'Выключены';
  openModal('Настройки',
    `<p>Сложность: <b>${difficulty==='easy'?'Мягкая':'Обычная'}</b> · Звук: <b>${soundOn?'включён':'выключен'}</b></p>
     <p>Экранные кнопки (для телефонов): <b>${tmLabel}</b></p>`,
    [
      {text:'Сменить сложность',fn:()=>{difficulty=difficulty==='easy'?'normal':'easy';if(state)state.difficulty=difficulty;storePrefs();let cp=load();if(cp){cp.difficulty=difficulty;try{localStorage.setItem(SAVE,JSON.stringify(cp));}catch(e){}}settings();}},
      {text:'Переключить звук',fn:()=>{soundOn=!soundOn;storePrefs();settings();}},
      {text:'Экранные кнопки: Авто / Вкл / Выкл',fn:()=>{touchMode=touchMode==='auto'?'on':touchMode==='on'?'off':'auto';storePrefs();syncTouchUI();settings();}},
      {text:'Назад',primary:true,fn:()=>started?pauseMenu():mainMenu()}
    ]
  );
}
function storePrefs(){try{localStorage.setItem(PREF,JSON.stringify({difficulty,sound:soundOn,touchMode}));}catch(e){}}
function begin(cont){state=cont?load():freshState();if(!state)state=freshState();state=ensureState(state);difficulty=state.difficulty||difficulty;started=true;$('hud').classList.remove('hidden');if(state.round===6)ending();else buildDorm();}
function exportSave(){let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Последний-раунд-сохранение.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importSave(){let input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=async()=>{try{let s=JSON.parse(await input.files[0].text());if(s.version!==1||!Number.isInteger(s.round)||s.round<0||s.round>6||!s.trust||!Array.isArray(s.allies))throw Error();state=ensureState(s);save();begin(true);}catch(e){toast('Не удалось прочитать файл сохранения.');}};input.click();}
function pauseMenu(){
  if(!started)return;
  openModal('Пауза',
    `<p>День ${Math.min(6,state.day)} · ${mode==='hub'?'Общежитие':TITLES[state.round]||'Финал'}</p>`,
    [
      {text:mode==='dead'?'Повторить испытание':'Продолжить',primary:true,fn:()=>{if(mode==='dead'){state=load()||state;state.difficulty=difficulty;startRound();}else closeModal();}},
      ...(mode==='hub'?[{text:'Кто что делает в зале',fn:showDormOverview}]:[]),
      {text:'Настройки',fn:settings},
      {text:'Экспорт сохранения',fn:()=>{if(mode==='hub')save();const live=state;state=load()||state;exportSave();state=live;}},
      {text:'Загрузить контрольную точку',fn:()=>{state=load()||state;buildDorm();}},
      {text:'Главное меню',fn:mainMenu}
    ]
  );
}

/* Процедурные текстуры и материалы для высокой детализации без внешних картинок */
const TEX_CACHE={};
function makeTex(kind,repeatX=1,repeatY=1){
  let key=`${kind}_${repeatX}_${repeatY}`;
  if(TEX_CACHE[key])return TEX_CACHE[key];
  let cv=document.createElement('canvas');
  cv.width=256;cv.height=256;
  let c=cv.getContext('2d');
  if(kind==='dormFloor'){
    c.fillStyle='#bfc8c7';c.fillRect(0,0,256,256);
    for(let y=0;y<4;y++)for(let x=0;x<4;x++){
      c.fillStyle=(x+y)%2?'#cad2d0':'#b5C0bf';
      c.fillRect(x*64+2,y*64+2,60,60);
      c.strokeStyle='#8e9c9b';c.lineWidth=2;c.strokeRect(x*64+1,y*64+1,62,62);
    }
  }else if(kind==='dormWall'){
    c.fillStyle='#687e87';c.fillRect(0,0,256,256);
    c.fillStyle='#506670';c.fillRect(0,185,256,71);
    c.fillStyle='#88a2aa';c.fillRect(0,180,256,5);
    c.strokeStyle='rgba(24,42,50,.35)';c.lineWidth=3;
    for(let x=32;x<256;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,256);c.stroke();}
    for(let y=48;y<180;y+=48){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();}
  }else if(kind==='bathTile'){
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){
      c.fillStyle=(x+y)%2?'#e7ecea':'#2d545e';
      c.fillRect(x*32,y*32,32,32);
    }
    c.strokeStyle='#97aaa8';c.lineWidth=1;
    for(let i=0;i<=256;i+=32){c.beginPath();c.moveTo(i,0);c.lineTo(i,256);c.moveTo(0,i);c.lineTo(256,i);c.stroke();}
  }else if(kind==='bathWall'){
    c.fillStyle='#dce7e5';c.fillRect(0,0,256,256);
    c.strokeStyle='#a8bdbb';c.lineWidth=2;
    for(let y=0;y<=256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();}
    for(let x=0;x<=256;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,256);c.stroke();}
  }else if(kind==='skyWall'){
    let g=c.createLinearGradient(0,0,0,256);
    g.addColorStop(0,'#7fc7e6');g.addColorStop(.68,'#bfe4f2');g.addColorStop(.7,'#7eb67d');g.addColorStop(1,'#5f9660');
    c.fillStyle=g;c.fillRect(0,0,256,256);
    c.fillStyle='rgba(255,255,255,.88)';
    [[55,55,24],[80,50,28],[105,57,20],[185,82,22],[210,77,26]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,7);c.fill();});
  }else if(kind==='sand'){
    c.fillStyle='#dfCAA2';c.fillRect(0,0,256,256);
    for(let i=0;i<900;i++){
      c.fillStyle=i%2?'rgba(165,132,88,.22)':'rgba(255,243,214,.25)';
      c.fillRect((i*73)%256,(i*139)%256,3,3);
    }
  }else if(kind==='brick'){
    c.fillStyle='#8c4f3e';c.fillRect(0,0,256,256);
    c.fillStyle='#a8604b';
    for(let row=0;row<8;row++){
      let off=(row%2)*32;
      for(let col=-1;col<4;col++)c.fillRect(col*64+off+3,row*32+3,58,26);
    }
  }
  let t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(repeatX,repeatY);
  TEX_CACHE[key]=t;
  return t;
}

const mat=(c,rough=.78,metal=0,tex=null)=>new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal,...(tex?{map:tex}:{})});
function box(x,y,z,w,h,d,c,parent=world){let m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='number'||typeof c==='string'?mat(c):c);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function sphere(x,y,z,r,c,parent=world){let m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),typeof c==='number'?mat(c):c);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function cylinder(x,y,z,r,h,c,parent=world,segments=18){let m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),typeof c==='number'?mat(c):c);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function label(text,x,y,z,size=1,color='#f6efdd',bg='rgba(12,22,29,.86)'){
  let canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  let c=canvas.getContext('2d');
  c.fillStyle=bg;c.fillRect(0,0,512,128);
  c.strokeStyle='rgba(117,225,186,.45)';c.lineWidth=4;c.strokeRect(4,4,504,120);
  c.font='bold 42px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;
  c.fillText(text.slice(0,28),256,64);
  let t=new THREE.CanvasTexture(canvas),m=new THREE.Sprite(new THREE.SpriteMaterial({map:t}));
  m.position.set(x,y,z);m.scale.set(size*4.1,size,1);world.add(m);
  m.userData={canvas,ctx:c,tex:t,text};
  return m;
}
function updateLabel(sprite,newText,subText='',color='#f6efdd'){
  if(!sprite||!sprite.userData?.ctx)return;
  let key=newText+'|'+subText+'|'+color;
  if(sprite.userData.lastKey===key)return;
  sprite.userData.lastKey=key;
  let {ctx:c,tex}=sprite.userData;
  c.clearRect(0,0,512,128);
  c.fillStyle='rgba(10,22,29,.88)';c.fillRect(0,0,512,128);
  c.strokeStyle=subText?'rgba(242,117,154,.75)':'rgba(117,225,186,.5)';
  c.lineWidth=4;c.strokeRect(4,4,504,120);
  c.textAlign='center';c.textBaseline='middle';
  if(subText){
    c.font='bold 30px sans-serif';c.fillStyle='#75e1ba';c.fillText(newText.slice(0,30),256,38);
    c.font='25px sans-serif';c.fillStyle=color;c.fillText(subText.slice(0,34),256,86);
  }else{
    c.font='bold 42px sans-serif';c.fillStyle=color;c.fillText(newText.slice(0,28),256,64);
  }
  tex.needsUpdate=true;
}
function solid(x,z,w,d){obstacles.push({x,z,w,d});}

function makeChestPatch(number){
  let cv=document.createElement('canvas');cv.width=128;cv.height=64;
  let c=cv.getContext('2d');
  c.fillStyle='#f4efe2';c.fillRect(0,0,128,64);
  c.strokeStyle='#1d5a52';c.lineWidth=4;c.strokeRect(2,2,124,60);
  c.font='bold 38px monospace';c.fillStyle='#133834';c.textAlign='center';c.textBaseline='middle';
  c.fillText(String(number||'456'),64,34);
  return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)});
}

function person(x,z,color=0x1e8476,number='',guard=false,opts={}){
  let g=new THREE.Group();g.position.set(x,0,z);world.add(g);g.rotation.y=Math.PI;
  let cloth=mat(color,.72,.05), whiteTrim=mat(0xf2efe6,.6), skin=mat(guard?0x111722:(opts.skin||0xd9b59a),.65);
  // Торс и белые полосы спортивного костюма из сериала
  let bodyGroup=new THREE.Group();g.add(bodyGroup);
  box(0,1.22,0,.66,.86,.36,cloth,bodyGroup);
  if(!guard){
    box(0,1.62,-.02,.46,.10,.37,whiteTrim,bodyGroup); // воротник
    box(0,1.22,-.184,.04,.82,.02,whiteTrim,bodyGroup); // молния
    let patchMat=number?makeChestPatch(number):whiteTrim;
    let p=new THREE.Mesh(new THREE.BoxGeometry(.34,.17,.02),patchMat);
    p.position.set(.13,1.34,-.186);bodyGroup.add(p);
    box(-.335,1.24,0,.03,.82,.10,whiteTrim,bodyGroup);
    box(.335,1.24,0,.03,.82,.10,whiteTrim,bodyGroup);
  }else{
    box(0,.90,0,.69,.11,.39,0x141920,bodyGroup); // чёрный ремень охраны
    box(0,2.01,.03,.62,.64,.56,cloth,bodyGroup); // капюшон охраны
  }
  sphere(0,1.95,0,.29,skin,bodyGroup);
  if(!guard){
    sphere(-.10,1.98,-.258,.039,0x1c252b,bodyGroup);
    sphere(.10,1.98,-.258,.039,0x1c252b,bodyGroup);
    box(0,1.80,-.245,.12,.034,.055,0x9e6557,bodyGroup);
    let hairColor=opts.hairColor||(opts.hair==='grey'?0xcfd5d8:0x272321);
    box(0,2.16,.02,.52,.15,.44,hairColor,bodyGroup);
    if(opts.hair==='bob'){
      box(-.25,1.96,.02,.09,.36,.36,hairColor,bodyGroup);
      box(.25,1.96,.02,.09,.36,.36,hairColor,bodyGroup);
    }else if(opts.hair==='bun'){
      sphere(0,2.24,.22,.14,hairColor,bodyGroup);
    }else if(opts.hair==='curly'){
      sphere(-.22,2.08,.02,.13,hairColor,bodyGroup);
      sphere(.22,2.08,.02,.13,hairColor,bodyGroup);
    }if(opts.glasses||opts.hair==='glasses'){
      box(-.11,1.98,-.28,.12,.07,.02,0x11161b,bodyGroup);
      box(.11,1.98,-.28,.12,.07,.02,0x11161b,bodyGroup);
      box(0,1.98,-.28,.10,.02,.02,0xd8c383,bodyGroup);
    }
  }
  let left=box(-.21,.47,0,.24,.9,.24,cloth,bodyGroup),right=box(.21,.47,0,.24,.9,.24,cloth,bodyGroup);
  let a=box(-.46,1.25,0,.22,.84,.24,cloth,bodyGroup),b=box(.46,1.25,0,.22,.84,.24,cloth,bodyGroup);
  // Обувь (белые слипоны у игроков, чёрные ботинки у охраны)
  let shoeColor=guard?0x132029:0xebe8de;
  box(-.21,.07,-.08,.27,.14,.42,shoeColor,bodyGroup);
  box(.21,.07,-.08,.27,.14,.42,shoeColor,bodyGroup);
  // Предмет в руках (жестяной ланчбокс / бутылка для анимации еды)
  let propTray=box(0,-.30,-.18,.34,.09,.24,0xd8b467,b);
  propTray.visible=false;
  if(guard){
    let shape=new THREE.Mesh(new THREE.RingGeometry(.105,.135,number==='△'?3:number==='□'?4:28),new THREE.MeshBasicMaterial({color:0xfafaf2,side:THREE.DoubleSide}));
    shape.position.set(0,1.95,-.28);if(number==='□')shape.rotation.z=Math.PI/4;bodyGroup.add(shape);
  }else if(number){
    let s=label(`№${number}`,x,2.62,z,.25);if(opts.scale)g.scale.set(opts.scale,opts.scale,opts.scale);
    g.userData.sign=s;
  }
  g.userData={...g.userData,bodyGroup,left,right,a,b,propTray,phase:Math.random()*6,number};
  actors.push(g);
  return g;
}

function addInteract(x,z,title,fn,mesh=null){interactions.push({x,z,title,fn,mesh});}
function resetWorld(bg=0xa6cacc){
  if(world){
    world.traverse(o=>{
      if(o.geometry)o.geometry.dispose();
      if(o.material){
        const ms=Array.isArray(o.material)?o.material:[o.material];
        ms.forEach(m=>{if(m.map&&!Object.values(TEX_CACHE).includes(m.map))m.map.dispose();m.dispose();});
      }
    });
    scene.remove(world);
  }
  world=new THREE.Group();scene.add(world);scene.background=new THREE.Color(bg);scene.fog=new THREE.Fog(bg,34,125);
  obstacles=[];interactions=[];actors=[];items=[];currentTarget=null;gameTime=0;
  player={x:0,z:0,y:0,vy:0,yaw:0,pitch:0};roundData={};
  ambient.intensity=.95;sun.intensity=1.3;
  $('special').innerHTML='';$('carvePanel').classList.remove('open');$('statusChip').textContent='';
}
function ground(w,d,color=0xccc5b5,tex=null){box(0,-.13,0,w,.25,d,tex?mat(color,.8,0,tex):color);}
function room(w,d,color=0xe8d9bc,ceiling=false,floorTex=null,wallTex=null){
  ground(w,d,0xd6dbd9,floorTex);
  let wm=wallTex?mat(color,.82,0,wallTex):color;
  box(-w/2,3.6,0,.4,7.2,d,wm);
  box(w/2,3.6,0,.4,7.2,d,wm);
  box(0,3.6,-d/2,w,7.2,.4,wm);
  box(0,3.6,d/2,w,7.2,.4,wm);
  if(ceiling)box(0,7.2,0,w,.25,d,0x5f737a);
  bounds={minX:-w/2+.8,maxX:w/2-.8,minZ:-d/2+.8,maxZ:d/2-.8};
}
function arch(z,color=0xe95d86){box(-3,2.4,z,1,4.8,1,color);box(3,2.4,z,1,4.8,1,color);box(0,4.7,z,7,.7,1,color);}

/* Настенные пиктограммы 6 испытаний (как на стенах общежития в сериале) */
function makeMuralMat(){
  let cv=document.createElement('canvas');cv.width=1024;cv.height=256;
  let c=cv.getContext('2d');
  c.fillStyle='#6c828a';c.fillRect(0,0,1024,256);
  c.strokeStyle='#1d2e35';c.lineWidth=5;c.fillStyle='#1d2e35';
  c.font='bold 20px sans-serif';
  // 1. Кукла и бегущие фигурки
  c.strokeRect(30,30,130,180);c.fillText('I. КУКЛА',45,235);
  c.beginPath();c.arc(95,75,18,0,7);c.stroke();c.fillRect(82,95,26,45);
  // 2. Четыре сахарные фигуры
  c.strokeRect(195,30,140,180);c.fillText('II. ДАЛЬГОНА',205,235);
  c.beginPath();c.arc(235,80,18,0,7);c.stroke();
  c.beginPath();c.moveTo(295,62);c.lineTo(275,98);c.lineTo(315,98);c.closePath();c.stroke();
  c.strokeRect(220,130,32,32);
  c.beginPath();c.arc(295,145,20,Math.PI,0);c.stroke();
  // 3. Перетягивание каната на башнях
  c.strokeRect(370,30,140,180);c.fillText('III. КАНАТ',395,235);
  c.fillRect(385,120,35,80);c.fillRect(460,120,35,80);
  c.beginPath();c.moveTo(390,110);c.lineTo(490,110);c.stroke();
  // 4. Шарики
  c.strokeRect(545,30,130,180);c.fillText('IV. ШАРИКИ',560,235);
  for(let i=0;i<5;i++){c.beginPath();c.arc(580+i*16,120+(i%2)*22,8,0,7);c.stroke();}
  // 5. Стеклянный мост
  c.strokeRect(710,30,130,180);c.fillText('V. МОСТ',740,235);
  for(let i=0;i<5;i++){c.strokeRect(745,45+i*30,22,20);c.strokeRect(780,45+i*30,22,20);}
  // 6. Кальмар (круг, треугольник, квадрат)
  c.strokeRect(870,30,125,180);c.fillText('VI. ФИНАЛ',890,235);
  c.beginPath();c.arc(932,68,16,0,7);c.stroke();
  c.beginPath();c.moveTo(932,88);c.lineTo(908,130);c.lineTo(956,130);c.closePath();c.stroke();
  c.strokeRect(910,134,44,44);
  return new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.85});
}

/* Цифровое табло выживших и призового фонда над главным выходом */
function makeLedBoard(roundIdx){
  let cv=document.createElement('canvas');cv.width=1024;cv.height=256;
  let c=cv.getContext('2d');
  c.fillStyle='#0b1318';c.fillRect(0,0,1024,256);
  c.strokeStyle='#d4af37';c.lineWidth=8;c.strokeRect(8,8,1008,240);
  c.fillStyle='#75e1ba';c.font='bold 30px monospace';
  c.fillText('УЧАСТНИКОВ В ИГРЕ',70,65);
  c.fillText('НАКОПЛЕННЫЙ ПРИЗ (ВОН)',520,65);
  c.fillStyle='#ff5c8a';c.font='bold 96px monospace';
  let surv=String(SURVIVOR_COUNTS[clamp(roundIdx,0,6)]).padStart(3,'0');
  c.fillText(surv,95,185);
  c.fillStyle='#ffd86b';c.font='bold 78px monospace';
  c.fillText(`${PRIZE_BILLIONS[clamp(roundIdx,0,6)]} МЛРД ₩`,510,182);
  return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)});
}

/* Гигантская прозрачная копилка-свинья с пачками денег под потолком зала */
function buildPiggyBank(roundIdx){
  let g=new THREE.Group();g.position.set(0,5.35,-1);world.add(g);
  let glassMat=new THREE.MeshStandardMaterial({color:0xffe696,transparent:true,opacity:.36,roughness:.12,metalness:.25});
  let goldMat=mat(0xe7b94c,.3,.65);
  let body=new THREE.Mesh(new THREE.SphereGeometry(1.85,20,16),glassMat);
  body.scale.set(1.05,.88,1.35);g.add(body);
  // Пятачок, уши и крепления
  let snout=cylinder(0,-.15,-2.48,.42,.26,goldMat,g,16);snout.rotation.x=Math.PI/2;
  box(-.38,1.15,-1.55,.28,.45,.18,goldMat,g);
  box(.38,1.15,-1.55,.28,.45,.18,goldMat,g);
  for(let dx of [-.8,.8])for(let dz of [-.9,.9]){
    cylinder(dx,1.1,dz,.04,1.8,0x8fa3ad,g,8);
    cylinder(dx,-1.15,dz,.18,.35,goldMat,g,10);
  }
  // Пачки денег внутри копилки (растут с каждым пройденным раундом!)
  let stacks=4+roundIdx*14;
  for(let i=0;i<stacks;i++){
    let ang=i*2.1, rad=(i%5)*.26, h=-.95+Math.floor(i/7)*.14;
    box(Math.cos(ang)*rad,h,Math.sin(ang)*rad*1.2,.38,.11,.22,i%3?0x85bb65:0xe5c158,g);
  }
  let glow=new THREE.PointLight(0xffcf68,28+roundIdx*6,18,2);
  glow.position.set(0,-.2,0);g.add(glow);
  return g;
}

/* Диалоги между NPC в реальном времени по мотивам сериала (зависят от текущего раунда) */
const PAIR_CHATS=[
  [
    ['«Тут 456 человек, и у каждого долги на сотни миллионов».','«Главное — не паниковать раньше времени и смотреть по сторонам».'],
    ['«Держись подальше от моей койки, если не хочешь проблем!»','«Остынь. Побереги силы для того, что за этими воротами».'],
    ['«Нам нужно держаться группой, в одиночку здесь не выжить».','«Согласен. Посмотрим, кому тут можно доверять».'],
    ['«Кто здесь самый опытный? Надо собирать команду!»','«Здесь нужна не только сила, но и холодная голова».']
  ],
  [
    ['«Вы видели эту куклу?! Датчики ловят малейшее движение!»','«Если встать за бетонным блоком — луч тебя не достанет».'],
    ['«За каждого выбывшего в копилку падает сто миллионов вон».','«Мы должны проголосовать на кнопках в центре зала!»'],
    ['«Уйти сейчас?! Снаружи нас ждут долги, а тут — миллиарды!»','«Пусть спорят. Ночью лучше следить за охраной».'],
    ['«Половина зала опустела за пять минут...»','«Зато теперь мы знаем, что правила здесь смертельно серьёзные».']
  ],
  [
    ['«Через вентиляцию в туалете было слышно, как утром плавили сахар».','«Кто догадался смочить карамель водой — тот и прошёл».'],
    ['«Кто пытался взять вторую порцию на раздаче?! Еды впритык!»','«Охрана специально даёт мало пайков, чтобы проверить нас».'],
    ['«Если вести иглу плавно и делать паузы — трещин не будет».','«Спасибо за совет. В следующем раунде держимся рядом».'],
    ['«Посмотрите на стены за койками! Там нарисованы все игры!»','«Точно... Следующий рисунок похож на башни с канатом».']
  ],
  [
    ['«На канате мы вовремя взяли упор лёжа и сбили чужой рывок!»','«Общий рывок на краю платформы вытащил всю команду».'],
    ['«Ночью в зале гасят свет. Охрана оставляет ящики с припасами».','«Нужно двигаться тихо и прятаться за каркасами коек».'],
    ['«В туалете у раковин хотя бы можно спокойно перевести дух».','«И заодно проверить вентиляционную решётку в углу».']
  ],
  [
    ['«Нам велели разбиться на пары... а потом заставили играть друг против друга».','«До сих пор не могу смотреть на эти стеклянные шарики...»'],
    ['«Мой напарник уступил мне шарики в последнюю минуту...»','«Значит, ты обязан дойти до самого выхода».'],
    ['«В зале осталось совсем мало людей. Впереди стеклянный мост».','«Придётся проверять каждую плитку камешком перед прыжком».']
  ],
  [
    ['«На мосту закалённое стекло едва заметно отличалось по бликам...»','«Хорошо, что мы не прыгали наугад».'],
    ['«Впереди последний круг на песке. Победит либо сила, либо расчёт».','«Даже на финальной линии помни, кем ты сюда пришёл».']
  ]
];
const EAT_LINES=[
  'Ест паёк: «Холодный рис, яйцо и вода... Но силы восстанавливает».',
  'Пьёт воду у стойки: «Надо оставить один паёк про запас на утро».',
  'Держит жестяной ланчбокс: «Охрана специально выдаёт еду строго по счёту».',
  'Делит порцию: «Кто не поест вечером — утром не выдержит темп игры».'
];
const TOILET_LINES=[
  'Умывается у зеркала: «Холодная вода помогает унять дрожь в руках...»',
  'Проверяет вентиляцию в туалете: «Отсюда слышно, как охрана готовит следующий зал».',
  'Шепчется у кабинок: «В туалете нет камер у самой вентиляционной решётки».',
  'Смотрит в зеркало: «Неужели это всё происходит с нами наяву?..»'
];
const SLEEP_LINES=[
  'Спит на койке: «Тихо... перед утренним сигналом нужно набраться сил».',
  'Ворочается во сне: «Свет... зелёный свет... не двигайся...»',
  'Дремлет вполглаза, охраняя свои припасы от чужих рук.'
];
const PIGGY_LINES=[
  'Смотрит на золотую копилку: «Внутри уже миллиарды вон...»',
  'Спорит у кнопок О и Х: «Если уйдём сейчас — долги никуда не денутся!»',
  'Считает пачки денег под потолком: «Каждый звук сирены добавляет сто миллионов».'
];

function buildDorm(){
  state=ensureState(state);
  state.day=state.round===0?1:Math.min(6,state.round);
  mode='hub';
  resetWorld(0x13242f);
  // Главный зал общежития (30x40) + проход в крыло туалета справа (x: 15..27, z: -8..8)
  ground(30,40,0xcfd7d6,makeTex('dormFloor',8,11));
  let wallMat=mat(0x647b84,.82,0,makeTex('dormWall',6,2));
  // Западная, Северная, Южная стены
  box(-15,3.8,0,.4,7.6,40,wallMat);
  box(0,3.8,-20,30,7.6,.4,wallMat);
  box(0,3.8,20,30,7.6,.4,wallMat);
  // Восточная стена с открытым проёмом в ТУАЛЕТ (z от -2.6 до 2.6 свободно!)
  box(15,3.8,-11.3,.4,7.6,17.4,wallMat);
  box(15,3.8,11.3,.4,7.6,17.4,wallMat);
  box(15,6.1,0,.4,3.0,5.2,wallMat);
  solid(15,-11.3,.9,17.4);
  solid(15,11.3,.9,17.4);
  // Потолок главного зала и светильники
  box(0,7.6,0,30,.25,40,0x4c6069);
  for(let z of [-13,0,13]){
    box(0,7.38,z,6,.08,1.1,new THREE.MeshStandardMaterial({color:0xd8f1e1,emissive:0xd0ffe7,emissiveIntensity:1.5}));
    let l=new THREE.PointLight(0xd8ffee,38,24,2);l.position.set(0,6.6,z);world.add(l);
  }

  // КРЫЛО ТУАЛЕТА (справа от зала: x 15..27, z -8..8)
  let bathFloor=box(21,-.12,0,12,.25,16,mat(0xdce5e4,.6,0,makeTex('bathTile',4,5)));
  let bathWallMat=mat(0xdce7e5,.55,0,makeTex('bathWall',4,2));
  box(21,3.4,-8,12,6.8,.4,bathWallMat);
  box(21,3.4,8,12,6.8,.4,bathWallMat);
  box(27,3.4,0,.4,6.8,16,bathWallMat);
  box(21,6.8,0,12,.25,16,0x7d9296);
  solid(21,-8,12,1);solid(21,8,12,1);solid(27,0,1,16);
  // Ограничители чтобы не выйти за пределы коридора туалета по Z при X>14.6
  solid(18,-14,6,11);solid(18,14,6,11);
  let bathLight=new THREE.PointLight(0xc8f6ff,26,16,2);bathLight.position.set(21,5.6,0);world.add(bathLight);
  label('ТУАЛЕТ / УМЫВАЛЬНИК',14.7,3.9,0,.62,'#8ef0cb');

  // Раковины и большое зеркало в туалете (северная стена туалета z = -7.3)
  box(20.5,2.3,-7.72,7.2,1.6,.08,new THREE.MeshStandardMaterial({color:0xaad7e6,metalness:.85,roughness:.12})); // зеркало
  for(let i=0;i<4;i++){
    let sx=17.8+i*1.8;
    box(sx,.95,-7.25,1.1,.18,.85,0xf2f6f5);
    cylinder(sx,.48,-7.25,.12,.9,0x8ea2a6);
    box(sx,1.18,-7.58,.08,.22,.18,0xc0d2d6);
  }
  solid(20.5,-7.3,7.6,1.2);
  addInteract(20.5,-5.8,'E · умыться у раковины (+бодрость и фокус)',useRestroomSink);

  // Кабинки туалета (восточная стена туалета x = 25.4, z = -4.5..4.5)
  for(let i=0;i<3;i++){
    let cz=-3.6+i*3.6;
    box(25.3,1.4,cz-1.6,2.6,2.8,.12,0x5f7b82);
    box(25.3,1.4,cz+1.6,2.6,2.8,.12,0x5f7b82);
    box(24.0,1.35,cz,.12,2.5,1.35,i===1?0x7b9ca3:0x4b6870); // двери кабинок
    box(26.1,.55,cz,.65,.55,.55,0xf2f6f5); // унитаз
  }
  solid(25.6,0,2.4,10.5);
  addInteract(23.5,0,'E · осмотреть кабинки туалета',useRestroomStall);

  // Вентиляционная шахта в туалете (как в сериале, где 067 разведывала следующую игру!)
  box(23.8,3.6,7.68,1.8,1.1,.15,0x374950);
  for(let i=0;i<4;i++)box(23.8,3.25+i*.22,7.60,1.6,.05,.18,0x8ca0a6);
  box(23.8,.75,7.2,1.3,1.5,.8,0x687d84); // ступенька/короб под шахтой
  label('ВЕНТИЛЯЦИЯ',23.8,2.6,7.1,.45,'#f6daa3');
  addInteract(23.8,5.8,'E · вентиляционная шахта (разведка следующей игры)',useRestroomVent);

  // Настенные рисунки 6 испытаний за койками (пасхалка из сериала!)
  let muralMat=makeMuralMat();
  let m1=new THREE.Mesh(new THREE.BoxGeometry(.12,2.5,13),muralMat);
  m1.position.set(-14.72,2.35,0);world.add(m1);
  addInteract(-13.4,0,'E · изучить рисунки 6 испытаний на стене',inspectMural);

  // Многоярусные пирамиды коек (с каждым раундом часть коек убирают, открывая стены!)
  let bunkCols=state.round>=3?3:5;
  let bunkSpots=[];
  for(let side of [-1,1])for(let i=0;i<5;i++){
    if(side===1&&i===2)continue; // оставляем проход в туалет свободным!
    if(i>=bunkCols&&i!==4)continue;
    let x=side*11.3,z=-13+i*6.2;
    let tiers=i%2===0?3:2;
    for(let t=0;t<tiers;t++){
      let h=t*1.65;
      box(x,h+.48,z,3.1,.22,4.1,0x203f4b);
      box(x,h+.68,z,2.8,.16,3.7,0xb7ccc4);
      box(x,h+.82,z-1.25,2.3,.14,.75,0xf1e8c5);
      box(x,h+.78,z+.5,2.6,.08,2.1,0x2b7a6e); // одеяло
    }
    for(let dx of [-1.45,1.45])for(let dz of [-1.95,1.95])box(x+dx,tiers*.85+.4,z+dz,.11,tiers*1.7,.11,0x273d49);
    // Лесенка на ярусы
    for(let s=0;s<tiers*3;s++)box(x-side*1.55,.35+s*.52,z-1.2,.08,.06,.75,0xc8b568);
    solid(x,z,3.4,4.4);
    bunkSpots.push({x:x-side*2.1,z,bedX:x,bedZ:z,side});
  }

  // Гигантская золотая копилка под потолком и подиум голосования О / Х под ней
  let piggy=buildPiggyBank(state.round);
  cylinder(0,.45,-1.5,.95,.9,0x233842);
  box(-.35,.96,-1.5,.38,.12,.38,new THREE.MeshStandardMaterial({color:0x2b9dff,emissive:0x1b66c9,emissiveIntensity:.9})); // кнопка O
  box(.35,.96,-1.5,.38,.12,.38,new THREE.MeshStandardMaterial({color:0xff4365,emissive:0xb81d3d,emissiveIntensity:.9}));  // кнопка X
  solid(0,-1.5,1.8,1.8);
  label(`КОПИЛКА · ${PRIZE_BILLIONS[state.round]} МЛРД ₩`,0,2.5,-1.5,.68,'#ffd86b');
  addInteract(0,.2,'E · копилка, статистика выживших и голосование (О / Х)',inspectPiggyVote);

  // Цифровое табло и розовые ворота с видом на пастельную лестницу Эшера
  let led=new THREE.Mesh(new THREE.BoxGeometry(8.5,2.1,.18),makeLedBoard(state.round));
  led.position.set(0,5.3,-19.65);world.add(led);
  box(0,2.4,-19.7,5.4,4.8,.28,0xe55b84);
  // Пастельные балки лестницы над выходом
  box(-5.5,4.6,-19.4,3.2,.45,.6,0x75e1ba);
  box(5.5,5.2,-19.4,3.2,.45,.6,0xf7d969);
  label('ВОРОТА НА ИСПЫТАНИЯ',0,3.8,-19.2,.68);

  // Стойка выдачи пайка в глубине зала
  box(0,1,-12,7.4,2,3,0x284c57);box(0,2.1,-12,7.7,.2,3.2,0xe8cf8f);solid(0,-12,7.8,3.5);
  for(let i=0;i<7;i++){
    box(-2.4+i*.8,2.28,-12,.45,.16,.32,0xc9a85c); // жестяные ланчбоксы
    cylinder(-2.2+i*.8,2.32,-11.35,.10,.34,0x7fc8e8); // бутылки воды
  }
  label('ВЫДАЧА ПАЙКА И ВОДЫ',0,3.5,-12,.92);
  addInteract(0,-9.2,'E · получить паёк и воду на перерыв',getRation);

  // Стойка обмена и твоя койка
  box(-5,1,15,3.2,2,1.6,0x9ba69c);label('ОБМЕН ПРИПАСОВ',-5,2.8,15,.6);solid(-5,15,3.4,1.8);
  addInteract(-5,12.6,'E · обмен припасами',shop);
  box(7,.5,14,3.1,1,4.1,0x296b69);box(7,1.12,14,2.8,.2,3.8,0xe1dbbf);solid(7,14,3.4,4.4);
  label('ТВОЯ КОЙКА (№456)',7,2.4,14,.62);
  addInteract(7,11.4,'E · сон и переход к следующему утру',bedMenu);

  // Охрана в общежитии (4 солдата в масках ○, △, □)
  person(-3.2,-18,0xe33c70,'○',true);
  person(3.2,-18,0xe33c70,'△',true);
  person(0,-13.9,0xe33c70,'○',true);
  person(-8.5,-18,0xe33c70,'□',true);

  // Размещаем 12 ключевых интерактивных NPC + массовку выживших участников!
  player.z=14;player.x=0;
  bounds={minX:-14.1,maxX:26.1,minZ:-19.1,maxZ:19.1};
  roundData={dayClock:160,night:false,stealth:false,piggy,bunkSpots,hubNpcs:[],chatFeed:[]};
  initHubLife();

  setObjective(
    state.round===0?'ДЕНЬ 1 · ПЕРЕД ПЕРВОЙ ИГРОЙ':`ДЕНЬ ${state.day} · ВЕЧЕР ПОСЛЕ ИГРЫ`,
    state.round===0
      ?`В зале 456 игроков. Получи еду, осмотри туалет и копилку, пообщайся с NPC (G — сводка зала). Койка запускает «${TITLES[0]}».`
      :`«${TITLES[state.round-1]}» позади. NPC едят, спорят, спят и ходят в туалет. Поужинай и поговори с ними: утром дня ${state.round+1} — «${TITLES[state.round]}».`
  );

  if(!state.daily['hubIntroSession'+state.round]){
    state.daily['hubIntroSession'+state.round]=true;save();
    openModal(
      state.round===0?'День 1 · Общежитие':`Вечер дня ${state.day} · Осталось ${SURVIVOR_COUNTS[state.round]} игроков`,
      `<p>${state.round===0
        ?'Ты — игрок №456 среди сотен незнакомцев. У каждого свой характер, а у некоторых есть полезные в играх навыки из прошлой жизни.'
        :`«${TITLES[state.round-1]}» позади. В копилку упали новые деньги, а выжившие едят, спорят, уходят в туалет и готовятся ко сну.`}</p>`,
      [{text:'В зал',primary:true,fn:()=>closeModal()}],
      'ОБЩЕЖИТИЕ'
    );
  }else{
    save();closeModal();
  }
}

/* Система автономной жизни NPC: общение друг с другом, еда, сон на койках, поход в туалет, осмотр копилки */
const ACT_LABELS={
  talk_pair:'💬 Общается',
  eat:'🍱 Ест паёк',
  sleep:'💤 Спит на койке',
  toilet:'🚻 В туалете',
  piggy:'🐷 У копилки'
};

function initHubLife(){
  let r=roundData;
  let baseSpots=[
    [-4.5,-3.2],[4.5,-3.5],[-4.2,4.2],[4.2,3.8],[-6.2,-10.2],[6.2,-9.8],
    [1.8,6.5],[19.2,-3.8],[-2.5,9.5],[-7.0,1.0],[2.8,1.2],[-1.8,-6.2],
    [-5.5,7.2],[5.5,7.0],[21.5,2.2],[0,-7.5]
  ];
  PEOPLE.forEach((n,i)=>{
    let [x,z]=baseSpots[i]||[0,0];
    let g=person(x,z,n.suitColor||0x1f8778,n.num,false,{name:n.name,hair:n.hair,hairColor:n.hairColor,glasses:n.glasses,skin:n.skin,scale:n.scale});
    g.userData.npc=n;
    let item={g,npc:n,named:true,id:n.id,name:n.name,num:n.num,activity:'talk_pair',timer:4+i*1.7,tx:x,tz:z,partner:null,line:n.reactions[clamp(state.round,0,5)]};
    let inter={x,z,title:`E · ${n.name} (№${n.num}) — поговорить`,fn:()=>talk(n),mesh:g};
    interactions.push(inter);
    item.inter=inter;
    r.hubNpcs.push(item);
  });
  // Добавляем массовку выживших игроков (чем меньше раунд, тем больше людей в зале!)
  let crowdCount=[16,13,10,8,6,4][clamp(state.round,0,5)]||6;
  for(let i=0;i<crowdCount;i++){
    let num=CROWD_NUMS[i];
    let x=-8+(i%4)*5.2, z=-7+Math.floor(i/4)*5.2;
    let g=person(x,z,SUIT_COLORS[i%SUIT_COLORS.length],num,false,{hair:HAIRS[i%HAIRS.length],hairColor:HAIR_COLORS[i%HAIR_COLORS.length],skin:SKINS[i%SKINS.length],glasses:i%5===0});
    let item={g,npc:null,named:false,id:'crowd_'+num,name:`Игрок №${num}`,num,activity:'eat',timer:3+i*1.3,tx:x,tz:z,partner:null,line:EAT_LINES[i%EAT_LINES.length]};
    let inter={x,z,title:`E · Игрок №${num} — заговорить`,fn:()=>talkCrowd(item),mesh:g};
    interactions.push(inter);
    item.inter=inter;
    r.hubNpcs.push(item);
  }
  assignAllNpcActivities();
}

function assignAllNpcActivities(){
  let r=roundData;if(!r.hubNpcs)return;
  let chats=PAIR_CHATS[clamp(state.round,0,5)]||PAIR_CHATS[0];
  // Сбрасываем позу сна и подносы
  r.hubNpcs.forEach(u=>{
    u.partner=null;
    u.g.userData.bodyGroup.rotation.x=0;
    u.g.userData.bodyGroup.position.y=0;
    u.g.userData.propTray.visible=false;
  });
  // Назначаем разнообразные действия так, чтобы одновременно в зале были:
  // 1) пары, общающиеся друг с другом; 2) люди, едящие паёк у стойки; 3) люди в туалете; 4) спящие на койках; 5) смотрящие на копилку!
  let phaseOffset=Math.floor(gameTime/16)%5;
  let pairSpots=[[-3.8,2.2],[-3.8,-5.2],[3.8,3.2],[3.4,-5.5]];
  let eatSpots=[[-2.8,-9.6],[-1.1,-9.4],[1.1,-9.4],[2.8,-9.6],[-5.2,-8.4],[5.2,-8.4]];
  let toiletSpots=[[18.6,-5.8],[21.2,-5.8],[23.6,5.4],[22.6,-1.8],[23.4,1.8]];
  let piggySpots=[[-1.6,-2.8],[1.6,-2.8],[0,-3.6],[-2.0,-1.0]];

  // Первые 4 пары (8 NPC) общаются друг с другом
  let rotated=[...r.hubNpcs.slice(phaseOffset),...r.hubNpcs.slice(0,phaseOffset)];
  for(let p=0;p<3;p++){
    let a=rotated[p*2], b=rotated[p*2+1];
    if(!a||!b)continue;
    let [px,pz]=pairSpots[p%pairSpots.length];
    let chat=chats[p%chats.length];
    a.activity='talk_pair';b.activity='talk_pair';
    a.partner=b;b.partner=a;
    a.tx=px-.65;a.tz=pz;b.tx=px+.65;b.tz=pz;
    a.line=chat[0];b.line=chat[1];
  }
  // Остальным распределяем: еда, туалет, сон на койке, осмотр копилки
  for(let i=6;i<rotated.length;i++){
    let u=rotated[i], mod=(i+phaseOffset)%4;
    // Мина (067) и Вера (212) особенно любят ходить в туалет к вентиляции/зеркалу
    if((u.npc?.perk==='mina'||u.npc?.perk==='vera')&&mod!==1)mod=1;
    if(r.night&&i%2===0)mod=2; // ночью больше спящих
    if(mod===0){
      let [ex,ez]=eatSpots[i%eatSpots.length];
      u.activity='eat';u.tx=ex;u.tz=ez;
      u.line=u.named?u.npc.reactions[clamp(state.round,0,5)]:EAT_LINES[i%EAT_LINES.length];
    }else if(mod===1){
      let [tx,tz]=toiletSpots[i%toiletSpots.length];
      u.activity='toilet';u.tx=tx;u.tz=tz;
      u.line=u.npc?.perk==='mina'?'Проверяет вентиляционную решётку в туалете: «Отсюда слышно охрану...»':TOILET_LINES[i%TOILET_LINES.length];
    }else if(mod===2&&r.bunkSpots.length){
      let b=r.bunkSpots[i%r.bunkSpots.length];
      u.activity='sleep';u.tx=b.x;u.tz=b.z;u.bunk=b;
      u.line=SLEEP_LINES[i%SLEEP_LINES.length];
    }else{
      let [gx,gz]=piggySpots[i%piggySpots.length];
      u.activity='piggy';u.tx=gx;u.tz=gz;
      u.line=u.named?u.npc.reactions[clamp(state.round,0,5)]:PIGGY_LINES[i%PIGGY_LINES.length];
    }
  }
  r.hubNpcs.forEach(u=>refreshNpcSign(u));
}

function refreshNpcSign(u){
  let tag=ACT_LABELS[u.activity]||'';
  let title=u.named?`№${u.num} (${u.npc.trait}) · ${tag}`:`№${u.num} · ${tag}`;
  let shortLine=(u.line||'').replace(/^№\d+\s+[^:]+:\s*/,'');
  updateLabel(u.g.userData.sign,title,shortLine);
  if(u.inter){
    u.inter.x=u.g.position.x;
    u.inter.z=u.g.position.z;
    u.inter.title=`E · ${u.named?u.name:`Игрок №${u.num}`} (${tag}) — взаимодействовать`;
  }
}

/* Навигация NPC через дверной проём между залом (x<14) и туалетом (x>16) */
function stepNpcToward(u,dt){
  let g=u.g, cx=g.position.x, cz=g.position.z, tx=u.tx, tz=u.tz;
  // Если NPC идёт из зала в туалет или обратно — сначала проводим через дверной проём (x=15, z=0)
  let inBath=cx>14.8, targetBath=tx>14.8;
  if(inBath!==targetBath){
    if(Math.abs(cz)>1.6){tx=inBath?16.2:13.6;tz=0;}
    else{tx=targetBath?16.5:13.4;tz=0;}
  }
  let dx=tx-cx, dz=tz-cz, d=Math.hypot(dx,dz);
  if(d>.14){
    let spd=2.25;
    g.position.x+=dx/d*Math.min(d,spd*dt);
    g.position.z+=dz/d*Math.min(d,spd*dt);
    g.rotation.y=Math.atan2(-dx,-dz);
    u.g.userData.bodyGroup.rotation.x=0;
    u.g.userData.bodyGroup.position.y=0;
    u.g.userData.propTray.visible=u.activity==='eat';
    animatePerson(g,true,dt);
  }else{
    animatePerson(g,false,dt);
    if(u.activity==='talk_pair'&&u.partner){
      let pdx=u.partner.g.position.x-cx, pdz=u.partner.g.position.z-cz;
      g.rotation.y=Math.atan2(-pdx,-pdz);
      // Жестикуляция при разговоре друг с другом
      u.g.userData.a.rotation.x=-.45+Math.sin(gameTime*4+u.g.userData.phase)*.25;
      u.g.userData.b.rotation.x=-.35-Math.sin(gameTime*3.5+u.g.userData.phase)*.22;
    }else if(u.activity==='eat'){
      u.g.userData.propTray.visible=true;
      u.g.userData.b.rotation.x=-.75;
      u.g.userData.a.rotation.x=-.65+Math.sin(gameTime*5)*.28; // подносит ложку/воду
    }else if(u.activity==='sleep'){
      // Ложится на койку отдыхать
      u.g.userData.bodyGroup.rotation.x=-1.35;
      u.g.userData.bodyGroup.position.y=.72;
    }else if(u.activity==='toilet'){
      if(cz<-4.5){
        g.rotation.y=0; // лицом к зеркалу и раковинам
        u.g.userData.a.rotation.x=-.55+Math.sin(gameTime*6)*.2;
        u.g.userData.b.rotation.x=-.55-Math.sin(gameTime*6)*.2;
      }
    }else if(u.activity==='piggy'){
      let pdx=0-cx, pdz=-1.5-cz;
      g.rotation.y=Math.atan2(-pdx,-pdz);
    }
  }
  if(u.inter){u.inter.x=g.position.x;u.inter.z=g.position.z;}
}

function useRestroomSink(){
  let k='sinkSession'+state.round;
  if(!state.daily[k]){
    state.daily[k]=true;
    state.energy=clamp(state.energy+18,0,100);
    state.hp=clamp(state.hp+6,0,100);
    save();
  }
  beep(540,.08);
  openModal('Туалет · Умывальник и зеркало',
    `<p>Холодная вода смывает усталость. В зеркале отражаются кафельные стены, кабинки и вентиляционная решётка под потолком.</p>
     <p>Участники регулярно приходят сюда умыться, перевести дух после испытаний или пошептаться вдали от охраны (+18 сил, +6 здоровья раз за перерыв).</p>`,
    [{text:'Отойти от раковины',primary:true,fn:()=>closeModal()}],
    'ЛОКАЦИЯ · ТУАЛЕТ'
  );
}

function useRestroomStall(){
  let k='stallSession'+state.round;
  let smuggler=PEOPLE.find(p=>p.perk==='vera');let found=!state.daily[k]&&(allied('vera')||(smuggler&&relation(smuggler)>=1));
  if(found){
    state.daily[k]=true;
    state.tokens+=1;
    state.probes+=1;
    save();
    beep(680,.12);
  }
  openModal('Кабинки туалета',
    `<p>В кабинках участники прячутся от камер наблюдения и пересчитывают припасы. Некоторые хитрецы прячут здесь найденные мелочи за трубами.</p>
     <p>${found?'<b>Ты нашёл тайник за трубой:</b> +1 жетон и +1 камешек!':'Подружись с кем-то из ловкачей в зале, чтобы узнать, где спрятана заначка.'}</p>`,
    [{text:'Вернуться в туалет',primary:true,fn:()=>closeModal()}],
    'ЛОКАЦИЯ · КАБИНКИ'
  );
}

function useRestroomVent(){
  let rIdx=clamp(state.round,0,5);
  let scout=PEOPLE.find(p=>p.perk==='mina');let canScout=allied('mina')||(scout&&relation(scout)>=1)||state.muralRead;
  let already=!!state.ventScouted[rIdx];
  let ventClues=[
    'Через решётку видно огромное песчаное поле и гигантскую куклу-девочку у дерева. Датчики движения выключаются за бетонными тумбами.',
    'Из шахты тянет запахом жжёного сахара! Внизу охрана разливает растопленную карамель в круглые жестяные баночки с формами.',
    'Слышен лязг лебёдок: в следующем зале две высокие башни, соединённые толстым канатом над пропастью.',
    'Охрана раскладывает мешочки по десять стеклянных шариков в декорациях старых глиняных улочек на закате.',
    'Рабочие протирают двенадцать пар стеклянных плит над бездной: половина из закалённого стекла, половина — из обычного.',
    'На песчаном дворе расчерчены белой краской круг, треугольник и квадрат для финального поединка.'
  ];
  if(canScout&&!already){
    state.ventScouted[rIdx]=true;
    state.probes+=1;
    if(!state.secrets.includes('vent_'+rIdx))state.secrets.push('vent_'+rIdx);
    save();
    beep(740,.15);
  }
  openModal('Вентиляционная шахта под потолком',
    `<p>В углу туалета решетка вентиляции слегка отогнута — именно через неё в сериале №067 пробиралась под потолком, чтобы подсмотреть подготовку следующей игры.</p>
     <p>${canScout
       ?`<b>Разведка через шахту («${TITLES[rIdx]}»):</b><br>«${ventClues[rIdx]}»<br><br><b>Бонус разведки получен:</b> +1 камешек и тактическое преимущество в следующем испытании!`
       :'Решётка высоко. Найди среди участников разведчика вентиляции или изучи рисунки на стенах зала, чтобы узнать, как безопасно заглянуть в шахту.'}</p>`,
    [{text:'Спуститься на пол',primary:true,fn:()=>closeModal()}],
    'СЕКРЕТ ИЗ СЕРИАЛА · ВЕНТИЛЯЦИЯ'
  );
}

function inspectMural(){
  if(!state.muralRead){
    state.muralRead=true;
    state.tokens+=1;
    if(!state.secrets.includes('mural'))state.secrets.push('mural');
    save();
    beep(660,.14);
  }
  openModal('Настенные рисунки шести игр',
    `<p>За многоярусными койками на стенах общежития с самого первого дня нарисованы пиктограммы всех шести испытаний (знаменитая деталь из сериала):</p>
     <ul>
       <li><b>I. Кукла и бегущие люди</b> — «Тише едешь»</li>
       <li><b>II. Круг, треугольник, звезда и зонтик</b> — «Сахарная фигура»</li>
       <li><b>III. Две башни и канат над пропастью</b> — «Перетягивание каната»</li>
       <li><b>IV. Пары игроков со стеклянными шариками</b> — «Десять шариков»</li>
       <li><b>V. Пары плит над бездной</b> — «Стеклянный мост»</li>
       <li><b>VI. Геометрический корт на песке</b> — «Последний круг»</li>
     </ul>
     <p>За внимательность ты получаешь <b>+1 жетон</b> и доступ к разведке через вентиляцию в туалете.</p>`,
    [{text:'Отойти от стены',primary:true,fn:()=>closeModal()}],
    'ПАСХАЛКА СЕРИАЛА · СТЕНЫ ЗАЛА'
  );
}

function inspectPiggyVote(){
  let surv=SURVIVOR_COUNTS[clamp(state.round,0,6)], prize=PRIZE_BILLIONS[clamp(state.round,0,6)];
  openModal('Золотая копилка и голосование (О / Х)',
    `<p class="lead">В игре осталось: <b>${surv}</b> из 456 · В копилке: <b>${prize} млрд вон</b></p>
     <p>Под прозрачным брюхом золотой свиньи стоит тумба с двумя кнопками из сериала: синий кружок <b>О</b> (продолжить игру ради приза) и красный крестик <b>Х</b> (прекратить игру по 3-му пункту правил).</p>
     <p>Твоя текущая позиция: <b>${state.vote==='X'?'Х — за прекращение игры и спасение жизней':state.vote==='O'?'О — идти до конца ради приза':'ещё не голосовал'}</b>.</p>
     <p class="small">Голосование влияет на реплики NPC: добродушные и осторожные участники уважают выбор «Х», а дерзкие и рассудительные — выбор «О».</p>`,
    [
      {text:'Нажать красную кнопку Х (За жизнь и союз)',primary:state.vote!=='X',fn:()=>{
        state.vote='X';
        PEOPLE.filter(p=>['Добродушный','Осторожный','Спокойный'].includes(p.trait)).slice(0,4).forEach(p=>state.trust[p.id]=clamp((state.trust[p.id]||0)+1,0,5));
        save();beep(580,.1);toast('Ты нажал Х. Осторожные и добродушные игроки поддержали тебя.');inspectPiggyVote();
      }},
      {text:'Нажать синюю кнопку О (Идти за призом)',primary:state.vote==='X',fn:()=>{
        state.vote='O';
        PEOPLE.filter(p=>['Дерзкий','Хитрый','Рассудительный'].includes(p.trait)).slice(0,4).forEach(p=>state.trust[p.id]=clamp((state.trust[p.id]||0)+1,0,5));
        save();beep(480,.1);toast('Ты нажал О. Дерзкие и азартные игроки оценили твою решимость.');inspectPiggyVote();
      }},
      {text:'Сводка действий всех NPC в зале (G)',fn:showDormOverview},
      {text:'Отойти от подиума',fn:()=>closeModal()}
    ],
    'ЦЕНТР ЗАЛА · КОПИЛКА'
  );
}

function showDormOverview(){
  if(mode!=='hub'||!roundData.hubNpcs)return;
  let rows=roundData.hubNpcs.slice(0,14).map(u=>{
    let act=ACT_LABELS[u.activity]||'В зале';
    let partnerTxt=u.activity==='talk_pair'&&u.partner?` (с ${u.partner.name})`:'';
    return `<p><b>${esc(u.name)} (№${u.num})</b> — ${act}${esc(partnerTxt)}<br><span class="small">${esc(u.line)}</span></p>`;
  }).join('');
  openModal('Жизнь общежития и реакции NPC',
    `<p>В зале и туалете сейчас <b>${roundData.hubNpcs.length}</b> активных моделей участников (и 4 охранника). Они свободно перемещаются между общим залом, стойкой еды, койками и туалетом.</p>
     <div class="results">${rows}</div>`,
    [
      {text:'Переключить сцену / сменить занятия NPC',primary:true,fn:()=>{gameTime+=17;assignAllNpcActivities();showDormOverview();}},
      {text:'Вернуться в зал',fn:()=>closeModal()}
    ],
    'СВОДКА ДЕЙСТВИЙ NPC (КЛАВИША G)'
  );
}

function talkCrowd(u){
  let act=ACT_LABELS[u.activity]||'В зале';
  openModal(`${u.name} · ${act}`,
    `<p class="lead">Выживший участник в зелёном костюме №${u.num}</p>
     <p><b>Что делает сейчас:</b> ${act}${u.partner?` с ${esc(u.partner.name)}`:''}</p>
     <p>«${esc(u.line)}»</p>
     <p class="small">Участники массовки живут по расписанию зала: стоят за пайком, уходят умываться в туалет, спят на многоярусных койках и обсуждают прошедшую игру.</p>`,
    [
      {text:'Поддержать разговор (+бодрость)',primary:true,fn:()=>{state.energy=clamp(state.energy+5,0,100);toast(`Игрок №${u.num} кивнул тебе. +5 сил.`);closeModal();}},
      ...(u.activity==='talk_pair'&&u.partner?[{text:`Послушать их диалог с ${u.partner.name}`,fn:()=>openModal(`Разговор: ${u.name} и ${u.partner.name}`,`<p><b>${esc(u.name)}:</b> «${esc(u.line)}»</p><p><b>${esc(u.partner.name)}:</b> «${esc(u.partner.line)}»</p>`,[{text:'Отойти',primary:true,fn:()=>closeModal()}])}]:[]),
      {text:'Отойти',fn:()=>closeModal()}
    ],
    'УЧАСТНИК ИГРЫ'
  );
}

function getRation(){
  let k='mealSession'+state.round;
  if(state.daily[k]){toast('Еда на этот перерыв уже получена. Дополнительную еду можно выменять.');return;}
  state.daily[k]=true;state.food+=2;state.water+=1;state.hunger=clamp(state.hunger+8,0,100);save();beep(620);
  toast('Выдано: 2 пайка и 1 вода. F — съесть паёк; едой можно делиться с NPC.');
}
function eat(){
  if(!started||mode==='carve'||paused)return;
  if(state.food<=0){toast('Пайки закончились.');return;}
  state.food--;
  let bonus=allied('elena')?12:0;
  state.hunger=clamp(state.hunger+30+bonus,0,100);
  state.energy=clamp(state.energy+28+bonus,0,100);
  state.hp=clamp(state.hp+12+bonus,0,100);
  if(mode==='hub')save();beep(380);
  toast(`Паёк: +${30+bonus} сытости, +${28+bonus} сил, +${12+bonus} здоровья.`);
}
function relation(n){return state.trust[n.id]||0;}

function findNpcUnit(n){
  return roundData.hubNpcs?.find(u=>u.id===n.id)||null;
}

function talk(n){
  currentNpc=n;
  let r=relation(n), ally=state.allies.includes(n.id), u=findNpcUnit(n);
  let act=u?ACT_LABELS[u.activity]:'💬 В зале';
  let partnerTxt=u&&u.activity==='talk_pair'&&u.partner?` с <b>№${esc(u.partner.num)}</b>`:'';
  let reaction=n.reactions?.[clamp(state.round,0,5)]||n.tip;
  let known=state.secrets.includes(n.id)||r>=1||ally;
  let roleTxt=known?n.role:`Характер: ${n.trait} (способность неизвестна)`;
  let ctxLabel=u?.activity==='toilet'?'Поговорить в туалете':u?.activity==='eat'?'Поесть рядом':u?.activity==='sleep'?'Проверить у койки':u?.activity==='talk_pair'&&u.partner?`Вступить в разговор с №${u.partner.num}`:'Обсудить копилку';

  openModal(`Игрок №${n.num}`,
    `<p class="lead">${esc(roleTxt)} · <span style="color:#75e1ba">${act}</span>${partnerTxt}</p>
     <p>Доверие: <b>${r}/5</b> ${ally?'· <b>в твоём союзе</b>':''}</p>
     <p>«${esc(reaction)}»</p>`,
    [
      {text:'Поговорить и узнать о прошлом',primary:true,fn:()=>{
        let key=n.id+'talkSession'+state.round;
        if(!state.daily[key]){state.daily[key]=true;state.trust[n.id]=clamp(r+1,0,5);if(n===PEOPLE[5])state.trust.tim=state.trust[n.id];}
        if(!state.secrets.includes(n.id))state.secrets.push(n.id);
        save();
        openModal(`Игрок №${n.num} · ${n.role}`,
          `<p>«${esc(n.tip)}»</p>
           <p><b>Особенность игрока:</b> ${esc(npcOffer(n))}</p>`,
          [{text:'Понятно',fn:()=>talk(n)},{text:'Завершить разговор',primary:true,fn:()=>closeModal()}]
        );
      }},
      {text:'Поделиться пайком (+1 доверие)',fn:()=>{
        let key=n.id+'giftSession'+state.round;
        if(state.daily[key]){toast('За этот перерыв ты уже делился с этим игроком.');return;}
        if(state.food<1){toast('Нет пайка.');return;}
        state.food--;state.daily[key]=true;state.trust[n.id]=clamp(r+1,0,5);if(n===PEOPLE[5])state.trust.tim=state.trust[n.id];
        if(!state.secrets.includes(n.id))state.secrets.push(n.id);
        save();talk(n);beep(700);
      }},
      {text:ally?'Поручение союзника':'Предложить союз',fn:()=>{
        if(!ally){
          if(r<2){toast('Нужно хотя бы 2 доверия.');return;}
          let maxAllies=allied('mingle')||n.perk==='mingle'?4:3;
          if(state.allies.length>=maxAllies){toast(`В союзе максимум ${maxAllies} игрока.`);return;}
          state.allies.push(n.id);if(n===PEOPLE[5]&&!state.allies.includes('tim'))state.allies.push('tim');save();toast(`Игрок №${n.num} теперь в твоём союзе.`);talk(n);
        }else npcQuest(n);
      }},
      {text:`Действие: ${ctxLabel}`,fn:()=>npcContextAction(n,u)},
      ...(n.perk==='dok'?[{text:'Попросить перевязку (+25 здоровья)',fn:()=>{
        let hk='dokHeal'+state.round;
        if(state.daily[hk]){toast('Тебя уже перевязали в этот перерыв.');return;}
        state.daily[hk]=true;state.hp=clamp(state.hp+25,0,100);state.energy=clamp(state.energy+10,0,100);save();beep(640);toast(`Игрок №${n.num} (бывший врач) обработал раны: +25 здоровья.`);talk(n);
      }}]:[]),
      ...(n.perk==='cross'?[{text:'Капсула из кулона-креста (100% сил + рывок)',fn:()=>{
        let ck='crossStim'+state.round;
        if(state.daily[ck]){toast('В этот перерыв ты уже брал капсулу.');return;}
        state.daily[ck]=true;state.energy=100;state.hp=clamp(state.hp+15,0,100);state.stimRound=state.round;save();beep(780,.12);toast(`Игрок №${n.num} открыл крест на шее: 100% сил и ускорение на раунд!`);talk(n);
      }}]:[]),
      ...(n.perk==='shaman'?[{text:'Выслушать пророчество шаманки',fn:()=>{
        let sk='shamanProphecy'+state.round;
        if(state.daily[sk]){toast('Пророчество на этот день уже получено.');return;}
        state.daily[sk]=true;state.shamanHints=state.shamanHints||{};state.shamanHints[state.round]=true;state.probes+=1;save();beep(510,.15);
        toast(`Игрок №${n.num} предрекла безопасную тропу (+1 камешек и знаки на мосту).`);talk(n);
      }}]:[]),
      ...(n.perk==='hairpin'?[{text:'Домашний гостинец (+25 сытости, +15 здоровья)',fn:()=>{
        let hk='hairpinFood'+state.round;
        if(state.daily[hk]){toast('Ты уже получил угощение в этот перерыв.');return;}
        state.daily[hk]=true;state.hunger=clamp(state.hunger+25,0,100);state.hp=clamp(state.hp+15,0,100);save();beep(620,.1);
        toast(`Игрок №${n.num} поделилась припасом и показала шпильку-клинок.`);talk(n);
      }}]:[]),
      ...(n.perk==='crypto'?[{text:'Обмен аналитика: 1 жетон → 2 пайка и вода',fn:()=>{
        if(state.tokens<1){toast('Нужен 1 жетон.');return;}
        state.tokens--;state.food+=2;state.water+=1;save();beep(690,.1);
        toast(`Игрок №${n.num} выгодно обменял жетон на 2 пайка и воду.`);talk(n);
      }}]:[]),
      ...(ally?[{text:'Выйти из союза',fn:()=>{state.allies=state.allies.filter(id=>id!==n.id);save();talk(n);}}]:[]),
      {text:'Отойти',fn:()=>closeModal()}
    ],
    `УЧАСТНИК №${n.num}`
  );
}

function npcContextAction(n,u){
  let act=u?.activity||'piggy';
  let ck=`ctx_${n.id}_${state.round}`;
  let first=!state.daily[ck];
  if(first){
    state.daily[ck]=true;
    state.energy=clamp(state.energy+10,0,100);
    if(u?.activity==='talk_pair'&&u.partner?.named){
      state.trust[u.partner.id]=clamp((state.trust[u.partner.id]||0)+1,0,5);
    }
    save();beep(610,.1);
  }
  if(act==='talk_pair'&&u?.partner){
    openModal(`Разговор: ${n.name} и ${u.partner.name}`,
      `<p>Ты подходишь к паре участников и включаешься в их обсуждение:</p>
       <p><b>${esc(n.name)} (№${n.num}):</b> «${esc(u.line)}»</p>
       <p><b>${esc(u.partner.name)} (№${u.partner.num}):</b> «${esc(u.partner.line)}»</p>
       <p>${first?'Они благодарны за поддержку разговора (+10 сил, доверие собеседника выросло).':'Вы уже обсудили с ними текущую обстановку.'}</p>`,
      [{text:'Вернуться к диалогу',primary:true,fn:()=>talk(n)},{text:'Отойти',fn:()=>closeModal()}],
      'ОБЩЕНИЕ NPC ДРУГ С ДРУГОМ'
    );
  }else if(act==='eat'){
    openModal(`${n.name} · Время пайка`,
      `<p>${esc(n.name)} сидит с жестяным контейнером и бутылкой воды.</p>
       <p>«${esc(u?.line||EAT_LINES[0])}»</p>
       <p>${first?'Вы спокойно поели рядом и обсудили раздачу (+10 сил).':'Вы уже посидели вместе за едой.'}</p>`,
      [{text:'Вернуться к диалогу',primary:true,fn:()=>talk(n)},{text:'Отойти',fn:()=>closeModal()}],
      'ДЕЙСТВИЕ NPC · ЕДА'
    );
  }else if(act==='toilet'){
    openModal(`${n.name} · Разговор в туалете`,
      `<p>${esc(n.name)} находится в туалете у зеркала и вентиляционной шахты, где нет камер охраны.</p>
       <p>«В туалете можно говорить открыто. Охрана следит за залом, но не за вентиляцией. Обязательно проверь решётку в углу!»</p>
       <p>${first?'Разговор без свидетелей укрепил вашу уверенность (+10 сил).':''}</p>`,
      [
        {text:'Заглянуть в вентиляционную шахту',primary:true,fn:useRestroomVent},
        {text:'Вернуться к диалогу',fn:()=>talk(n)}
      ],
      'ДЕЙСТВИЕ NPC · ТУАЛЕТ'
    );
  }else if(act==='sleep'){
    openModal(`${n.name} · Отдых у койки`,
      `<p>${esc(n.name)} лежит на матрасе, восстанавливая силы перед утренним сигналом.</p>
       <p>«Ночью в общежитии нельзя терять бдительность. Спасибо, что присматриваешь за проходом между койками».</p>`,
      [{text:'Вернуться к диалогу',primary:true,fn:()=>talk(n)},{text:'Не мешать спать',fn:()=>closeModal()}],
      'ДЕЙСТВИЕ NPC · СОН'
    );
  }else{
    openModal(`${n.name} · У золотой копилки`,
      `<p>${esc(n.name)} смотрит вверх на стеклянную свинью с деньгами и цифровое табло.</p>
       <p>«${esc(n.reactions[clamp(state.round,0,5)])}»</p>`,
      [{text:'Подойти к кнопкам голосования О / Х',primary:true,fn:inspectPiggyVote},{text:'Вернуться к диалогу',fn:()=>talk(n)}],
      'ДЕЙСТВИЕ NPC · КОПИЛКА'
    );
  }
}

function npcOffer(n){
  if(n.offer)return n.offer;
  let pk=PERK_POOL.find(x=>x.perk===(n.perk||n.id))||NONE_PERK;
  return pk?pk.offer:'Помощь в испытаниях.';
}

function npcQuest(n){
  let k='quest'+n.id;
  if(state.daily[k]){toast('Поручение этого участника уже выполнено.');return;}
  let water=['asya','mina','tim','dok','elena'].includes(n.id);
  openModal(`Поручение: ${n.name} (№${n.num})`,
    `<p>«${water?'Принеси бутылку воды. После испытания пересохло горло и дрожат руки.':'Поможешь с припасами? Нужен дополнительный паёк, чтобы продержаться до утра.'}»</p>
     <p>Награда: <b>1 жетон обмена</b> и <b>+1 доверие</b>. ${esc(npcOffer(n))}</p>`,
    [
      {text:water?'Отдать воду':'Отдать паёк',primary:true,fn:()=>{
        let kind=water?'water':'food';
        if(state[kind]<1){toast('Не хватает припасов.');return;}
        state[kind]--;state.tokens++;state.trust[n.id]=clamp(relation(n)+1,0,5);state.daily[k]=true;save();talk(n);
      }},
      {text:'Не сейчас',fn:()=>talk(n)}
    ]
  );
}
function shop(){
  openModal('Обмен припасами',
    `<p>Жетоны: <b>${state.tokens}</b> · Пайки: <b>${state.food}</b> · Вода: <b>${state.water}</b> · Камешки: <b>${state.probes}</b></p>
     <p>Жетоны дают за поручения участников, разведку стен, ночную вылазку и точное прохождение испытаний.</p>`,
    [
      {text:'1 паёк за 1 жетон',fn:()=>trade('food',1,1)},
      {text:'2 камешка за 1 жетон',fn:()=>trade('probes',2,1)},
      {text:'1 вода за 1 жетон',fn:()=>trade('water',1,1)},
      {text:'Обменять 2 пайка на жетон',fn:()=>{if(state.food<2){toast('Нужны два пайка.');return;}state.food-=2;state.tokens++;save();shop();}},
      {text:'Уйти',primary:true,fn:()=>closeModal()}
    ]
  );
}
function trade(kind,amount,cost){if(state.tokens<cost){toast('Не хватает жетонов.');return;}state.tokens-=cost;state[kind]+=amount;save();shop();beep(500);}
function bedMenu(){
  openModal(
    state.round===0?'Готов к первой игре?':roundData.night?'Ночь перед новым игровым днём':'Завершить вечер и лечь спать',
    `<p>${state.round===0?'Первая игра сегодня':`Следующая игра — утром дня ${state.round+1}`}: <b>${TITLES[state.round]}</b>.</p>
     <p>${state.round===0?'Перед первой игрой можно получить еду, осмотреть туалет и познакомиться с участниками.':'Сон завершает ночь и переводит время на утро следующего дня. Новая игра начнётся сразу утром, без отдельного дня отдыха.'} Не забудь получить паёк.</p>
     <p class="small">${roundData.stealth?'Вернись с найденными припасами и заверши вылазку.':'Можно рискнуть ночью: собрать три ящика припасов в темноте, избегая прожекторов охраны (награда — 2 жетона и 2 камешка).'}</p>`,
    [
      {text:state.round===0?'Отдохнуть и начать первую игру':`Лечь спать → игра утром дня ${state.round+1}`,primary:true,fn:()=>{
        if(roundData.stealth){toast('Сначала заверши вылазку.');return;}
        state.hp=clamp(state.hp+25,0,100);state.energy=100;state.hunger=clamp(state.hunger-10,0,100);save();startRound();
      }},
      {text:roundData.stealth?'Завершить ночную вылазку':'Ночная вылазка за припасами',fn:()=>{
        if(roundData.stealth){
          if(roundData.crates<3){toast('Сначала собери все три ящика.');return;}
          state.tokens+=2;state.probes+=2;state.daily['stealth'+state.day]=true;save();buildDorm();toast('Вылазка удалась: +2 жетона, +2 камешка.');
        }else startStealth();
      }},
      {text:'Сводка действий NPC в зале (G)',fn:showDormOverview},
      {text:'Остаться в общежитии',fn:()=>closeModal()}
    ]
  );
}
function startStealth(){
  if(state.daily['stealth'+state.day]){toast('Этой ночью припасы уже собраны.');return;}
  closeModal();roundData.night=true;roundData.stealth=true;roundData.crates=0;roundData.stealthTime=75;roundData.guards=[];
  assignAllNpcActivities();
  let spots=[[-5,-16],[5,-16],[22,4]]; // третий ящик можно забрать в крыле туалета!
  spots.forEach(([x,z])=>{
    let m=box(x,.45,z,.9,.9,.9,0xc09f5d);
    addInteract(x,z,'E · забрать ящик',()=>{if(m.visible){m.visible=false;roundData.crates++;beep(600);toast(`Припасы ${roundData.crates}/3. Вернись к своей койке.`);}},m);
  });
  for(let i=0;i<2;i++){
    let g=person(i?5:-5,0,0xe74074,'□',true);
    let cone=new THREE.Mesh(new THREE.ConeGeometry(3.1,9,20,1,true),new THREE.MeshBasicMaterial({color:0xffcf71,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide}));
    cone.rotation.x=Math.PI/2;cone.position.set(0,1,-4.5);g.add(cone);roundData.guards.push(g);
  }
  setObjective('НОЧНАЯ ВЫЛАЗКА','Собери 3 ящика (в зале и в туалете), избегая лучей охраны. C — красться. Затем вернись к койке.');
  toast('Отбой! Свет погашен. Один из ящиков спрятан в туалете справа.');
}
function allied(key){return state.allies.some(a=>{if(a===key)return true;let p=PEOPLE.find(x=>x.id===a);return p&&(p.perk===key||p.id===key);});}
function rules(title,text,fn){openModal(title,text,[{text:'Начать испытание',primary:true,fn:()=>{closeModal();roundData.started=true;fn?.();}}],`ДЕНЬ ${state.day} · ${state.round===0?'ПЕРВАЯ ИГРА':'УТРО'} · ПРАВИЛА ИСПЫТАНИЯ`);}
function startRound(){state.day=Math.min(6,state.round+1);let idx=state.round;if(idx===0)buildRed();else if(idx===1)buildCandy();else if(idx===2)buildTug();else if(idx===3)buildMarbles();else if(idx===4)buildGlass();else buildFinal();}
function fail(reason){
  if(allied('guardian')&&!state.guardianUsed&&mode!=='glass'){
    state.guardianUsed=true;state.hp=Math.max(35,state.hp);state.energy=Math.max(50,state.energy);
    if(roundData)roundData.expose=0;
    beep(620,.15);toast('Хранитель из союза прикрыл тебя в последний миг! Ты остаёшься в игре.');return;
  }
  if(mode==='dead'||mode==='ending')return;
  mode='dead';$('carvePanel').classList.remove('open');beep(100,.5,'sawtooth',.05);
  openModal('Испытание не пройдено',
    `<p>${esc(reason)}</p><p>Контрольная точка — перед этим испытанием. Можно повторить попытку или вернуться в общежитие и лучше подготовиться.</p>`,
    [
      {text:'Повторить испытание',primary:true,fn:()=>{state=load()||state;state.difficulty=difficulty;startRound();}},
      {text:'Вернуться в общежитие',fn:()=>{state=load()||state;buildDorm();}},
      {text:'Настройки сложности',fn:settings}
    ]
  );
}
function win(detail,bonus=1){
  if(mode==='dead'||mode==='ending'||mode==='result')return;
  let title=TITLES[state.round];
  if(allied('vera'))bonus+=1;
  state.completed.push({title,detail});state.round++;state.day=Math.min(6,state.round);state.tokens+=bonus;
  state.hunger=clamp(state.hunger-12,0,100);state.hp=clamp(state.hp+8,0,100);mode='result';save();beep(740,.3);
  openModal('Испытание пройдено',
    `<p class="lead">${title}</p><p>${esc(detail)}</p>
     <p>Награда: <b>${bonus} жетон${bonus===1?'':'а'}</b>${allied('vera')?' (включая бонус Веры №212)':''}. ${state.round<6?`В игре осталось ${SURVIVOR_COUNTS[state.round]} участников. Наступает вечер этого же дня: ужин, реакции выживших и сон перед новым утром.`:'Последние ворота открыты.'}</p>`,
    [{text:state.round<6?'Вернуться в общежитие':'Открыть финал',primary:true,fn:()=>state.round<6?buildDorm():ending()}],
    'РАУНД ЗАВЕРШЁН'
  );
}
function hurt(amount,msg){
  state.hp-=amount*(difficulty==='easy'?.65:1);beep(150,.12,'square');toast(msg);
  if(state.hp<=0)fail('Здоровье закончилось. Подготовка, еда, помощь Доктора №111 и отдых помогают пережить испытания.');
}
function ending(){
  mode='ending';started=true;resetWorld(0x183d48);ground(24,30,0x406663,makeTex('dormFloor',6,8));arch(-10);player.z=8;
  state.allies.forEach((id,i)=>{let p=PEOPLE.find(x=>x.id===id);if(p)person(-3+i*3,-5,0x2b9f86,p.num,false,{name:p.name,hair:p.hair});});
  label('ВЫХОД · 45.6 МЛРД ₩',0,4,-10,1.2,'#f4df9c');
  let names=state.allies.map(id=>PEOPLE.find(p=>p.id===id)?.name).filter(Boolean).join(', ')||'Ты прошёл путь без постоянного союза';
  openModal('ТЫ ДОШЁЛ ДО ВЫХОДА',
    `<p class="lead">${state.allies.length>=2?'Победа не обязана быть одиночеством.':'Ты выдержал все шесть испытаний.'}</p>
     <p>Твой союз: <b>${esc(names)}</b> · Позиция на голосовании: <b>${state.vote==='X'?'Х (За людей)':state.vote==='O'?'О (За приз)':'Нейтральная'}</b>.</p>
     <div class="results">${state.completed.map((c,i)=>`<p><b>${i+1}. ${esc(c.title)}</b><br>${esc(c.detail)}</p>`).join('')}</div>
     <p>Жетоны: ${state.tokens} · Найдено секретов и советов: ${state.secrets.length}</p>`,
    [{text:'Экспортировать итог',fn:exportSave},{text:'Главное меню',primary:true,fn:mainMenu}],
    'ФИНАЛ КАМПАНИИ'
  );
}

/* ИСПЫТАНИЕ 1: ТИШЕ ЕДЕШЬ (нарисованное небо и облака на стенах, дерево за куклой, 15 бегущих NPC) */
function buildRed(){
  mode='red';resetWorld(0x9ad2e6);
  room(30,90,0xd8eef5,false,makeTex('sand',10,28),makeTex('skyWall',6,1));
  player.z=37;bounds.maxZ=39;bounds.minZ=-41;
  box(0,.02,33,30,.04,.25,0xf4f1d6);box(0,.02,-34,30,.04,.45,0xe33c70);
  label('ФИНИШНАЯ ЛИНИЯ',0,3.2,-36,1.1);
  // Дерево позади куклы как в сериале
  cylinder(-3.8,2.8,-41.2,.45,5.6,0x5a4332);
  box(-2.4,4.8,-41.2,2.4,.28,.28,0x5a4332);
  box(-4.9,4.2,-41.2,2.1,.25,.25,0x5a4332);
  let doll=person(0,-40,0xd88532,'');doll.scale.set(2.8,2.8,2.8);
  let dress=new THREE.Mesh(new THREE.ConeGeometry(.65,1.26,10),mat(0xe6a63f));dress.position.set(0,1.18,0);doll.add(dress);
  sphere(-.37,2.02,.04,.16,0x27201b,doll);sphere(.37,2.02,.04,.16,0x27201b,doll);
  person(-7,-38,0xe33c70,'△',true);person(7,-38,0xe33c70,'△',true);
  let extraTime=(allied('arkady')?12:0)+(state.ventScouted[0]?8:0);
  roundData={started:false,time:(difficulty==='easy'?110:85)+extraTime,light:'green',phase:4.2,warning:false,detection:0,doll,npcs:[],finish:0};
  for(let i=0;i<5;i++){let x=(i%2?-1:1)*5.2,z=22-i*12;box(x,1.3,z,4.8,2.6,2.4,0x8a9c96);solid(x,z,5,2.6);}
  for(let i=0;i<15;i++){
    let g=person(-11+(i%5)*5.5,33+Math.floor(i/5)*2.6,0x238878,String(105+i*7));
    g.rotation.y=0;
    roundData.npcs.push({g,speed:3.1+Math.random()*1.6,alive:true});
  }
  setObjective('01 · ТИШЕ ЕДЕШЬ','Дойди до линии у куклы на зелёный сигнал. На красный замри или укройся за блоком.');
  rules(TITLES[0],`<p>Пересеки дальнюю линию за ${roundData.time} с. На красный свет замри или встань за бетонный блок.</p>`);
}
function blockedLine(x1,z1,x2,z2){
  let dx=x2-x1,dz=z2-z1;
  return obstacles.some(o=>{
    let lo=0,hi=1;
    for(let [a,d,min,max] of [[x1,dx,o.x-o.w/2,o.x+o.w/2],[z1,dz,o.z-o.d/2,o.z+o.d/2]]){
      if(Math.abs(d)<.00001){if(a<min||a>max)return false;}
      else{let p=(min-a)/d,q=(max-a)/d;if(p>q)[p,q]=[q,p];lo=Math.max(lo,p);hi=Math.min(hi,q);if(lo>hi)return false;}
    }
    return hi>0&&lo<1;
  });
}
function updateRed(dt,moving){
  let r=roundData;if(!r.started)return;
  r.time-=dt;r.phase-=dt;
  let warningAt=(allied('mina')?1.25:.65)+(state.ventScouted[0]?.35:0);
  if(r.light==='green'&&r.phase<warningAt&&!r.warning){r.warning=true;beep(550,.1);toast('Песня куклы заканчивается — замри!');}
  if(r.phase<=0){
    r.light=r.light==='green'?'red':'green';
    r.phase=r.light==='green'?3.3+Math.random()*2.1:2.5+Math.random()*1.4;
    r.warning=false;r.detection=0;beep(r.light==='red'?160:800,.2);
  }
  r.doll.rotation.y=r.light==='green'?0:Math.PI;
  $('statusChip').textContent=r.light==='green'?(r.warning?'СЕЙЧАС КРАСНЫЙ':'ЗЕЛЁНЫЙ — ИДИ'):'КРАСНЫЙ — ЗАМРИ';
  $('statusChip').style.background=r.light==='green'?(r.warning?'#ab7b1f':'#157b60'):'#c63b58';
  if(r.light==='red'&&(moving||player.y>.15)&&!blockedLine(0,-40,player.x,player.z)){
    r.detection+=dt;
    if(r.detection>(difficulty==='easy'?.58:.28)+(keys.KeyC?.2:0)){
      if(allied('veteran2')&&!r.vetSaved){r.vetSaved=true;r.detection=0;beep(540,.1);toast('Ветеран прошлых игр крикнул «ЗАМРИТЕ!» и прикрыл тебя от датчика куклы!');}
      else return fail('Кукла заметила движение на красный сигнал. Остановись заранее или используй укрытие.');
    }
  }else r.detection=Math.max(0,r.detection-dt*2);
  r.npcs.forEach((n,i)=>{
    if(!n.alive)return;
    let go=r.light==='green'&&!r.warning;
    if(go)n.g.position.z-=dt*n.speed;
    else if(r.light==='red'&&r.phase>2.4&&(i===3||i===11)&&n.g.position.z>-20){
      n.alive=false;n.g.rotation.z=Math.PI/2;toast(`Участник №${n.g.userData.number} дрогнул на красном сигнале.`);
    }
    n.g.position.z=Math.max(-36,n.g.position.z);animatePerson(n.g,go,dt);
  });
  if(player.z<-34)win(blockedLine(0,-40,player.x,player.z)?'Укрытия и выдержка привели тебя к финишу.':'Ты вовремя замирал и пересёк линию.',r.time>25?2:1);
  else if(r.time<=0)fail('Время вышло. Беги на зелёный и восстанавливай силы во время остановок.');
  $('special').innerHTML=`<b>${Math.ceil(r.time)} с</b> · До финиша ${Math.max(0,Math.ceil(player.z+34))} м`;
}

/* ИСПЫТАНИЕ 2: САХАРНАЯ ФИГУРА (детская площадка с горкой, качелями и 10 участниками) */
function buildCandy(){
  mode='candy';resetWorld(0xf3d7b6);
  room(30,36,0xf2c1a0,false,makeTex('sand',8,10),makeTex('skyWall',4,1));
  player.z=10;
  // Детская горка и песочница из сериала
  box(-9,2.2,-9,3.5,4.4,3.5,0xe56b86);
  let slide=box(-6.2,1.2,-9,4.2,.25,2.2,0xf4ce6a);slide.rotation.z=-.48;
  box(9,1.8,-9,4.5,3.6,.3,0x63b7a7);
  // Четыре двери с символами на дальней стене
  ['○','△','☆','☂'].forEach((sym,i)=>label(sym,-9+i*6,4.2,-17.3,.85,'#e34b7a'));
  box(0,.8,-3,6,1.6,4,0x799898);solid(0,-3,6.5,4.5);cylinder(0,1.67,-3,1.1,.12,0xdcb052);
  label('СТОЛ · САХАРНЫЕ СОТЫ',0,3.5,-3,.9);
  for(let i=0;i<10;i++){
    let g=person(-11+(i%5)*5.4,-11-Math.floor(i/5)*3.5,0x258877,String(180+i*9));
    g.userData.bodyGroup.position.y=-.35; // сидят над баночками
  }
  person(-12,0,0xe33c70,'△',true);person(12,0,0xe33c70,'□',true);
  addInteract(0,.1,'E · выбрать фигуру и вырезать',chooseShape);
  roundData={started:false};
  setObjective('02 · САХАРНАЯ ФИГУРА','Подойди к столу в центре площадки, выбери фигуру и проведи иглой по контуру.');
  rules(TITLES[1],'<p>Подойди к столу (E), выбери фигуру и проведи иглой по линии без трещин.</p>');
}
function chooseShape(){openModal('Выбор фигуры','<p>Простая фигура — безопаснее. Звезда и зонтик требуют твёрдой руки, но награда выше.</p>',[{text:'Круг · 1 жетон',primary:true,fn:()=>startCarve('circle')},{text:'Треугольник · 1 жетон',fn:()=>startCarve('triangle')},{text:'Звезда · 2 жетона',fn:()=>startCarve('star')},{text:'Зонтик · 3 жетона',fn:()=>startCarve('umbrella')},{text:'Отойти',fn:()=>closeModal()}]);}
function makePath(type){let p=[],cx=270,cy=260,r=160;function line(a,b,steps=22){for(let i=0;i<steps;i++)p.push({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps});}if(type==='circle'){for(let i=0;i<=170;i++){let a=-Math.PI/2+i/170*Math.PI*2;p.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});}}else if(type==='triangle'||type==='star'){let verts=[],n=type==='triangle'?3:10;for(let i=0;i<n;i++){let a=-Math.PI/2+i/n*Math.PI*2,rr=type==='star'&&i%2?75:r;verts.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr});}for(let i=0;i<n;i++)line(verts[i],verts[(i+1)%n]);p.push(verts[0]);}else{for(let i=0;i<=80;i++){let a=Math.PI+i/80*Math.PI;p.push({x:cx+Math.cos(a)*r,y:240+Math.sin(a)*r});}line({x:430,y:240},{x:300,y:240});line({x:300,y:240},{x:300,y:380});for(let i=0;i<=30;i++){let a=i/30*Math.PI;p.push({x:270+Math.cos(a)*30,y:380+Math.sin(a)*30});}line({x:240,y:380},{x:240,y:240});line({x:240,y:240},{x:110,y:240});p.push({x:110,y:240});}return p;}
function startCarve(type){
  mode='carve';changingLock=true;document.exitPointerLock?.();setTimeout(()=>changingLock=false,100);closeModal(false);$('carvePanel').classList.add('open');
  let names={circle:'Круг',triangle:'Треугольник',star:'Звезда',umbrella:'Зонтик'};
  let extra=(allied('arkady')?12:0);
  roundData={started:true,type,path:makePath(type),index:0,time:(difficulty==='easy'?150:105)+extra,crack:0,heat:0,down:false,mouse:null,lastMouse:null,soft:!!state.ventScouted[1]};
  $('carveName').textContent=names[type];
  $('soften').onclick=()=>{if(roundData.soft){toast('Сахар уже смягчён.');return;}if(state.water<=0){toast('Нет воды.');return;}state.water--;roundData.soft=true;toast('Сахар смягчён по методу №456: шире допуск и меньше трещин.');};
  $('carvePause').onclick=pauseMenu;
  setObjective('СЛЕДУЙ ПО КОНТУРУ','Начни с зелёной точки. Удерживай ЛКМ и веди к голубой точке.');
  drawCarve();
}
let carveCanvas=$('carveCanvas');
function carveMouse(e){let b=carveCanvas.getBoundingClientRect();roundData.mouse={x:(e.clientX-b.left)*540/b.width,y:(e.clientY-b.top)*540/b.height};}
carveCanvas.addEventListener('pointerdown',e=>{if(mode!=='carve'||paused)return;carveMouse(e);roundData.down=true;roundData.lastMouse={...roundData.mouse};carveCanvas.setPointerCapture(e.pointerId);});
carveCanvas.addEventListener('pointermove',e=>{if(mode==='carve')carveMouse(e);});
carveCanvas.addEventListener('pointerup',()=>roundData.down=false);
carveCanvas.addEventListener('pointercancel',()=>roundData.down=false);
function segmentDist(p,a,b){let dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,t=l?clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/l,0,1):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
function updateCarve(dt){
  let r=roundData;r.time-=dt;r.heat=Math.max(0,r.heat-dt*(r.down?.025:.25));
  if(r.down&&r.mouse){
    let target=r.path[r.index],dist=Math.hypot(r.mouse.x-target.x,r.mouse.y-target.y),tolerance=(difficulty==='easy'?21:14)+(allied('asya')||allied('gonggi')?7:0)+(r.soft?6:0),speed=r.lastMouse?Math.hypot(r.mouse.x-r.lastMouse.x,r.mouse.y-r.lastMouse.y):0;
    if(dist<tolerance){
      let advancing=0;
      while(r.index<r.path.length-1&&Math.hypot(r.mouse.x-r.path[r.index].x,r.mouse.y-r.path[r.index].y)<tolerance&&advancing<5){r.index++;advancing++;}
      if(advancing)r.heat+=dt*.2;
      if(r.index>=r.path.length-1){$('carvePanel').classList.remove('open');win(`${$('carveName').textContent}: фигура извлечена целиком. ${r.soft?'Увлажнение карамели помогло пройти сложные углы.':'Ты справился сухой иглой.'}`,r.type==='umbrella'?3:r.type==='star'?2:1);return;}
    }else{
      let from=r.path[Math.max(0,r.index-2)],to=r.path[Math.min(r.path.length-1,r.index+2)];
      if(segmentDist(r.mouse,from,to)>tolerance)r.crack+=dt*(r.soft?.075:.13)*(allied('asya')?.7:1);
    }
    if(speed>25)r.crack+=Math.min(.06,speed*.00018);
    if(r.heat>.8)r.crack+=dt*.12;
    r.lastMouse={...r.mouse};
  }
  if(r.crack>=1)return fail('Сахарная сота треснула. Не уводи иглу с контура и смачивай карамель водой.');
  if(r.time<=0)return fail('Время на сахарную фигуру вышло.');
  drawCarve();
}
function drawCarve(){
  if(mode!=='carve')return;
  let r=roundData,c=carveCanvas.getContext('2d');
  c.clearRect(0,0,540,540);c.fillStyle='#192b32';c.fillRect(0,0,540,540);
  c.beginPath();c.arc(270,270,235,0,Math.PI*2);c.fillStyle='#c69543';c.fill();c.strokeStyle='#f2c875';c.lineWidth=8;c.stroke();
  for(let i=0;i<80;i++){let a=i*2.399,rr=Math.sqrt(i/80)*220;c.fillStyle='rgba(102,60,17,.14)';c.beginPath();c.arc(270+Math.cos(a)*rr,270+Math.sin(a)*rr,2,0,7);c.fill();}
  c.beginPath();r.path.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle='#6f4924';c.lineWidth=5;c.stroke();
  c.beginPath();r.path.slice(0,r.index+1).forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle='#6ceac0';c.lineWidth=5;c.stroke();
  let t=r.path[r.index];c.fillStyle='#74e4fa';c.beginPath();c.arc(t.x,t.y,8,0,7);c.fill();
  c.fillStyle='#93f5b3';c.beginPath();c.arc(r.path[0].x,r.path[0].y,5,0,7);c.fill();
  if(r.mouse){c.strokeStyle='#fffbe8';c.lineWidth=2;c.beginPath();c.moveTo(r.mouse.x-8,r.mouse.y+11);c.lineTo(r.mouse.x,r.mouse.y);c.stroke();}
  if(r.crack>.2){c.strokeStyle='rgba(80,37,16,.7)';c.lineWidth=2;c.beginPath();c.moveTo(60,310);c.lineTo(90+r.crack*80,300);c.lineTo(80+r.crack*150,325);c.stroke();}
  $('carveStats').innerHTML=`<b>${Math.ceil(r.time)} с</b> · Контур ${Math.floor(r.index/(r.path.length-1)*100)}%<br>Трещины: ${Math.floor(r.crack*100)}% · Нагрузка иглы: ${Math.floor(r.heat*100)}%${r.soft?' · сахар смягчён':''}`;
}

/* ИСПЫТАНИЕ 3: ПЕРЕТЯГИВАНИЕ КАНАТА (жёлтые стальные башни над пропастью и гильотина по центру) */
function buildTug(){
  mode='tug';resetWorld(0x3a4d5c);ground(44,56,0x0c151d);
  // Две высокие жёлто-серые башни и центральная рама гильотины для каната
  box(0,1,12,11,2,18,0xd6ab4b);box(0,-4,12,9,8,16,0x37474f);
  box(0,1,-12,11,2,18,0xd6ab4b);box(0,-4,-12,9,8,16,0x37474f);
  box(-1.6,3.8,0,.25,3.6,.25,0xcfd8dc);box(1.6,3.8,0,.25,3.6,.25,0xcfd8dc);box(0,5.4,0,3.6,.35,.35,0xe55b84);
  player={x:0,z:13,y:2,vy:0,yaw:0,pitch:0};bounds={minX:-4.5,maxX:4.5,minZ:6,maxZ:19};
  let rope=box(0,3.1,0,.11,.11,36,0xd0b47a);
  for(let i=0;i<6;i++){
    let g=person(-1.8+(i%2)*3.6,7+Math.floor(i/2)*3.2,0x278c80,String(310+i*11));g.position.y=2;g.rotation.x=-.2;
    let o=person(-1.8+(i%2)*3.6,-7-Math.floor(i/2)*3.2,0x386f6f,String(370+i*9));o.position.y=2;o.rotation.y=Math.PI;
  }
  let flag=box(0,3.2,0,.65,.65,.08,0xee597f);
  let startProg=state.ventScouted[2]?.18:0;
  roundData={started:false,time:75+(allied('arkady')?12:0),progress:startProg,beat:0,combo:0,cooldown:0,pull:0,flag,strategy:'steady',call:0,called:false,rope};
  setObjective('03 · ПЕРЕТЯГИВАНИЕ КАНАТА','Жми Пробел / ТЯНУТЬ в зелёной зоне ритма, C / Упор для защиты и E / Рывок.');
  rules(TITLES[2],'<p>Нажимай <b>Пробел / ТЯНУТЬ</b> в зелёном секторе, удерживай <b>C / Упор</b> для защиты и <b>E</b> для общего рывка.</p>');
}
function tugPull(){
  let r=roundData;if(!r.started||r.cooldown>0)return;
  r.cooldown=.22;let p=r.beat%1,tol=difficulty==='easy'?.22:.15,good=Math.abs(p-.5)<tol;
  let cost=(r.strategy==='power'?12:r.strategy==='endure'?5:8)*(allied('matvey')?.8:1);
  if(state.energy<cost){toast('Нет сил. Удерживай C для упора и восстановления.');return;}
  state.energy-=cost;
  if(good){
    r.combo++;
    let strength=(r.strategy==='power'?.125:r.strategy==='endure'?.075:.10)*(allied('ivan')?1.25:1)*(1+Math.min(r.combo,8)*.08);
    r.progress+=strength;r.pull=.25;beep(650+r.combo*20);toast(`Точный рывок! Серия: ${r.combo}`);
  }else{r.combo=0;r.progress-=.025;beep(190);toast('Мимо ритма. Жди зелёного сектора.');}
}
function tugCall(){
  let r=roundData;if(!r.started)return;
  if(r.called){toast('Командный рывок уже использован.');return;}
  r.called=true;r.progress+=.18+state.allies.length*.06;r.pull=.5;beep(820,.2);
  toast('Три шага вперёд и общий рывок! Команда перехватила инициативу.');
}
function updateTug(dt){
  let r=roundData;if(!r.started)return;
  r.time-=dt;r.beat+=dt*.8;r.cooldown=Math.max(0,r.cooldown-dt);r.pull=Math.max(0,r.pull-dt);
  let braced=!!keys.KeyC;
  r.progress-=dt*(difficulty==='easy'?.025:.035)*(braced?.48:1);
  state.energy=clamp(state.energy+dt*(braced?17:7.5),0,100);
  r.flag.position.z=r.progress*8;
  actors.forEach(g=>{g.rotation.x=(g.position.z>0?-1:1)*(.16+(r.pull>0?.3:0));});
  let b=r.beat%1,tol=difficulty==='easy'?22:15;
  $('special').innerHTML=`<div class="meter"><span class="good" style="left:${50-tol}%;width:${tol*2}%"></span><i style="left:${b*100}%"></i></div><div class="pullmeter"><i style="left:${clamp((r.progress+1)*50,0,100)}%"></i></div><b>${Math.ceil(r.time)} с</b> · Тактика: ${r.strategy==='power'?'сила':r.strategy==='endure'?'выносливость':'баланс'} · Серия ${r.combo}`;
  if(r.progress>=1)win(`Команда победила на башне. Тактика: ${r.strategy==='power'?'силовой натиск':r.strategy==='endure'?'бережный ритм':'баланс'}.`,r.combo>=4?2:1);
  else if(r.progress<=-1||r.time<=0)fail('Противники перетянули канат. Нажимай Space в зелёный сектор и удерживай C для упора.');
}

/* ИСПЫТАНИЕ 4: ДЕСЯТЬ ШАРИКОВ (закатные кирпичные улочки Сеула, фонари и пары игроков) */
function buildMarbles(){
  mode='marbles';resetWorld(0xd98a5c);
  room(34,36,0xb36a4c,false,makeTex('sand',10,10),makeTex('brick',6,2));
  player.z=11;
  // Закатные улочки с кирпичными домами, черепичными козырьками и тёплыми фонарями
  for(let i=0;i<4;i++){
    let hx=-13+i*8.8;
    box(hx,1.6,-13,6.2,3.2,3.4,mat(0xb87354,.8,0,makeTex('brick',2,1)));
    box(hx,3.35,-13,6.7,.28,3.9,0x493d3a);
    solid(hx,-13,6.4,3.5);
  }
  for(let x of [-11,11])for(let z of [-6,6]){
    cylinder(x,1.8,z,.09,3.6,0x2e2a27);
    sphere(x,3.7,z,.24,new THREE.MeshStandardMaterial({color:0xffe29a,emissive:0xffae42,emissiveIntensity:1.6}));
  }
  // Другие пары участников в соседних проулках
  person(-10,-3,0x248274,'069');person(-10,-5.2,0x248274,'070');
  person(10,-2,0x248274,'067');person(10,-4.2,0x248274,'240');
  person(0,-15.5,0xe33c70,'○',true);

  let n=PEOPLE.find(x=>x.perk==='tim'||x.id==='tim')||PEOPLE[5];
  let g=person(0,-3,n.suitColor||0x278b7d,n.num,false,{name:n.name,hair:n.hair,hairColor:n.hairColor,glasses:n.glasses,skin:n.skin,scale:n.scale});
  roundData={started:false,time:(difficulty==='easy'?180:135)+(allied('arkady')?12:0),count:10,other:10,shots:0,aimYaw:0,aimPower:.5,shot:null,challenge:null,opponent:g,partner:n,tries:0};
  cylinder(0,.025,-9,1.3,.05,0x536f66);cylinder(0,.03,-9,.55,.06,0x1c3438);label('ЛУНКА',0,2,-9,.5);
  addInteract(0,-.5,`E · ${n.name} — выбрать игру с шариками`,marbleMenu);
  setObjective('04 · ДЕСЯТЬ ШАРИКОВ',`Собери 20 шариков в переулке: «чёт / нечёт», бросок в лунку или договор с ${n.name}.`);
  rules(TITLES[3],`<p>У тебя и у напарника (${n.name}) по 10 шариков. Собери все 20 бросками в лунку, угадыванием или договором.</p>`);
}
function marbleMenu(){
  if(!roundData.started)return;
  let n=roundData.partner||PEOPLE[5];
  let canCoop=allied('tim')&&((state.trust.tim||0)>=3||(state.trust[n.id]||0)>=3);
  openModal(`${n.name} (${n.trait}): шарики`,
    `<p>Твои шарики: <b>${roundData.count}</b> · У напарника: <b>${roundData.other}</b></p>
     <p>«Выберем правила вместе. Мы же напарники».</p>`,
    [
      {text:'Чёт / нечёт',primary:true,fn:chooseParity},
      {text:'Точность: броски в лунку',fn:()=>{roundData.challenge='aim';player.x=0;player.z=3;player.y=0;player.yaw=0;closeModal();toast('Угол и сила — стрелки/кнопки, Пробел/БРОСОК — бросить.');}},
      {text:'Договориться по-дружески',fn:()=>{
        if(canCoop){win(`${n.name} улыбнулся, назвал тебя настоящим другом и отдал свои шарики.`,2);}
        else{openModal(`${n.name} качает головой`,'<p>«Для такого шага нужен союз со знатоком дворовых игр и доверие хотя бы 3».</p>',[{text:'Другой способ',primary:true,fn:marbleMenu}]);}
      }},
      {text:'Вернуться в переулок',fn:()=>closeModal()}
    ]
  );
}
function chooseParity(){
  let r=roundData,n=r.partner||PEOPLE[5];if(r.count<=0)return fail('Все шарики проиграны.');
  let hidden=1+Math.floor(Math.random()*5);
  let hint=((state.trust[n.id]||0)>=2||(state.trust.tim||0)>=2||state.ventScouted[3]||allied('shaman'))?`${n.name} приоткрыл ладонь: похоже, там ${hidden>=3?'не меньше трёх':'не больше двух'} шариков.`:`${n.name} крепко сжал кулак: подсказки нет.`;
  r.hidden=hidden;
  openModal('Чёт или нечёт?',`<p>${hint}</p><p>Твой запас: ${r.count} / 20.</p>`,
    [1,2,3].flatMap(b=>[{text:`Чёт · ставка ${b}`,fn:()=>parityResult(true,b)},{text:`Нечёт · ставка ${b}`,fn:()=>parityResult(false,b)}]).concat([{text:'Изменить правила',fn:marbleMenu}])
  );
}
function parityResult(even,bet){
  let r=roundData,n=r.partner||PEOPLE[5];if(r.count<bet){toast('Не хватает шариков для этой ставки.');return;}
  let won=(r.hidden%2===0)===even,bonus=(won&&allied('crypto'))?1:0,transfer=won?Math.min(bet+bonus,r.other):bet;
  r.count+=won?transfer:-transfer;r.other+=won?-transfer:transfer;r.tries++;
  if(r.count>=20)return win('Ты собрал все 20 шариков в переулке.');
  if(r.count<=0)return fail('Все шарики проиграны.');
  openModal(won?'Ты угадал':`${n.name} угадал`,`<p>В ладони было ${r.hidden}. ${won?'+':'−'}${transfer} шарика.</p><p>Твой запас: ${r.count} / 20.</p>`,
    [{text:'Следующая ставка',primary:true,fn:chooseParity},{text:'Изменить правила',fn:marbleMenu},{text:'В переулок',fn:()=>closeModal()}]
  );
}
function throwMarble(){
  let r=roundData;if(r.challenge!=='aim'||r.shot)return;
  let speed=5+r.aimPower*8,flight=.95,range=speed*flight,ex=Math.sin(r.aimYaw)*range,ez=3-Math.cos(r.aimYaw)*range;
  r.shot={t:0,dur:flight,ex,ez,m:sphere(0,.18,3,.13,0xeecf82)};beep(450);
}
function updateMarbles(dt){
  let r=roundData;if(!r.started)return;r.time-=dt;
  if(r.challenge==='aim'){
    if(!r.shot){
      r.aimYaw=clamp(r.aimYaw+((keys.KeyD?1:0)-(keys.KeyA?1:0))*dt*.5,-.6,.6);
      r.aimPower=clamp(r.aimPower+((keys.KeyW?1:0)-(keys.KeyS?1:0))*dt*.3,0,1);
      player.yaw=r.aimYaw;
    }
    if(r.shot){
      let s=r.shot;s.t+=dt;let t=clamp(s.t/s.dur,0,1);
      s.m.position.set(s.ex*t,.18+Math.sin(t*Math.PI)*2.6,3+(s.ez-3)*t);
      if(t>=1){
        let hit=Math.hypot(s.ex,s.ez+9)<(difficulty==='easy'?1.05:.65)*(allied('gonggi')?1.38:1);
        world.remove(s.m);s.m.geometry.dispose();s.m.material.dispose();r.shot=null;r.shots++;
        if(hit){let n=Math.min(allied('crypto')?3:2,r.other);r.count+=n;r.other-=n;beep(800,.15);toast(`Попадание в лунку! ${r.count}/20 шариков.`);}
        else{r.count--;r.other++;toast(`Промах. Осталось ${r.count}. Скорректируй силу и угол.`);}
        if(r.count>=20)return win('Ты выиграл все шарики точными бросками в лунку.',r.shots<=7?2:1);
        if(r.count<=0)return fail('Запас шариков исчерпан. Для лунки нужен угол около 0° и сила около 95%.');
      }
    }
    let predicted=(5+r.aimPower*8)*.95,delta=Math.abs(predicted-12);
    $('special').innerHTML=`<b>${r.count}/20 шариков</b> · ${Math.ceil(r.time)} с<br>Сила ${Math.round(r.aimPower*100)}% · Угол ${Math.round(r.aimYaw*180/Math.PI)}°<br><span style="color:${delta<.6&&Math.abs(r.aimYaw)<.05?'#8eefba':'#f4ca81'}">Дальность ${predicted.toFixed(1)} м · лунка в 12 м</span>`;
  }else $('special').innerHTML=`<b>${r.count}/20 шариков</b> · ${Math.ceil(r.time)} с`;
  if(r.time<=0)fail('Время игры с шариками вышло.');
}

/* ИСПЫТАНИЕ 5: СТЕКЛЯННЫЙ МОСТ (неоновые рельсы циркового зала и золотая ложа VIP-гостей) */
function buildGlass(){
  mode='glass';resetWorld(0x111c2b);ground(32,100,0x060b12);
  box(0,1,31,10,2,12,0x606d75);box(0,1,-34,10,2,10,0x606d75);
  // Золотое окно VIP-ложи вдали
  box(0,7.5,-42,14,4.5,.4,new THREE.MeshStandardMaterial({color:0xffcf6b,emissive:0xc78d2c,emissiveIntensity:.75}));
  label('ЛОЖА НАБЛЮДАТЕЛЕЙ',0,10.5,-41.5,.8,'#ffd875');
  player={x:-1.7,z:30,y:2,vy:0,yaw:0,pitch:0};bounds={minX:-3.2,maxX:3.2,minZ:-37,maxZ:35};
  roundData={started:false,time:(difficulty==='easy'?165:115)+(allied('arkady')?12:0),rows:[],reveals:{},checked:new Set(),npc:null,npcNext:4,falling:false,focus:0,bestRow:-1};
  for(let i=0;i<12;i++){
    let z=21-i*4.2,safe=Math.random()<.5?0:1,row={z,safe,panels:[],broken:[false,false]};
    for(let side=0;side<2;side++){
      let x=side?1.75:-1.75;
      let m=box(x,1.94,z,3.1,.12,3.7,new THREE.MeshStandardMaterial({color:0x99cad9,transparent:true,opacity:.63,metalness:.22,roughness:.12}));
      row.panels.push(m);
      for(let dz of [-1.92,1.92])box(x,1.81,z+dz,3.2,.1,.12,0x91a4b0);
    }
    roundData.rows.push(row);
  }
  let railMat=new THREE.MeshStandardMaterial({color:0xf25c92,emissive:0xc72a62,emissiveIntensity:.85});
  for(let x of [-3.45,0,3.45])box(x,1.77,-2,.13,.13,51,railMat);
  label('ВЫХОД С МОСТА',0,4,-29,.8);
  if(allied('boris')||allied('diver')){state.probes++;toast('Союзник передал дополнительный камешек.');}
  if(state.ventScouted[4]||state.shamanHints?.[4]||allied('shaman')){revealGlass(0,roundData.rows[0].safe);if(state.shamanHints?.[4]||allied('shaman'))revealGlass(1,roundData.rows[1].safe);}
  let g=person(1.75,28,0x298b7a,'310');g.position.y=2;roundData.npc=g;
  setObjective('05 · СТЕКЛЯННЫЙ МОСТ','В каждой паре прочное только закалённое стекло. Q — проверить панель, E — пустить игрока вперёд.');
  rules(TITLES[4],`<p>Пройди 12 пар стеклянных плит за ${roundData.time} с. <b>Q</b> — проверка стекла, <b>E</b> — пустить NPC вперёд.</p>`);
}
function nextGlassRow(){let r=roundData;for(let i=0;i<r.rows.length;i++){if(r.rows[i].z<player.z-.5&&!r.checked.has(i))return i;}return Math.min(11,Math.max(0,Math.floor((21-player.z)/4.2)+1));}
function revealGlass(i,side){
  let r=roundData,row=r.rows[i];if(!row)return;
  let safe=row.safe===side;
  if(safe){row.panels[side].material.color.setHex(0x62e4a4);row.panels[side].material.opacity=.88;}
  else{
    row.broken[side]=true;row.panels[side].visible=false;
    let frag=box(side?1.75:-1.75,1.7,row.z,.5,.1,.5,0xa0d9e8);items.push({mesh:frag,fall:true});
    row.panels[1-side].material.color.setHex(0x62e4a4);
  }
  r.reveals[i]=row.safe;r.checked.add(i);beep(safe?700:200);return safe;
}
function inspectGlass(){
  let r=roundData;if(r.focus>0){toast('Нужно мгновение, чтобы присмотреться к бликам стекла.');return;}
  let i=nextGlassRow(),row=r.rows[i];if(!row)return;
  if(Math.abs(player.z-row.z)>9){toast('Подойди ближе к следующему ряду.');return;}
  r.focus=2;
  if(allied('dana')){
    row.panels[row.safe].material.color.setHex(0x62e4a4);row.panels[row.safe].material.opacity=.88;
    r.reveals[i]=row.safe;r.checked.add(i);toast(`Стекольщик из союза: ряд ${i+1}, закалённое ${row.safe?'правое':'левое'} стекло.`);return;
  }
  if(state.probes<=0){toast('Камешки закончились. E — отправить NPC первым.');return;}
  state.probes--;let side=player.x>=0?1:0,safe=revealGlass(i,side);
  toast(`Ряд ${i+1}: ${side?'правое':'левое'} стекло ${safe?'закалённое':'обычное'}.`);
}
function leadGlass(){
  let r=roundData;if(!r.npc||r.npcNext<=0){toast('Участник больше не может идти первым.');return;}
  let i=nextGlassRow(),row=r.rows[i];
  if(Math.abs(player.z-row.z)>9){toast('Подойди к краю моста.');return;}
  if(r.reveals[i]!==undefined){toast('Этот ряд уже проверен.');return;}
  r.npcNext--;let side=Math.random()<.5?0:1;r.npc.position.set(side?1.75:-1.75,2,row.z);
  let ok=revealGlass(i,side);
  if(ok)toast(`Участник проверил ряд ${i+1}: ${side?'справа':'слева'} надёжно.`);
  else{r.npc.rotation.z=Math.PI/2;r.npc.position.y=.2;r.npc=null;toast('Обычное стекло разбилось! Соседняя панель безопасна.');}
}
function glassFloor(){
  if(player.z>24||player.z<-28)return 2;
  for(let row of roundData.rows){
    if(Math.abs(player.z-row.z)<=1.99){
      let side=player.x>=0?1:0;
      if(Math.abs(player.x-(side?1.75:-1.75))<1.7){
        if(row.broken[side])return -8;
        if(player.y<=2.06&&player.vy<=0){
          if(row.safe!==side){revealGlass(roundData.rows.indexOf(row),side);return -8;}
          roundData.checked.add(roundData.rows.indexOf(row));
        }
        return 2;
      }
    }
  }
  return -8;
}
function updateGlass(dt){
  let r=roundData;if(!r.started)return;r.time-=dt;r.focus=Math.max(0,r.focus-dt);
  items.forEach(i=>{if(i.fall)i.mesh.position.y-=dt*6;});
  if(player.y<-2)return fail('Стекло не выдержало. Проверяй плиты перед прыжком (Q).');
  if(player.z<-29&&player.y>1.5)return win(allied('dana')?'Союзник-стекольщик помог определить закалённое стекло по бликам.':'Ты пересёк мост над бездной.',r.time>30?2:1);
  if(r.time<=0)return fail('Время на стеклянном мосту вышло.');
  $('special').innerHTML=`<b>${Math.ceil(r.time)} с</b> · Камешки ${state.probes} · Ряд ${Math.min(12,Math.max(0,Math.floor((24-player.z)/4.2)))}/12${allied('dana')?' · Стекольщик: Q':''}`;
}

/* ИСПЫТАНИЕ 6: ПОСЛЕДНИЙ КРУГ (разметка Игры в кальмара: круг, треугольник и квадрат на песке) */
function makeSquidCourtTex(){
  let cv=document.createElement('canvas');cv.width=512;cv.height=512;
  let c=cv.getContext('2d');
  c.fillStyle='#505d5a';c.fillRect(0,0,512,512);
  c.strokeStyle='#f2efe4';c.lineWidth=8;
  c.beginPath();c.arc(256,88,44,0,7);c.stroke();
  c.beginPath();c.moveTo(256,130);c.lineTo(150,260);c.lineTo(362,260);c.closePath();c.stroke();
  c.strokeRect(156,264,200,150);
  c.beginPath();c.arc(256,435,36,0,7);c.stroke();
  return new THREE.CanvasTexture(cv);
}
function buildFinal(){
  mode='final';resetWorld(0x2a3d45);
  room(34,44,0x4e6166,false,makeSquidCourtTex(),makeTex('dormWall',6,2));
  player.z=15;
  let initFill=state.ventScouted[5]?.35:0;
  let points=[{x:-9,z:11},{x:0,z:0},{x:9,z:-11}].map(p=>({...p,fill:initFill,m:cylinder(p.x,.05,p.z,2,.1,0xd59e47)}));
  let opp=person(0,-10,0x365d64,'327');
  roundData={started:false,time:(difficulty==='easy'?150:115)+(allied('arkady')?12:0),opp,hp:100,attackCD:0,opCD:1.2,points,stun:0,dash:0,call:false,guards:[],hold:0};
  for(let i=0;i<state.allies.length;i++){
    let p=PEOPLE.find(x=>x.id===state.allies[i]);
    if(p){let g=person(-12+i*4,18,0x2b9784,p.num,false,{name:p.name});roundData.guards.push(g);}
  }
  person(-14,0,0xe33c70,'□',true);person(14,0,0xe33c70,'△',true);
  label('ГОЛОВА КАЛЬМАРА · ФИНИШ',0,3,-18,1);box(0,.025,-18,12,.05,1,0x54c493);
  setObjective('06 · ПОСЛЕДНИЙ КРУГ','Победи соперника или активируй 3 золотые точки (E), затем шагни в верхний круг.');
  rules(TITLES[5],'<p>Активируй 3 золотые точки на разметке (<b>E</b>) или одолей соперника в бою, после чего войди в финишный круг.</p>');
}
function finalAttack(){
  let r=roundData;if(!r.started||r.attackCD>0)return;
  if(state.energy<12){toast('На удар не хватает сил. Отойди или выпей воды (R).');return;}
  state.energy-=12;r.attackCD=.52;
  let d=Math.hypot(player.x-r.opp.position.x,player.z-r.opp.position.z);
  if(d<2.8){
    let dir=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),to=new THREE.Vector3(r.opp.position.x-player.x,0,r.opp.position.z-player.z).normalize();
    if(dir.dot(to)>.1){
      r.hp-=(difficulty==='easy'?24:17)+(allied('boris')?4:0)+(allied('specops')?7:0)+(allied('hairpin')?6:0);r.stun=.5;
      r.opp.position.x+=to.x*.65;r.opp.position.z+=to.z*.65;beep(230,.1,'triangle');
      toast(`Попадание! Силы соперника: ${Math.max(0,r.hp)}%.`);
    }else toast('Соперник за спиной. Развернись.');
  }else{beep(260);toast('Слишком далеко для удара.');}
}
function finalCall(){
  let r=roundData;if(r.call){toast('Союзники уже помогли.');return;}
  if(!state.allies.length){toast('Сначала нужен союз в общежитии.');return;}
  r.call=true;r.stun=4+state.allies.length*2;toast('Союзники отвлекают соперника у края корта!');beep(760,.2);
}
function drink(){if(state.water<1){toast('Нет воды.');return;}state.water--;state.energy=clamp(state.energy+40,0,100);if(mode==='hub')save();toast('Вода восстановила 40 сил.');}
function updateFinal(dt){
  let r=roundData;if(!r.started)return;
  r.time-=dt;r.attackCD=Math.max(0,r.attackCD-dt);r.opCD=Math.max(0,r.opCD-dt);r.stun=Math.max(0,r.stun-dt);
  let dx=player.x-r.opp.position.x,dz=player.z-r.opp.position.z,d=Math.hypot(dx,dz);
  if(r.hp>0&&r.stun<=0){
    r.opp.rotation.y=Math.atan2(-dx,-dz);
    if(d>1.7){r.opp.position.x+=dx/d*dt*(difficulty==='easy'?2.2:2.9);r.opp.position.z+=dz/d*dt*(difficulty==='easy'?2.2:2.9);}
    animatePerson(r.opp,d>1.7,dt);
    if(d<2.5&&r.opCD<=0){
      r.opCD=1.35;
      if(player.y>.4)toast('Уклонение прыжком!');
      else if(keys.KeyC&&state.energy>10){state.energy-=10;hurt(3,'Ты заблокировал удар.');}
      else hurt(allied('specops')?8:13,'Удар соперника. C — защита; отойди или прыгни.');
    }
  }
  if(r.hp<=0){r.opp.rotation.z=Math.PI/2;r.opp.position.y=.4;}
  for(let p of r.points){
    let near=Math.hypot(player.x-p.x,player.z-p.z)<2.6;
    if(near&&keys.KeyE&&p.fill<1){
      p.fill=clamp(p.fill+dt/(allied('lev')?2.2:3.5),0,1);
      if(p.fill>=1){p.m.material.color.setHex(0x68dfa6);beep(850);toast('Контрольная точка активирована.');}
    }
    if(p.fill<1)p.m.material.emissive.setHex(near?0x55401a:0);
  }
  let n=r.points.filter(p=>p.fill>=1).length,near=r.points.find(p=>Math.hypot(player.x-p.x,player.z-p.z)<2.6&&p.fill<1);
  $('special').innerHTML=`<b>${Math.ceil(r.time)} с</b> · Соперник ${Math.max(0,r.hp)}% · Точки ${n}/3${near?`<br>Удерживай E: ${Math.floor(near.fill*100)}%`:''}`;
  if(player.z<-18&&(n===3||r.hp<=0))win(n===3?'Ты активировал три точки корта и победил тактикой без добивания соперника.':'Ты выстоял в финальном поединке и вошёл в круг победителя.',n===3?3:2);
  if(r.time<=0)fail('Время финала вышло.');
}

function animatePerson(g,moving,dt){
  g.userData.phase+=dt*(moving?7:1.2);
  let s=moving?Math.sin(g.userData.phase)*.38:Math.sin(g.userData.phase)*.035;
  g.userData.left.rotation.x=s;g.userData.right.rotation.x=-s;
  g.userData.a.rotation.x=-s;g.userData.b.rotation.x=s;
  if(g.userData.sign)g.userData.sign.position.set(g.position.x,g.position.y+2.64,g.position.z);
}

function updateHub(dt){
  let r=roundData;r.dayClock-=dt;
  if(r.dayClock<=0&&!r.night){r.night=true;assignAllNpcActivities();toast('Отбой! Свет в общежитии приглушён. Можно спать или выйти на вылазку.');}
  ambient.intensity=r.night?.48:.95;sun.intensity=r.night?.5:1.3;
  if(r.piggy)r.piggy.rotation.y=Math.sin(gameTime*.4)*.08;

  // Каждые 18 секунд часть NPC меняет занятия (общение -> еда -> туалет -> сон -> копилка)
  r.switchClock=(r.switchClock||0)+dt;
  if(r.switchClock>18){r.switchClock=0;assignAllNpcActivities();}

  if(r.hubNpcs){
    r.hubNpcs.forEach(u=>stepNpcToward(u,dt));
  }
  // Ближайшая реплика NPC для живой атмосферы в HUD
  let nearU=null, minD=5.5;
  (r.hubNpcs||[]).forEach(u=>{
    let d=Math.hypot(u.g.position.x-player.x,u.g.position.z-player.z);
    if(d<minD){minD=d;nearU=u;}
  });
  let chatter=nearU?`<br><span style="color:#8ef0cb">${esc(nearU.name)} (${ACT_LABELS[nearU.activity]}):</span> «${esc(nearU.line.slice(0,68))}${nearU.line.length>68?'…':''}»`:'';

  if(r.stealth){
    r.stealthTime-=dt;
    r.guards.forEach((g,i)=>{
      g.position.z=Math.sin(gameTime*.45+i*3)*10;
      g.rotation.y=Math.sin(gameTime*.4+i*2)*1.3+(i?Math.PI:0);
      animatePerson(g,true,dt);
      let dx=player.x-g.position.x,dz=player.z-g.position.z,d=Math.hypot(dx,dz),dot=(-Math.sin(g.rotation.y)*dx-Math.cos(g.rotation.y)*dz)/(d||1),range=keys.KeyC?5:8;
      if(d<range&&dot>.84&&!blockedLine(g.position.x,g.position.z,player.x,player.z)){
        r.stealthTime-=dt*5;
        if(!r.alert||gameTime-r.alert>2){r.alert=gameTime;hurt(10,'Охрана заметила тебя! Спрячься за койкой или в туалете.');}
      }
    });
    $('special').innerHTML=`Вылазка: <b>${r.crates}/3 ящика</b> · ${Math.ceil(r.stealthTime)} с${chatter}`;
    if(r.stealthTime<=0){state.daily['stealth'+state.day]=true;state.hp=Math.max(20,state.hp-12);save();buildDorm();toast('Обход охраны завершён. Припасы не получены.');}
  }else{
    let loc=player.x>14.8?'ТУАЛЕТ И ВЕНТИЛЯЦИЯ':'ЗАЛ ОБЩЕЖИТИЯ';
    $('special').innerHTML=`<b>${loc}</b> · ${r.night?'НОЧЬ · койка: сон/вылазка':`${state.round===0?'До первой игры':`Вечер дня ${state.day}`} · До отбоя ${Math.ceil(Math.max(0,r.dayClock))} с`} · <b>G</b> сводка NPC${chatter}`;
  }
}

function nearTarget(){
  let best=null,dist=3.2;
  interactions.forEach(t=>{
    if(t.mesh&&!t.mesh.visible)return;
    let d=Math.hypot(t.x-player.x,t.z-player.z);
    if(d<dist){dist=d;best=t;}
  });
  return best;
}
function interact(){
  if(mode==='tug')return tugCall();
  if(mode==='glass')return leadGlass();
  if(mode==='marbles'&&roundData.challenge==='aim')return marbleMenu();
  let t=nearTarget();
  if(t)t.fn();
  else if(mode==='hub')toast('Подойди ближе к NPC, стойке пайка, копилке, туалету или своей койке.');
}
function actionQ(){if(mode==='glass')inspectGlass();else if(mode==='final')finalCall();else if(mode==='hub')showDormOverview();else toast('Здесь нет активной способности Q.');}
function jump(){
  if(mode==='tug')return tugPull();
  if(mode==='marbles'&&roundData.challenge==='aim')return throwMarble();
  if(!['red','hub','glass','final','candy','marbles'].includes(mode))return;
  let floor=mode==='glass'?glassFloor():0;
  let cost=6*(allied('matvey')?.8:1);
  if(Math.abs(player.y-floor)<.12&&state.energy>=cost&&!keys.KeyC){
    player.vy=mode==='glass'?8.2:5.9;state.energy-=cost;beep(370,.03);
  }
}
function collides(x,z){return obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.34&&Math.abs(z-o.z)<o.d/2+.34);}
function move(dt){
  let oldX=player.x,oldZ=player.z;
  if(!['hub','red','candy','marbles','glass','final'].includes(mode))return false;
  if(mode==='marbles'&&roundData.challenge==='aim')return false;
  let f=(keys.KeyW?1:0)-(keys.KeyS?1:0)-(joyVec.active?joyVec.y:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0)+(joyVec.active?joyVec.x:0),len=Math.hypot(f,s);
  if(len){f/=len;s/=len;}
  let crouch=!!keys.KeyC,running=!!((keys.ShiftLeft||keys.ShiftRight)||(joyVec.active&&Math.hypot(joyVec.x,joyVec.y)>0.78))&&state.energy>3&&len&&!crouch,speed=(crouch?1.9:running?7.2:4.1)*(state.stimRound===state.round?1.16:1);
  if(mode==='glass')speed=crouch?1.7:running?7.4:4.4;
  if(state.hunger<20)speed*=.83;
  let dx=(-Math.sin(player.yaw)*f+Math.cos(player.yaw)*s)*speed*dt,dz=(-Math.cos(player.yaw)*f-Math.sin(player.yaw)*s)*speed*dt;
  let x=clamp(player.x+dx,bounds.minX,bounds.maxX),z=clamp(player.z+dz,bounds.minZ,bounds.maxZ);
  if(!collides(x,player.z))player.x=x;
  if(!collides(player.x,z))player.z=z;
  if(mode==='red'){
    for(let n of roundData.npcs||[]){
      if(!n.alive)continue;
      let nx=player.x-n.g.position.x,nz=player.z-n.g.position.z,nd=Math.hypot(nx,nz);
      if(nd<.7&&nd>.01){player.x+=nx/nd*(.7-nd)*.5;player.z+=nz/nd*(.7-nd)*.5;}
    }
  }
  let stim=state.stimRound===state.round;let drain=(mode==='final'?18:11)*(allied('matvey')?.8:1)*(allied('diver')?.7:1)*(stim?.35:1);
  if(running)state.energy=clamp(state.energy-dt*drain,0,100);
  else state.energy=clamp(state.energy+dt*(len?3:8)*(state.hunger>20?1:.5),0,100);
  let floor=mode==='glass'?glassFloor():0;
  player.vy-=dt*16;player.y+=player.vy*dt;
  if(player.y<=floor){player.y=floor;player.vy=0;}
  return Math.hypot(player.x-oldX,player.z-oldZ)>.003;
}
function updateHUD(){
  if(!state)return;
  $('day').textContent=`ДЕНЬ ${Math.min(6,state.day)} / 6`;
  $('round').textContent=mode==='hub'?(state.round===0?'ПЕРЕД ПЕРВОЙ ИГРОЙ':roundData.night?'НОЧЬ':'ВЕЧЕР ПОСЛЕ ИГРЫ'):mode==='ending'?'ВЫХОД':TITLES[Math.min(state.round,5)].toUpperCase();
  $('hpBar').style.width=`${clamp(state.hp,0,100)}%`;
  $('energyBar').style.width=`${clamp(state.energy,0,100)}%`;
  $('hungerBar').style.width=`${clamp(state.hunger,0,100)}%`;
  $('hpNum').textContent=Math.ceil(Math.max(0,state.hp));
  $('energyNum').textContent=Math.floor(state.energy);
  $('hungerNum').textContent=Math.floor(state.hunger);
  $('inventory').innerHTML=`<span onclick="eat()">Пайки <b>${state.food}</b></span><span onclick="drink()">Вода <b>${state.water}</b></span><span>Камешки <b>${state.probes}</b></span><span>Жетоны <b>${state.tokens}</b></span><span onclick="if(mode==='hub')showDormOverview()">Союз <b>${state.allies.length}/3</b></span>`;
  syncTouchUI();
  currentTarget=nearTarget();
  $('prompt').textContent=overlay?'':(currentTarget?currentTarget.title:'');
  $('crosshair').classList.toggle('hidden',overlay||mode==='carve');
  $('inventory').classList.toggle('hidden',mode==='carve');
}
function tick(){
  requestAnimationFrame(tick);
  let dt=Math.min(clock.getDelta(),.04);loopTime+=dt;
  if(messageTimeout&&loopTime>messageTimeout){$('toast').classList.remove('visible');messageTimeout=0;}
  if(started&&!paused){
    gameTime+=dt;
    if(keys.ArrowLeft)player.yaw+=dt*1.6;
    if(keys.ArrowRight)player.yaw-=dt*1.6;
    if(keys.ArrowUp)player.pitch=clamp(player.pitch+dt,-1.2,1.2);
    if(keys.ArrowDown)player.pitch=clamp(player.pitch-dt,-1.2,1.2);
    let moving=move(dt);
    if(mode==='hub')updateHub(dt);
    else if(mode==='red')updateRed(dt,moving);
    else if(mode==='carve')updateCarve(dt);
    else if(mode==='tug')updateTug(dt);
    else if(mode==='marbles')updateMarbles(dt);
    else if(mode==='glass')updateGlass(dt);
    else if(mode==='final')updateFinal(dt);
    if(state&&['hub','red','final'].includes(mode))state.hunger=clamp(state.hunger-dt*.028,0,100);
  }
  let head=keys.KeyC?.95:1.65,bob=!paused&&(keys.KeyW||keys.KeyS)&&mode!=='tug'&&mode!=='carve'?Math.sin(gameTime*9)*.035:0;
  camera.position.set(player.x,player.y+head+bob,player.z);
  camera.rotation.order='YXZ';camera.rotation.set(player.pitch,player.yaw,0);
  if(mode==='menu'){camera.position.set(14,10,22);camera.lookAt(0,2,-4);}
  if(mode==='ending'){camera.position.set(0,3,8);camera.lookAt(0,2,-8);}
  renderer.render(scene,camera);
  if(started)updateHUD();
}
let ambient,sun;
function init(){
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}
  catch(e){$('bootError').style.display='block';$('bootError').textContent='WebGL недоступен. Включи аппаратное ускорение в браузере и перезапусти его.';return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,isMobile?1.2:1.6));
  renderer.setSize(innerWidth,innerHeight);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  renderer.domElement.id='gameCanvas';
  $('viewport').appendChild(renderer.domElement);
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.06,160);
  clock=new THREE.Clock();
  ambient=new THREE.HemisphereLight(0xcbe5ff,0x5d4c44,.95);scene.add(ambient);
  sun=new THREE.DirectionalLight(0xffefce,1.3);sun.position.set(14,28,12);sun.castShadow=true;
  let sm=isMobile?512:1024;sun.shadow.mapSize.set(sm,sm);
  sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=45;sun.shadow.camera.bottom=-45;sun.shadow.camera.far=100;sun.shadow.bias=-.001;
  scene.add(sun);
  resetWorld(0x162b36);
  room(30,40,0x607d80,false,makeTex('dormFloor',8,11),makeTex('dormWall',6,2));
  buildPiggyBank(2);
  for(let side of [-1,1])for(let i=0;i<5;i++){
    let x=side*10,z=-13+i*6;
    box(x,.6,z,3,.35,4,0x355762);box(x,.85,z,2.8,.15,3.8,0xb4cbb9);
    box(x,2.4,z,3,.35,4,0x355762);box(x,2.65,z,2.8,.15,3.8,0xb4cbb9);
  }
  for(let i=0;i<12;i++)person(-8+(i%4)*5,-8+Math.floor(i/4)*5,0x268c7f,PEOPLE[i].num,false,{name:PEOPLE[i].name,hair:PEOPLE[i].hair});
  arch(-19);mainMenu();tick();
}
window.addEventListener('resize',()=>{if(!renderer)return;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
window.addEventListener('keydown',e=>{
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();
  if(overlay){
    if(e.code==='Escape'&&started&&['hub','carve','candy','marbles','tug','red','glass','final'].includes(mode)&&$('modalTitle').textContent==='Пауза'){closeModal();return;}
    let n=Number(e.key);if(n>=1&&n<=9)$('modalButtons').children[n-1]?.click();return;
  }
  if(e.code==='KeyP'||e.code==='Escape'){pauseMenu();return;}
  keys[e.code]=true;if(e.repeat)return;
  if(e.code==='KeyE')interact();
  if(e.code==='KeyQ')actionQ();
  if(e.code==='KeyF')eat();
  if(e.code==='KeyR'&&mode!=='carve')drink();
  if(e.code==='KeyG'&&mode==='hub')showDormOverview();
  if(e.code==='Space')jump();
  if(mode==='tug'){
    if(e.code==='KeyA')roundData.strategy=roundData.strategy==='power'?'steady':'endure';
    if(e.code==='KeyD')roundData.strategy=roundData.strategy==='endure'?'steady':'power';
  }
});
window.addEventListener('keyup',e=>keys[e.code]=false);
window.addEventListener('blur',()=>{keys={};if(started&&!overlay&&!showTouchUI())pauseMenu();});
window.addEventListener('mousemove',e=>{
  if(overlay||!started||mode==='carve')return;
  if(document.pointerLockElement===renderer?.domElement||inputMouse){
    player.yaw-=e.movementX*.0024;player.pitch=clamp(player.pitch-e.movementY*.0024,-1.25,1.25);
  }
});
window.addEventListener('pointerup',()=>inputMouse=false);
window.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerlockchange',()=>{keys={};if(!document.pointerLockElement&&started&&!overlay&&!changingLock&&mode!=='carve'&&!showTouchUI())pauseMenu();});
$('pauseButton').onclick=pauseMenu;
init();
if(renderer){
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(overlay)return;
    if(e.button===2)inputMouse=true;
    if(e.button===0){if(!document.pointerLockElement)lockPointer();if(mode==='final')finalAttack();}
  });
}

function initTouchControls(){
  $('prompt').addEventListener('click',e=>{e.stopPropagation();if(!overlay&&currentTarget)currentTarget.fn();});

  let jZone=$('joyZone'),jKnob=$('joyKnob'),joyTouchId=null;
  function updateJoy(clientX,clientY){
    let r=jZone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    let dx=clientX-cx,dy=clientY-cy,maxR=44,dist=Math.hypot(dx,dy);
    if(dist>maxR){dx=dx/dist*maxR;dy=dy/dist*maxR;}
    jKnob.style.transform=`translate(${dx}px,${dy}px)`;
    joyVec.x=Math.abs(dx)<5?0:dx/maxR;
    joyVec.y=Math.abs(dy)<5?0:dy/maxR;
    joyVec.active=Math.hypot(joyVec.x,joyVec.y)>0.08;
  }
  function resetJoy(){joyTouchId=null;joyVec={x:0,y:0,active:false};jKnob.style.transform='translate(0px,0px)';}

  jZone.addEventListener('touchstart',e=>{
    isMobile=true;e.preventDefault();e.stopPropagation();
    let t=e.changedTouches[0];joyTouchId=t.identifier;updateJoy(t.clientX,t.clientY);
  },{passive:false});
  jZone.addEventListener('touchmove',e=>{
    e.preventDefault();e.stopPropagation();
    for(let t of e.changedTouches)if(t.identifier===joyTouchId)updateJoy(t.clientX,t.clientY);
  },{passive:false});
  jZone.addEventListener('touchend',e=>{
    for(let t of e.changedTouches)if(t.identifier===joyTouchId)resetJoy();
  });
  jZone.addEventListener('touchcancel',resetJoy);

  let lookTouchId=null,lastLX=0,lastLY=0;
  if(renderer?.domElement){
    renderer.domElement.addEventListener('touchstart',e=>{
      isMobile=true;syncTouchUI();
      if(overlay||mode==='carve')return;
      for(let t of e.changedTouches){
        if(lookTouchId===null&&t.identifier!==joyTouchId){
          lookTouchId=t.identifier;lastLX=t.clientX;lastLY=t.clientY;
        }
      }
    },{passive:true});
    renderer.domElement.addEventListener('touchmove',e=>{
      if(overlay||mode==='carve')return;
      for(let t of e.changedTouches){
        if(t.identifier===lookTouchId){
          let dx=t.clientX-lastLX,dy=t.clientY-lastLY;
          lastLX=t.clientX;lastLY=t.clientY;
          player.yaw-=dx*.0052;
          player.pitch=clamp(player.pitch-dy*.0042,-1.15,1.15);
        }
      }
    },{passive:true});
    const endLook=e=>{for(let t of e.changedTouches)if(t.identifier===lookTouchId)lookTouchId=null;};
    renderer.domElement.addEventListener('touchend',endLook);
    renderer.domElement.addEventListener('touchcancel',endLook);
  }

  function bindBtn(id,onDown,onUp){
    let b=$(id);if(!b)return;
    const start=e=>{isMobile=true;e.preventDefault();e.stopPropagation();b.classList.add('active');onDown();};
    const end=e=>{e.preventDefault();e.stopPropagation();b.classList.remove('active');if(onUp)onUp();};
    b.addEventListener('touchstart',start,{passive:false});
    b.addEventListener('touchend',end,{passive:false});
    b.addEventListener('touchcancel',end,{passive:false});
    b.addEventListener('mousedown',start);
    b.addEventListener('mouseup',end);
  }
  bindBtn('btnAct',()=>{keys.KeyE=true;interact();},()=>{keys.KeyE=false;});
  bindBtn('btnJump',()=>jump());
  bindBtn('btnCrouch',()=>{
    if(mode==='marbles'&&roundData.challenge==='aim'){
      roundData.aimPower=roundData.aimPower>=0.95?0.45:clamp((roundData.aimPower||0.65)+0.15,0.35,1);
      toast(`Сила броска: ${Math.round(roundData.aimPower*100)}%`);
    }else keys.KeyC=true;
  },()=>{keys.KeyC=false;});
  bindBtn('btnSkill',()=>{
    if(mode==='tug'){
      roundData.strategy=roundData.strategy==='power'?'steady':roundData.strategy==='steady'?'endure':'power';
      toast('Тактика каната изменена.');
    }else if(mode==='marbles'&&roundData.challenge==='aim'){
      roundData.aimAngle=(roundData.aimAngle||0)>=0.32?-0.32:((roundData.aimAngle||0)+0.16);
      toast(`Угол броска: ${Math.round((roundData.aimAngle||0)*57)}°`);
    }else actionQ();
  });
  bindBtn('btnExtra',()=>{if(mode==='final')finalAttack();});
}
initTouchControls();

window.LastTrial={get state(){return state},get mode(){return mode},get player(){return player},get round(){return roundData},begin,startRound,buildDorm,closeModal,win,save,drawCarve,showDormOverview,assignAllNpcActivities};
