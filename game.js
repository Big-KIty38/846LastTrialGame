'use strict';
/* Последний раунд v2.0: расширенная 3D-игра с живыми NPC, туалетом, копилкой и реакциями по мотивам сериала. */
const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;

const PEOPLE=[
  {id:'mina',name:'Мина',num:'067',role:'Наблюдатель и разведчица',hair:'bob',skin:0xe2bfa4,
   tip:'Во время красного сигнала спрячься за бетонным блоком или колонной: кукла не видит сквозь укрытие.',
   reactions:[
     'Держится особняком у стены и проверяет карманы. «Не смотри так. Здесь каждый сам за себя, пока не докажет обратное».',
     'Смотрит на золотую копилку под потолком. «Половина зала осталась на том поле... Зато теперь ясно, откуда берутся эти миллиарды».',
     'Отряхивает сахарную крошку с рукава. «Я лазила по вентиляции в туалете. Охрана что-то плавила в котлах — так я и поняла про сахар».',
     'Трёт обожжённые канатом ладони. «Если бы не шаг вперёд и общий ритм, мы бы уже лежали на дне шахты. Сегодня ночью не спи крепко».',
     'Молча сидит у койки, глядя в одну точку после игры в шарики. «Ася улыбнулась и специально бросила шарик мимо... Я обязана дойти до конца».',
     'Прижимает руку к боку после взрыва стеклянного моста. «Осталось совсем мало людей. Не поворачивайся спиной к тем, кто жаждет весь приз».'
   ]},
  {id:'ivan',name:'Иван',num:'199',role:'Опора команды',hair:'short',skin:0xc89a78,
   tip:'В канате важнее ритм и вовремя взятый упор (C), чем беспорядочные рывки. Дай выносливости восстановиться.',
   reactions:[
     'Оглядывает многоярусные койки. «Нам сказали, это просто игры ради выплаты долгов. Главное — не терять человеческое лицо».',
     'До сих пор тяжело дышит после бега под прицелом куклы. «Я успел удержать игрока за шиворот на красном сигнале... Руки до сих пор гудят».',
     'Аккуратно складывает пустую жестяную коробочку. «Мне достался круг. Хорошо, что руки привыкли к тяжёлой, но точной работе».',
     'Проверяет узлы и перевязывает запястье. «На башне было страшно смотреть вниз, но когда команда тянет в один такт — даже слабые держат строй».',
     'Виновато опускает глаза. «Мы ведь шли парами как друзья... Никто не думал, что из каждой пары вернётся только один».',
     'Смотрит на опустевший зал общежития. «Столько пустых коек. Давай держаться вместе хотя бы до последнего раунда».'
   ]},
  {id:'lev',name:'Лев',num:'218',role:'Хладнокровный стратег',hair:'glasses',skin:0xdcb89d,
   tip:'На финальной площадке можно победить тактикой: активируй три контрольные точки или используй отвлечение.',
   reactions:[
     'Поправляет очки и считает людей в зале. «Четыреста пятьдесят шесть человек. Вероятность выйти отсюда в одиночку ничтожна — нужны расчёт и дисциплина».',
     'Изучает цифровое табло над дверью. «За каждого выбывшего в копилку падает сто миллионов вон. Половина хочет уйти, половина вернётся из-за долгов».',
     'Холодно усмехается. «Я догадался про растопленный сахар ещё утром, но каждый сам выбирал себе фигуру. Таковы правила отбора».',
     'Смотрит на верхние ярусы коек. «В канате решает физика рычага и синхронность. А ночью — позиция, которую невозможно обойти со спины».',
     'Сжимает мешочек с шариками. «В критический момент выживает тот, кто меняет правила переговоров, а не надеется на слепую удачу».',
     'Чистит куртку от стеклянной пыли. «На мосту колебание стоило жизни. Остался последний круг — там не будет места сантиментам».'
   ]},
  {id:'asya',name:'Ася',num:'240',role:'Ловкие руки',hair:'bun',skin:0xe6c3aa,
   tip:'В сахарном печенье держи иглу строго на контуре. Вода смягчает карамель, а короткие паузы снимают нагрузку.',
   reactions:[
     'Сидит на краю матраса, болтая ногами. «Забавно: все такие серьёзные, будто мы не в детских спортивных костюмах».',
     'Глядит на закрытые розовые двери. «Я видела, как люди падали в панике. Если бежать толпой, тебя просто толкнут в спину».',
     'Показывает тонкую иглу. «Руки даже не дрогнули! Главное — не давить слишком сильно на углах звезды и зонтика».',
     'Садится рядом с Миной. «Никто не верил в нашу команду на башне, потому что у нас не было одних силачей. А мы взяли хитростью!»',
     'Тихо улыбается в переулке. «Знаешь, у тебя есть ради чего возвращаться наружу. А я хотя бы сама выберу, как закончится моя партия».',
     'Её голос звучит как воспоминание союзника: «Не сдавайся на последнем шаге. Ты уже прошёл слишком далеко».'
   ]},
  {id:'boris',name:'Борис',num:'101',role:'Главарь банды и риск',hair:'buzz',skin:0xd1a788,
   tip:'Проверить стекло камешком или пустить кого-то вперёд безопаснее, чем прыгать вслепую.',
   reactions:[
     'Разминает кулаки у прохода. «Тут полно слабаков. Кто будет стоять у меня на пути — вылетит ещё до сигнала охраны».',
     'Громко смеётся, глядя на пачки денег в копилке. «Вот это я понимаю банк! Пусть трусы голосуют за выход, я отсюда пустым не уйду».',
     'Вылизывает остатки карамели с крышки. «Чуть зонтик не сломал! Зато теперь я знаю: лишний паёк на раздаче достаётся тем, кого боятся».',
     'Сбивает кулаки после каната. «Мои парни вытащили раунд чистой массой. А ночью посмотрим, кто плохо охраняет свои припасы».',
     'Хмуро перебрасывает стеклянный шарик. «Думали загнать меня в угол дурацкими ставками? Я всегда найду способ перевернуть игру».',
     'Нервно косится на стеклянный мост. «Впереди двенадцать пролётов над пропастью. Пусть впереди идут те, кто любит геройствовать».'
   ]},
  {id:'tim',name:'Тим',num:'001',role:'Старый мастер',hair:'grey',skin:0xd8b79e,
   tip:'В шариках можно договориться с настоящим другом. Но доверие строится заранее — разговорами и поступками.',
   reactions:[
     'Добродушно улыбается у нижней койки. «Давно я не видел столько людей сразу. В моём детстве мы играли в такие игры во дворе каждый день».',
     'Восторженно вспоминает поле с куклой. «Пока все боялись, я впервые за много лет почувствовал, что по-настоящему живу!»',
     'Смачивает край сахарной пластинки. «Секрет прост: если карамель подтает с обратной стороны, даже зонтик выйдет целиком».',
     'Поднимает палец вверх. «В перетягивании каната главное — первые десять секунд лечь назад, переждать напор, а потом сбить чужой ритм».',
     'Смотрит на глиняные стены улочек. «Этот переулок так похож на мой старый дом... Мы ведь с тобойкганбу — друзья, у которых всё общее, верно?»',
     'Спокойно смотрит на последние ворота. «Какой бы путь ты ни выбрал в финале — покажи, остался ли в тебе человек».'
   ]},
  {id:'dana',name:'Дана',num:'017',role:'Мастер-стекольщик',hair:'grey',skin:0xd9b59a,
   tip:'Закалённое стекло чуть иначе преломляет свет на кромке и звучит чище при ударе. Нажми Q перед прыжком.',
   reactions:[
     'Протирает руки ветошью. «Тридцать лет я проработал на стекольном заводе. Не думал, что старость встречу в таком месте».',
     'Прислушивается к гулу вентиляции. «Охрана ведёт нас по коридорам как по лабиринту. Нужно беречь силы и внимательно смотреть под ноги».',
     'Осторожно держит сахарный диск на свет. «Даже в карамели видны внутренние напряжения. Где пузыри — там и пойдёт трещина».',
     'Держится за поручень койки. «Высота мне знакома, я остеклял высотки. Главное — не смотреть в бездну под ногами».',
     'Бережно катает стеклянный шарик на ладони. «Чистое натриевое стекло без пузырьков. Когда-то я делал такие для внуков».',
     'Всматривается в пролёты моста. «Закалённое стекло обжигают при шестистах градусах: на его грани есть лёгкая волна. Со мной ты её увидишь».'
   ]},
  {id:'vera',name:'Вера',num:'212',role:'Интриганка и обмен',hair:'curly',skin:0xe4bea3,
   tip:'Умеет договариваться об обмене и прятать припасы в кабинке туалета. В союзе приносит +1 дополнительный жетон за раунд.',
   reactions:[
     'Поправляет кудрявые волосы у двери в туалет. «Эй,456-й! Держись ближе к умным людям — тут в одиночку долго не протянешь».',
     'Кричит у табло голосования. «Вы с ума сошли?! Там наверху миллиарды, но если нас всех положат в гробы с бантиком — кому они достанутся?!»',
     'Шепчется у раковин в туалете. «Я спрятала заначку за трубой в крайней кабинке. Если прикроешь от охраны — поделимся!»',
     'Вытирает пот со лба после каната. «Я же говорила, что старик знает хитрость! Кто смеётся последним — тот и ужинает».',
     'Скрещивает руки на груди. «Все вдруг стали такими благородными в парах, а как запахло выбыванием — сразу вспомнили арифметику».',
     'Смотрит на стеклянные плиты. «Кто нас предавал — сам полетит вниз. Главное, не спеши прыгать первым!»'
   ]},
  {id:'dok',name:'Доктор',num:'111',role:'Полевой врач',hair:'glasses',skin:0xd7b69f,
   tip:'Может подлечить тебя в общежитии (+25 здоровья раз за перерыв) и знает расписание ночных обходов охраны.',
   reactions:[
     'Нервно трёт переносицу. «Я хирург... Одна ошибка в клинике, огромные иски — и вот я здесь в зелёной робе».',
     'Осматривает ссадины участников. «Пульс у половины зала под сто сорок. Без воды и нормального сна люди начнут падать сами».',
     'Понижает голос. «Охранники в треугольниках и квадратах не все одинаковые. Некоторые торгуют информацией в обмен на помощь».',
     'Перевязывает растяжения после каната. «Перед следующей игрой обязательно выспись. Переутомление снижает реакцию вдвое».',
     'Хмуро смотрит на часы. «Охрана стала нервной. Если пойдёшь ночью за ящиками — держись в тени за каркасами коек».',
     'Протягивает перевязочный пакет. «В финале каждый удар может стать решающим. Подлечись, пока есть минута тишины».'
   ]},
  {id:'matvey',name:'Матвей',num:'069',role:'Семейный защитник',hair:'short',skin:0xd9b396,
   tip:'Держится рядом с женой Еленой (№070). В союзе укрепляет дух команды: бег и прыжки расходуют на 20% меньше сил.',
   reactions:[
     'Крепко держит за руку №070. «Мы с женой пришли сюда вместе, потому что кредиторы забрали всё. Мы и выйдем отсюда только вдвоём».',
     'Стоит у кнопки голосования. «Мы голосовали за то, чтобы остановить это безумие, но снаружи у нас не осталось даже крыши над головой».',
     'Делит паёк пополам с Еленой. «Пока мы делимся друг с другом хлебом и водой, эти стены не превратят нас в зверей».',
     'Строит укрытие у нижних коек. «На канате мы устояли плечом к плечу. Ночью будем дежурить по очереди».',
     'Сидит, обхватив голову руками. «В четвёртой игре нам велели встать в пары с самыми близкими... Почему никто не предупредил, что это дуэль?!»',
     'Смотрит пустым взглядом на табло. «Если ты дойдёшь до выхода,456-й... не дай организаторам думать, что они всё про нас знают».'
   ]},
  {id:'elena',name:'Елена',num:'070',role:'Хранительница пайков',hair:'bun',skin:0xe5c2a8,
   tip:'Бережно распределяет еду. В союзе каждый съеденный паёк восстанавливает дополнительно +12 здоровья и +12 сил.',
   reactions:[
     'Успокаивает дрожащих участников. «Не кричите друг на друга. Если мы перессоримся в первый же день, охране даже делать ничего не придётся».',
     'Прижимает ладони к лицу, глядя на копилку. «Там, внизу на песке, остались живые люди... Никакие деньги не стоят такого».',
     'Аккуратно разливает воду. «Не пей всё залпом. Глоток воды во время вырезания сахара спасёт тебе жизнь».',
     'Подбадривает команду после башни. «Я боялась даже взглянуть вниз с платформы, но твой голос помог удержать ритм».',
     'Тихо прощается в переулке с шариками. «Кто-то из нас должен остаться и сохранить память о тех, кто был рядом».',
     'Её совет помогает беречь припасы перед финалом: «Даже один сохранённый паёк на мосту или в круге даст силы для последнего рывка».'
   ]},
  {id:'arkady',name:'Аркадий',num:'244',role:'Проповедник',hair:'short',skin:0xd4b094,
   tip:'Сохраняет хладнокровие под давлением. В союзе даёт +12 секунд дополнительного времени в испытаниях.',
   reactions:[
     'Складывает руки в молитве посреди зала. «Это место — испытание нашей совести. Каждый шаг покажет, чего стоит человек».',
     'Смотрит на розовых солдат у ворот. «Они прячут лица за геометрическими фигурами, но боятся собственной системы не меньше нас».',
     'Разглядывает рисунки на стенах за койками. «Посмотри на стены общежития! Когда уберут лишние койки, станет видно: все шесть игр нарисованы прямо здесь!»',
     'Стоит на краю платформы после каната. «Благодарите за каждый прожитый вечер. Но не забывайте тех, кто сорвался вниз».',
     'Перебирает шарики как чётки. «Жадность губит быстрее, чем неверный бросок. Тот, кто ставит всё сразу, остаётся ни с чем».',
     'Указывает на стеклянный мост. «Сделай шаг с чистой головой — суета на краю пропасти губит вернее хрупкого стекла».'
   ]}
];

const CROWD_NUMS=['014','028','043','062','085','096','118','130','151','174','196','229','250','278','303','322','355','411'];
const SURVIVOR_COUNTS=[456,201,108,40,16,4,1];
const PRIZE_BILLIONS=['0.0','25.5','34.8','41.6','44.0','45.2','45.6'];
const TITLES=['Тише едешь','Сахарная фигура','Перетягивание каната','Десять шариков','Стеклянный мост','Последний круг'];

let state=null, mode='menu', overlay=true, paused=true, roundData={}, started=false, currentNpc=null;
let world, scene, camera, renderer, clock, player={x:0,z:0,y:0,vy:0,yaw:0,pitch:0}, bounds={}, obstacles=[], interactions=[], actors=[], items=[], keys={}, inputMouse=false, currentTarget=null, loopTime=0, messageTimeout=0, gameTime=0, audioCtx=null, soundOn=true, changingLock=false;
const SAVE='last-trial-save-v1', PREF='last-trial-options-v1';
let difficulty='normal';try{let p=JSON.parse(localStorage.getItem(PREF)||'{}');difficulty=p.difficulty||'normal';soundOn=p.sound!==false;}catch(e){}

function freshState(){
  return {
    version:1,round:0,day:1,hp:100,energy:100,hunger:85,food:2,water:1,probes:3,tokens:0,
    trust:Object.fromEntries(PEOPLE.map(n=>[n.id,0])),allies:[],daily:{},completed:[],secrets:[],
    vote:'none',ventScouted:{},muralRead:false,difficulty
  };
}
function ensureState(s){
  let base=freshState(), merged={...base,...s};
  merged.trust={...base.trust,...(s.trust||{})};
  merged.ventScouted=s.ventScouted||{};
  return merged;
}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state));return true;}catch(e){toast('Браузер запретил сохранение. Экспортируй файл через меню паузы.');return false;}}
function load(){try{const s=JSON.parse(localStorage.getItem(SAVE)||'null');if(s&&s.version===1&&s.round>=0&&s.round<=6)return ensureState(s);}catch(e){}return null;}
function beep(freq=450,dur=.09,type='sine',vol=.055){if(!soundOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur);}catch(e){}}
function toast(t){$('toast').textContent=t;$('toast').classList.add('visible');messageTimeout=loopTime+5;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function setObjective(title,text){$('objectiveTitle').textContent=title;$('objectiveText').textContent=text;}
function closeModal(lock=true){overlay=false;paused=false;keys={};$('modal').classList.remove('open');$('carvePanel').classList.toggle('open',mode==='carve');if(lock&&started&&mode!=='carve')lockPointer();}
function openModal(title,body,buttons=[],tag=''){keys={};roundData.down=false;changingLock=true;document.exitPointerLock?.();setTimeout(()=>changingLock=false,100);overlay=true;paused=true;$('modal').classList.add('open');$('modalTag').textContent=tag;$('modalTitle').textContent=title;$('modalBody').innerHTML=body;$('modalButtons').innerHTML='';buttons.forEach((b,i)=>{let el=document.createElement('button');el.className=b.primary?'primary':'';el.textContent=`${i<9?i+1+'. ':''}${b.text}`;el.onclick=b.fn;$('modalButtons').appendChild(el);});}
function lockPointer(){try{let p=renderer.domElement.requestPointerLock?.();if(p&&p.catch)p.catch(()=>{});}catch(e){}}

function mainMenu(){
  mode='menu';started=false;$('hud').classList.add('hidden');$('carvePanel').classList.remove('open');
  const checkpoint=load();
  openModal('ПОСЛЕДНИЙ РАУНД · v2.0',
    `<p class="lead">Шесть испытаний. Живое общежитие. Один шанс сохранить себя.</p>
     <p>Обновлённая 3D-игра по мотивам сериала: 30+ участников в зале, золотая копилка под потолком, табло выживших, настенные рисунки всех игр, туалет с вентиляционной шахтой и живые NPC, которые общаются друг с другом, едят, спят, ходят в туалет и реагируют на события каждого дня.</p>
     <div class="menuInfo">
       <b>WASD</b> движение · <b>мышь</b> обзор · <b>E</b> говорить / действие<br>
       <b>Shift</b> бег · <b>C</b> присесть / блок · <b>Space</b> прыжок / рывок<br>
       <b>Q</b> способность / проверка · <b>F</b> паёк · <b>R</b> вода · <b>G</b> сводка зала · <b>Esc / P</b> пауза
     </div>
     <p class="small">Для ПК с клавиатурой и мышью. Если захват мыши недоступен: удерживай ПКМ для обзора или используй стрелки.</p>`,
    [
      {text:'Новая игра',primary:true,fn:()=>{
        if(checkpoint){
          openModal('Начать заново?','<p>Текущее сохранение будет заменено.</p>',[
            {text:'Начать',primary:true,fn:()=>begin(false)},
            {text:'Назад',fn:mainMenu}
          ]);
        }else begin(false);
      }},
      ...(checkpoint?[{text:`Продолжить · день ${Math.min(6,checkpoint.day)}`,fn:()=>begin(true)}]:[]),
      {text:'Настройки',fn:settings},
      {text:'Импорт сохранения',fn:importSave}
    ],
    'РАСШИРЕННОЕ ИЗДАНИЕ 2.0'
  );
}
function settings(){
  openModal('Настройки',
    `<p>Сложность: <b>${difficulty==='easy'?'Мягкая':'Обычная'}</b>. Мягкая даёт больше времени, меньше урона и прощает неточные действия.</p>
     <p>Звук: <b>${soundOn?'включён':'выключен'}</b>. Синтезированные эффекты, без заимствованной музыки.</p>`,
    [
      {text:'Сменить сложность',fn:()=>{difficulty=difficulty==='easy'?'normal':'easy';if(state)state.difficulty=difficulty;storePrefs();let cp=load();if(cp){cp.difficulty=difficulty;try{localStorage.setItem(SAVE,JSON.stringify(cp));}catch(e){}}settings();}},
      {text:'Переключить звук',fn:()=>{soundOn=!soundOn;storePrefs();settings();}},
      {text:'Назад',primary:true,fn:()=>started?pauseMenu():mainMenu()}
    ]
  );
}
function storePrefs(){try{localStorage.setItem(PREF,JSON.stringify({difficulty,sound:soundOn}));}catch(e){}}
function begin(cont){state=cont?load():freshState();if(!state)state=freshState();state=ensureState(state);difficulty=state.difficulty||difficulty;started=true;$('hud').classList.remove('hidden');if(state.round===6)ending();else buildDorm();}
function exportSave(){let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Последний-раунд-сохранение.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importSave(){let input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=async()=>{try{let s=JSON.parse(await input.files[0].text());if(s.version!==1||!Number.isInteger(s.round)||s.round<0||s.round>6||!s.trust||!Array.isArray(s.allies))throw Error();state=ensureState(s);save();begin(true);}catch(e){toast('Не удалось прочитать сохранение этой игры.');}};input.click();}
function pauseMenu(){
  if(!started)return;
  openModal('Пауза',
    `<p>День ${Math.min(6,state.day)} · ${mode==='hub'?'общежитие и туалет':TITLES[state.round]||'финал'}</p>
     <p class="small">Сохранение — контрольная точка общежития. При загрузке испытание начинается заново, а не с середины.</p>`,
    [
      {text:mode==='dead'?'Повторить испытание':'Продолжить',primary:true,fn:()=>{if(mode==='dead'){state=load()||state;state.difficulty=difficulty;startRound();}else closeModal();}},
      ...(mode==='hub'?[{text:'Сводка действий NPC в зале (G)',fn:showDormOverview}]:[]),
      {text:'Экспорт контрольной точки',fn:()=>{if(mode==='hub')save();const live=state;state=load()||state;exportSave();state=live;}},
      {text:'Настройки',fn:settings},
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
    let hairColor=opts.hair==='grey'?0xcfd5d8:0x272321;
    box(0,2.16,.02,.52,.15,.44,hairColor,bodyGroup);
    if(opts.hair==='bob'){
      box(-.25,1.96,.02,.09,.36,.36,hairColor,bodyGroup);
      box(.25,1.96,.02,.09,.36,.36,hairColor,bodyGroup);
    }else if(opts.hair==='bun'){
      sphere(0,2.24,.22,.14,hairColor,bodyGroup);
    }else if(opts.hair==='curly'){
      sphere(-.22,2.08,.02,.13,hairColor,bodyGroup);
      sphere(.22,2.08,.02,.13,hairColor,bodyGroup);
    }else if(opts.hair==='glasses'){
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
    let s=label(opts.name?`${opts.name} · №${number}`:`№${number}`,x,2.62,z,.27);
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
    ['№218 Лев: Тут 456 человек, и у каждого долги на сотни миллионов.','№001 Тим: Зато игры детские! Главное — не паниковать раньше времени.'],
    ['№101 Борис: Эй, 067-я, ещё раз подойдёшь к моим карманам — пожалеешь!','№067 Мина: Держи свои гроши при себе, громила.'],
    ['№069 Матвей: Держись за меня, Лена. Мы пройдём всё вместе.','№070 Елена: Главное — не терять друг друга в толпе.'],
    ['№212 Вера: Кто здесь самый сильный? Надо держаться победителей!','№111 Доктор: Здесь нужна не только сила, но и холодная голова.']
  ],
  [
    ['№212 Вера: Вы видели эту куклу?! Датчики ловят малейший вдох!','№199 Иван: Если идти за спиной впереди идущего — луч тебя не видит.'],
    ['№218 Лев: За каждого выбывшего в свинью падает сто миллионов вон.','№069 Матвей: Мы обязаны нажать крестик на голосовании и уйти!'],
    ['№101 Борис: Уйти?! Снаружи нас ждут коллекторы, а тут — миллиарды!','№067 Мина: Пусть кричат. Ночью надо следить за охраной.'],
    ['№001 Тим: А мне понравилось бежать! Впервые за годы не болела голова.','№240 Ася: Дедушка, вы сумасшедший, но с вами не так страшно.']
  ],
  [
    ['№067 Мина: Я видела через вентиляцию в туалете: утром плавили сахар.','№218 Лев: Я знал, но каждый сам выбирал себе фигуру на стене.'],
    ['№101 Борис: Кто взял вторую порцию на раздаче?! Тут не хватает пайков!','№111 Доктор: Охрана специально дала меньше еды, чтобы стравить нас.'],
    ['№240 Ася: Если смочить карамель водой, игла идёт как по маслу.','№067 Мина: Спасибо. В следующем раунде держимся рядом.'],
    ['№244 Аркадий: Посмотрите на стены за койками! Там нарисованы все игры!','№017 Дана: Точно... Следующий рисунок похож на башни с канатом.']
  ],
  [
    ['№001 Тим: На канате мы легли назад и сбили им шаг! Старый способ работает!','№199 Иван: И три шага вперёд на краю спасли всю десятку.'],
    ['№218 Лев: Сегодня ночью погасят свет. Борис собирает людей для нападения.','№069 Матвей: Нужно дежурить у коек и не отходить в темноту поодиночке.'],
    ['№212 Вера: Ночью в туалете безопаснее, чем в центре зала!','№067 Мина: Или за верхними ярусами коек, куда трудно забраться.']
  ],
  [
    ['№069 Матвей: Нам сказали встать в пары с друзьями... а заставили играть на выбывание.','№199 Иван: Я до сих пор не могу смотреть на мешочек с шариками...'],
    ['№067 Мина: Ася специально оставила свой шарик на земле, чтобы я прошла...','№218 Лев: Она сделала свой выбор. Если сдашься сейчас — её жертва напрасна.'],
    ['№017 Дана: Осталось шестнадцать человек. Следующий рисунок — мост через пропасть.','№101 Борис: Пусть впереди идут самые умные, а я пойду следом!']
  ],
  [
    ['№017 Дана: Они приглушили свет на мосту, чтобы я не видел блик закалённого стекла...','№067 Мина: Но мы всё равно нашли путь через двенадцать пролётов.'],
    ['№218 Лев: Впереди последний круг на песке. Победит либо сила, либо расчёт.','№001 Тим: Даже на последней линии помни, ради чего ты остался человеком.']
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
      state.round===0?'День 1: прибытие в общежитие':`Вечер дня ${state.day}: реакция зала`,
      `<p>${state.round===0
        ?'Ты — участник №456. В огромном зале сотни людей в зелёных костюмах, под потолком висит прозрачная копилка, а справа открыт проход в туалет с вентиляционной шахтой.'
        :`Испытание «${TITLES[state.round-1]}» завершено. На цифровом табло осталось <b>${SURVIVOR_COUNTS[state.round]}</b> участников, а в золотую копилку упали новые миллиарды вон.`}</p>
       <p><b>Живое общежитие (v2.0):</b> участники общаются парами, стоят в очереди за пайком и едят, уходят в туалет к раковинам и вентиляции, спят на койках и бурно обсуждают случившееся.</p>
       <p>Подойди к любому NPC и нажми <b>E</b> (или нажми <b>G</b> для сводки всех событий в зале). Твоя койка переводит время через сон к утренней игре.</p>`,
      [{text:'Войти в зал общежития',primary:true,fn:()=>closeModal()}],
      'КОНТРОЛЬНАЯ ТОЧКА · ОБЩЕЖИТИЕ'
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
    [1.8,6.5],[19.2,-3.8],[-2.5,9.5],[-7.0,1.0],[2.8,1.2],[-1.8,-6.2]
  ];
  PEOPLE.forEach((n,i)=>{
    let [x,z]=baseSpots[i]||[0,0];
    let g=person(x,z,0x1f8778,n.num,false,{name:n.name,hair:n.hair,skin:n.skin});
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
    let g=person(x,z,0x247c70,num,false,{hair:i%3===0?'bob':i%2?'short':'bun'});
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
    if((u.id==='mina'||u.id==='vera')&&mod!==1)mod=1;
    if(r.night&&i%2===0)mod=2; // ночью больше спящих
    if(mod===0){
      let [ex,ez]=eatSpots[i%eatSpots.length];
      u.activity='eat';u.tx=ex;u.tz=ez;
      u.line=u.named?u.npc.reactions[clamp(state.round,0,5)]:EAT_LINES[i%EAT_LINES.length];
    }else if(mod===1){
      let [tx,tz]=toiletSpots[i%toiletSpots.length];
      u.activity='toilet';u.tx=tx;u.tz=tz;
      u.line=u.id==='mina'?'Проверяет вентиляционную решётку в туалете: «Отсюда слышно охрану...»':TOILET_LINES[i%TOILET_LINES.length];
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
  if(!r.initializedPositions){
    r.initializedPositions=true;
    r.hubNpcs.forEach(u=>{u.g.position.set(u.tx,0,u.tz);});
  }
  r.hubNpcs.forEach(u=>{stepNpcToward(u,0.016);refreshNpcSign(u);});
}

function refreshNpcSign(u){
  let tag=ACT_LABELS[u.activity]||'';
  let title=u.named?`${u.name} №${u.num} · ${tag}`:`№${u.num} · ${tag}`;
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
  let found=!state.daily[k]&&(allied('vera')||state.trust.vera>=1);
  if(found){
    state.daily[k]=true;
    state.tokens+=1;
    state.probes+=1;
    save();
    beep(680,.12);
  }
  openModal('Кабинки туалета',
    `<p>В кабинках участники прячутся от камер наблюдения и пересчитывают припасы. Здесь Вера (№212) и Мина (№067) прячут найденные мелочи за трубами.</p>
     <p>${found?'<b>Ты нашёл тайник Веры за трубой:</b> +1 жетон обмена и +1 камешек для проверки стекла!':'Если подружиться с Верой (№212), она подскажет, в какой кабинке спрятана заначка на этот перерыв.'}</p>`,
    [{text:'Вернуться в туалет',primary:true,fn:()=>closeModal()}],
    'ЛОКАЦИЯ · КАБИНКИ'
  );
}

function useRestroomVent(){
  let rIdx=clamp(state.round,0,5);
  let canScout=allied('mina')||state.trust.mina>=1||state.muralRead;
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
       :'Решётка высоко. Поговори с Миной (№067) или изучи рисунки на стенах зала, чтобы узнать, как безопасно заглянуть в шахту.'}</p>`,
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
     <p class="small">Голосование влияет на реплики NPC: сторонники «Х» (Матвей, Елена, Иван) больше доверяют за выбор Х, а азартные игроки (Борис, Лев, Вера) уважают выбор О.</p>`,
    [
      {text:'Нажать красную кнопку Х (За жизнь и союз)',primary:state.vote!=='X',fn:()=>{
        state.vote='X';
        ['matvey','elena','ivan'].forEach(id=>state.trust[id]=clamp((state.trust[id]||0)+1,0,5));
        save();beep(580,.1);toast('Ты нажал Х. Матвей, Елена и Иван прониклись к тебе уважением.');inspectPiggyVote();
      }},
      {text:'Нажать синюю кнопку О (Идти за призом)',primary:state.vote==='X',fn:()=>{
        state.vote='O';
        ['boris','lev','vera'].forEach(id=>state.trust[id]=clamp((state.trust[id]||0)+1,0,5));
        save();beep(480,.1);toast('Ты нажал О. Лев, Борис и Вера оценили твою решимость.');inspectPiggyVote();
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
      {text:'Переключить сцену / сменить занятия NPC',primary:true,fn:()=>{gameTime+=17;roundData.initializedPositions=false;assignAllNpcActivities();showDormOverview();}},
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
  let partnerTxt=u&&u.activity==='talk_pair'&&u.partner?` с <b>${esc(u.partner.name)} (№${u.partner.num})</b>`:'';
  let reaction=n.reactions?.[clamp(state.round,0,5)]||n.tip;
  let ctxLabel=u?.activity==='toilet'?'Поговорить наедине в туалете':u?.activity==='eat'?'Разделить трапезу у стойки':u?.activity==='sleep'?'Проверить сон у койки':u?.activity==='talk_pair'&&u.partner?`Вступить в разговор с ${u.partner.name}`:'Обсудить копилку и обстановку';

  openModal(`${n.name} · №${n.num}`,
    `<p class="lead">${n.role} · <span style="color:#75e1ba">${act}</span>${partnerTxt}</p>
     <p>Доверие: <b>${r}/5</b> ${ally?'· <b>в твоём союзе</b>':''}</p>
     <p><b>Реакция на события (День ${state.day}):</b><br>«${esc(reaction)}»</p>
     <p class="small">Разговор и подарок повышают доверие раз за перерыв. Союз требует 2 доверия (максимум 3 активных союзника). Ты также можешь присоединиться к текущему занятию персонажа.</p>`,
    [
      {text:'Поговорить и узнать совет',primary:true,fn:()=>{
        let key=n.id+'talkSession'+state.round;
        if(!state.daily[key]){state.daily[key]=true;state.trust[n.id]=clamp(r+1,0,5);}
        if(!state.secrets.includes(n.id))state.secrets.push(n.id);
        save();
        openModal(`${n.name}: совет и наблюдения`,
          `<p><b>Совет по испытаниям:</b><br>«${esc(n.tip)}»</p>
           <p><b>Бонус союза:</b> ${esc(npcOffer(n))}</p>`,
          [{text:'Спасибо',fn:()=>talk(n)},{text:'Завершить разговор',primary:true,fn:()=>closeModal()}]
        );
      }},
      {text:'Поделиться пайком (+1 доверие)',fn:()=>{
        let key=n.id+'giftSession'+state.round;
        if(state.daily[key]){toast('За этот перерыв ты уже делился с этим участником.');return;}
        if(state.food<1){toast('Нет пайка для подарка.');return;}
        state.food--;state.daily[key]=true;state.trust[n.id]=clamp(r+1,0,5);save();talk(n);beep(700);
      }},
      {text:ally?'Дружеское поручение':'Предложить союз',fn:()=>{
        if(!ally){
          if(r<2){toast('Сначала заслужи 2 доверия.');return;}
          if(state.allies.length>=3){toast('В союзе уже три человека. Можно выйти из союза с другим участником.');return;}
          state.allies.push(n.id);save();toast(`${n.name} теперь помогает в испытаниях.`);talk(n);
        }else npcQuest(n);
      }},
      {text:`Действие: ${ctxLabel}`,fn:()=>npcContextAction(n,u)},
      ...(n.id==='dok'?[{text:'Попросить медицинскую помощь (+25 здоровья)',fn:()=>{
        let hk='dokHeal'+state.round;
        if(state.daily[hk]){toast('Доктор уже перевязал тебя в этот перерыв.');return;}
        state.daily[hk]=true;state.hp=clamp(state.hp+25,0,100);state.energy=clamp(state.energy+10,0,100);save();beep(640);toast('Доктор №111 обработал раны: +25 здоровья, +10 сил.');talk(n);
      }}]:[]),
      ...(ally?[{text:'Выйти из союза (доверие остаётся)',fn:()=>{state.allies=state.allies.filter(id=>id!==n.id);save();talk(n);}}]:[]),
      {text:'Закончить разговор',fn:()=>closeModal()}
    ],
    'ВЗАИМОДЕЙСТВИЕ С УЧАСТНИКОМ'
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
  return {
    mina:'Союз: раннее предупреждение красного сигнала и разведка через вентиляцию в туалете.',
    ivan:'Союз: +25% к силе каждого точного рывка каната.',
    lev:'Союз: в полтора раза быстрее захват точек в финале.',
    asya:'Союз: шире допуск иглы и меньше трещин в сахарной фигуре.',
    boris:'Союз: дополнительный камешек перед стеклянным мостом.',
    tim:'Союз: готов уступить шарики по-дружески при доверии ≥ 3.',
    dana:'Союз: бесплатный осмотр закалённого стекла клавишей Q.',
    vera:'Союз: тайник в туалете и +1 дополнительный жетон за каждое испытание.',
    dok:'Союз: медицинская перевязка (+25 здоровья) в общежитии.',
    matvey:'Союз: бег и прыжки расходуют на 20% меньше выносливости.',
    elena:'Союз: каждый паёк восстанавливает дополнительно +12 здоровья и +12 сил.',
    arkady:'Союз: спокойствие даёт +12 секунд запаса времени в испытаниях.'
  }[n.id]||'Помощь в испытаниях.';
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
function allied(id){return state.allies.includes(id);}
function rules(title,text,fn){openModal(title,text,[{text:'Начать испытание',primary:true,fn:()=>{closeModal();roundData.started=true;fn?.();}}],`ДЕНЬ ${state.day} · ${state.round===0?'ПЕРВАЯ ИГРА':'УТРО'} · ПРАВИЛА ИСПЫТАНИЯ`);}
function startRound(){state.day=Math.min(6,state.round+1);let idx=state.round;if(idx===0)buildRed();else if(idx===1)buildCandy();else if(idx===2)buildTug();else if(idx===3)buildMarbles();else if(idx===4)buildGlass();else buildFinal();}
function fail(reason){
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
  setObjective('01 · ТИШЕ ЕДЕШЬ','Дойди до красной линии у куклы. На зелёный — беги. Перед красным замри или укройся за блоком.');
  rules(TITLES[0],`<p>Пересеки дальнюю линию за ${roundData.time} секунд. Кукла сканирует поле только на красный сигнал.</p><ul><li><b>WASD / Shift:</b> шаг или бег.</li><li><b>Укрытия:</b> за бетонными блоками датчик куклы тебя не видит.</li><li><b>C:</b> пригнуться — выше устойчивость.</li><li><b>Бонусы:</b> Мина и разведка вентиляции предупреждают о повороте головы куклы заранее.</li></ul>`);
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
    if(r.detection>(difficulty==='easy'?.58:.28)+(keys.KeyC?.2:0))return fail('Кукла заметила движение на красный сигнал. Остановись заранее или используй укрытие.');
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
  setObjective('02 · САХАРНАЯ ФИГУРА','Подойди к столу в центре детской площадки. Выбери фигуру и проведи иглой по контуру.');
  rules(TITLES[1],'<p>Подойди к столу и нажми E. Выбери круг, треугольник, звезду или зонтик.</p><ul><li>Пройди контур иглой, удерживая ЛКМ.</li><li>Вода (или разведка шахты в туалете) позволяет увлажнить карамель.</li><li>Союз с Асей (№240) снижает риск трещин.</li></ul>');
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
    let target=r.path[r.index],dist=Math.hypot(r.mouse.x-target.x,r.mouse.y-target.y),tolerance=(difficulty==='easy'?21:14)+(allied('asya')?7:0)+(r.soft?6:0),speed=r.lastMouse?Math.hypot(r.mouse.x-r.lastMouse.x,r.mouse.y-r.lastMouse.y):0;
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
  setObjective('03 · ПЕРЕТЯГИВАНИЕ КАНАТА','Space в зелёный сектор шкалы. C — упор лежа (тактика №001). E — командный рывок. A / D — сменить тактику.');
  rules(TITLES[2],'<p>Сдвинь флажок на свою башню за отведённое время.</p><ul><li><b>Space:</b> тяни в зелёный сектор ритма.</li><li><b>C:</b> упор лёжа (совет Тима №001) — сдерживает рывок врага и быстро возвращает силы.</li><li><b>A / D:</b> смена тактики (выносливость, баланс, напор).</li><li><b>E:</b> командный рывок вместе с союзниками.</li></ul>');
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

  let n=PEOPLE.find(n=>n.id==='tim'),g=person(0,-3,0x278b7d,n.num,false,{name:n.name,hair:n.hair});
  roundData={started:false,time:(difficulty==='easy'?180:135)+(allied('arkady')?12:0),count:10,other:10,shots:0,aimYaw:0,aimPower:.5,shot:null,challenge:null,opponent:g,tries:0};
  cylinder(0,.025,-9,1.3,.05,0x536f66);cylinder(0,.03,-9,.55,.06,0x1c3438);label('ЛУНКА',0,2,-9,.5);
  addInteract(0,-.5,'E · Тим (№001) — выбрать игру с шариками',marbleMenu);
  setObjective('04 · ДЕСЯТЬ ШАРИКОВ','Собери 20 шариков в закатном переулке: «чёт / нечёт», бросок в лунку или договор кганбу с Тимом.');
  rules(TITLES[3],'<p>У тебя и у Тима (№001) по 10 шариков. Чтобы пройти, собери все 20.</p><ul><li><b>Чёт / нечёт:</b> угадывай ставку. Высокое доверие даёт подсказку.</li><li><b>Броски в лунку:</b> A/D — угол, W/S — сила, Space — бросок.</li><li><b>Договор кганбу:</b> Тим уступит свои шарики, если он в твоём союзе и его доверие ≥ 3.</li></ul>');
}
function marbleMenu(){
  if(!roundData.started)return;
  openModal('Тим (№001): игра в шарики',
    `<p>Твои шарики: <b>${roundData.count}</b> · У Тима: <b>${roundData.other}</b></p>
     <p>«Этот переулок совсем как в моей юности... Выберем правила вместе. Мы ведь с тобой кганбу — настоящие друзья».</p>`,
    [
      {text:'Чёт / нечёт',primary:true,fn:chooseParity},
      {text:'Точность: броски в лунку',fn:()=>{roundData.challenge='aim';player.x=0;player.z=3;player.y=0;player.yaw=0;closeModal();toast('A/D — угол, W/S — сила, Space — бросок. E — другие правила.');}},
      {text:'Договориться по-дружески (Кганбу)',fn:()=>{
        if(allied('tim')&&state.trust.tim>=3){win('Тим улыбнулся, назвал тебя своим кганбу и отдал последний шарик.',2);}
        else{openModal('Тим качает головой','<p>«Кганбу доверяют друг другу до конца. Нужен союз и доверие хотя бы 3».</p>',[{text:'Другой способ',primary:true,fn:marbleMenu}]);}
      }},
      {text:'Вернуться в переулок',fn:()=>closeModal()}
    ]
  );
}
function chooseParity(){
  let r=roundData;if(r.count<=0)return fail('Все шарики проиграны.');
  let hidden=1+Math.floor(Math.random()*5);
  let hint=(state.trust.tim>=2||state.ventScouted[3])?`Тим приоткрыл ладонь: похоже, там ${hidden>=3?'не меньше трёх':'не больше двух'} шариков.`:'Тим крепко сжал кулак: подсказки нет.';
  r.hidden=hidden;
  openModal('Чёт или нечёт?',`<p>${hint}</p><p>Ставка: 1, 2 или 3 шарика. Твой запас: ${r.count}.</p>`,
    [1,2,3].flatMap(b=>[{text:`Чёт · ставка ${b}`,fn:()=>parityResult(true,b)},{text:`Нечёт · ставка ${b}`,fn:()=>parityResult(false,b)}]).concat([{text:'Изменить правила',fn:marbleMenu}])
  );
}
function parityResult(even,bet){
  let r=roundData;if(r.count<bet){toast('Не хватает шариков для этой ставки.');return;}
  let won=(r.hidden%2===0)===even,transfer=won?Math.min(bet,r.other):bet;
  r.count+=won?transfer:-transfer;r.other+=won?-transfer:transfer;r.tries++;
  if(r.count>=20)return win('Ты собрал все 20 шариков, читая подсказки в переулке.');
  if(r.count<=0)return fail('Все шарики проиграны. Попробуй точные броски в лунку или договор кганбу.');
  openModal(won?'Ты угадал':'Тим угадал',`<p>В ладони было ${r.hidden} шариков. ${won?'+':'−'}${transfer} шарика.</p><p>Твой запас: ${r.count} / 20.</p>`,
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
        let hit=Math.hypot(s.ex,s.ez+9)<(difficulty==='easy'?1.05:.65);
        world.remove(s.m);s.m.geometry.dispose();s.m.material.dispose();r.shot=null;r.shots++;
        if(hit){let n=Math.min(2,r.other);r.count+=n;r.other-=n;beep(800,.15);toast(`Попадание в лунку! ${r.count}/20 шариков.`);}
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
  if(allied('boris')){state.probes++;toast('Борис передал дополнительный камешек.');}
  if(state.ventScouted[4])revealGlass(0,roundData.rows[0].safe);
  let g=person(1.75,28,0x298b7a,'310');g.position.y=2;roundData.npc=g;
  setObjective('05 · СТЕКЛЯННЫЙ МОСТ','В каждой паре прочное только закалённое стекло. Q — проверить панель (или осмотр Даны №017). E — пустить NPC вперёд.');
  rules(TITLES[4],`<p>Пройди 12 пар стеклянных панелей за ${roundData.time} секунд.</p><ul><li><b>Q:</b> бросить камешек (запас: ${state.probes}) или осмотреть преломление света с мастером-стекольщиком Даной (№017).</li><li><b>E:</b> попросить впереди идущего игрока сделать шаг.</li><li><b>Space + движение:</b> прыжок на следующую плитку.</li></ul>`);
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
    r.reveals[i]=row.safe;r.checked.add(i);toast(`Дана (№017): ряд ${i+1}, закалённое ${row.safe?'правое':'левое'} стекло.`);return;
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
  if(player.y<-2)return fail('Стекло не выдержало. Проверяй плиты камешками или с помощью стекольщика Даны (№017).');
  if(player.z<-29&&player.y>1.5)return win(allied('dana')?'Стекольщик Дана помог определить закалённое стекло по преломлению света.':'Ты пересёк мост над бездной.',r.time>30?2:1);
  if(r.time<=0)return fail('Время на стеклянном мосту вышло.');
  $('special').innerHTML=`<b>${Math.ceil(r.time)} с</b> · Камешки ${state.probes} · Ряд ${Math.min(12,Math.max(0,Math.floor((24-player.z)/4.2)))}/12${allied('dana')?' · Осмотр Даны: Q':''}`;
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
  setObjective('06 · ПОСЛЕДНИЙ КРУГ','Победи соперника или активируй 3 точки на разметке корта (удерживай E), затем войди в верхний круг.');
  rules(TITLES[5],'<p>Финальный корт с кругом, треугольником и квадратом. Есть два пути к победе:</p><ul><li><b>Поединок:</b> ЛКМ — удар, C — защита, Space — уклонение.</li><li><b>Тактика:</b> удерживай E у трёх золотых точек на углах фигуры (Лев №218 ускоряет захват).</li><li><b>Q:</b> позвать союзников отвлечь соперника.</li></ul>');
}
function finalAttack(){
  let r=roundData;if(!r.started||r.attackCD>0)return;
  if(state.energy<12){toast('На удар не хватает сил. Отойди или выпей воды (R).');return;}
  state.energy-=12;r.attackCD=.52;
  let d=Math.hypot(player.x-r.opp.position.x,player.z-r.opp.position.z);
  if(d<2.8){
    let dir=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),to=new THREE.Vector3(r.opp.position.x-player.x,0,r.opp.position.z-player.z).normalize();
    if(dir.dot(to)>.1){
      r.hp-=(difficulty==='easy'?24:17)+(allied('boris')?4:0);r.stun=.45;
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
      else hurt(13,'Удар соперника. C — защита; отойди или прыгни.');
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
  if(g.userData.sign){let sy=g.userData.bodyGroup?.rotation.x<-0.5?1.95:2.64;g.userData.sign.position.set(g.position.x,g.position.y+sy,g.position.z);}
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
  let f=(keys.KeyW?1:0)-(keys.KeyS?1:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0),len=Math.hypot(f,s);
  if(len){f/=len;s/=len;}
  let crouch=!!keys.KeyC,running=!!(keys.ShiftLeft||keys.ShiftRight)&&state.energy>3&&len&&!crouch,speed=crouch?1.9:running?7.2:4.1;
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
  let drain=(mode==='final'?18:11)*(allied('matvey')?.8:1);
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
  $('inventory').innerHTML=`<span>F · Пайки <b>${state.food}</b></span><span>R · Вода <b>${state.water}</b></span><span>Камешки <b>${state.probes}</b></span><span>Жетоны <b>${state.tokens}</b></span><span>Союз <b>${state.allies.length}/3</b></span>`;
  currentTarget=nearTarget();
  $('prompt').textContent=overlay?'':(currentTarget?currentTarget.title:mode==='final'?'ЛКМ — удар · C — защита · E — контроль точки':mode==='glass'?'Q — проверить панель · E — попросить NPC':mode==='hub'?'G — сводка действий NPC · Копилка и туалет справа':'');
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
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
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
  sun.shadow.mapSize.set(1024,1024);
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
window.addEventListener('blur',()=>{keys={};if(started&&!overlay)pauseMenu();});
window.addEventListener('mousemove',e=>{
  if(overlay||!started||mode==='carve')return;
  if(document.pointerLockElement===renderer?.domElement||inputMouse){
    player.yaw-=e.movementX*.0024;player.pitch=clamp(player.pitch-e.movementY*.0024,-1.25,1.25);
  }
});
window.addEventListener('pointerup',()=>inputMouse=false);
window.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerlockchange',()=>{keys={};if(!document.pointerLockElement&&started&&!overlay&&!changingLock&&mode!=='carve')pauseMenu();});
$('pauseButton').onclick=pauseMenu;
init();
if(renderer){
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(overlay)return;
    if(e.button===2)inputMouse=true;
    if(e.button===0){if(!document.pointerLockElement)lockPointer();if(mode==='final')finalAttack();}
  });
}
window.LastTrial={get state(){return state},get mode(){return mode},get player(){return player},get round(){return roundData},begin,startRound,buildDorm,closeModal,win,save,drawCarve,showDormOverview,assignAllNpcActivities};
