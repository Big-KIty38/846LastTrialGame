from playwright.sync_api import sync_playwright
from pathlib import Path
import json
errors=[];results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
 page=b.new_page(viewport={'width':1100,'height':720})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((Path(__file__).resolve().parents[1] / 'index.html').as_uri(),wait_until='load')
 page.evaluate('()=>{window.requestAnimationFrame=()=>{};renderer.shadowMap.enabled=false;renderer.setPixelRatio(.7);renderer.setSize(1100,720);lockPointer=()=>{};begin(false);closeModal(false);paused=true;}')
 page.wait_for_timeout(100)
 def run(name,code):
  result=page.evaluate(code);results.append({'test':name,'result':result});print(name,json.dumps(result,ensure_ascii=False),flush=True)
 run('food and trust','''()=>{getRation();let f=state.food;getRation();talk(PEOPLE[5]);document.querySelector('#modalButtons button').click();document.querySelector('#modalButtons button').click();document.querySelectorAll('#modalButtons button')[1].click();document.querySelectorAll('#modalButtons button')[2].click();return {no_duplicate_food:state.food===f-1,trust:state.trust.tim,allies:state.allies};}''')
 run('red-light fair crossing','''()=>{state.round=0;startRound();roundData.started=true;closeModal(false);let steps=0;for(;steps<6000&&mode==='red';steps++){keys={KeyW:roundData.light==='green'&&!roundData.warning,ShiftLeft:state.energy>8};let moving=move(.02);updateRed(.02,moving);}return {mode,steps,z:player.z,round:state.round};}''')
 run('red-light detection','''()=>{state.round=0;startRound();roundData.started=true;closeModal(false);roundData.light='red';roundData.phase=3;player.x=0;player.z=0;for(let i=0;i<50&&mode==='red';i++)updateRed(.02,true);return {mode};}''')
 run('all sugar shapes','''()=>{let out=[];for(let t of ['circle','triangle','star','umbrella']){state.round=1;startRound();startCarve(t);let i=0;for(;i<1000&&mode==='carve';i++){let r=roundData;r.down=true;r.mouse={...r.path[r.index]};r.lastMouse={...r.mouse};updateCarve(.016);if(i%15===0&&mode==='carve'){r.down=false;updateCarve(.5);}}out.push({shape:t,mode,steps:i});}return out;}''')
 run('sugar pause resume','''()=>{state.round=1;startRound();startCarve('circle');pauseMenu();closeModal(false);return {visible:document.getElementById('carvePanel').classList.contains('open'),mode};}''')
 run('tug rhythm','''()=>{state.round=2;state.energy=100;state.allies=['ivan'];startRound();roundData.started=true;closeModal(false);roundData.strategy='power';tugCall();let oldBeat=-1;for(let i=0;i<4000&&mode==='tug';i++){keys={KeyC:true};updateTug(.02);let r=roundData;if(mode==='tug'&&Math.abs(r.beat%1-.5)<.025&&Math.floor(r.beat)!==oldBeat){oldBeat=Math.floor(r.beat);tugPull();}}return {mode,round:state.round};}''')
 run('marble aiming','''()=>{state.round=3;startRound();roundData.started=true;closeModal(false);roundData.challenge='aim';roundData.aimPower=.95;for(let k=0;k<5&&mode==='marbles';k++){throwMarble();for(let i=0;i<50&&mode==='marbles';i++)updateMarbles(.02);}return {mode,round:state.round,count:roundData.count};}''')
 run('marble cooperation','''()=>{state.round=3;state.allies=['tim'];state.trust.tim=3;startRound();roundData.started=true;marbleMenu();document.querySelectorAll('#modalButtons button')[2].click();return {mode,round:state.round};}''')
 run('glass inspections','''()=>{state.round=4;state.allies=['dana'];startRound();roundData.started=true;closeModal(false);for(let i=0;i<12;i++){player.z=roundData.rows[i].z+3;roundData.focus=0;inspectGlass();player.x=roundData.rows[i].safe?1.75:-1.75;player.z=roundData.rows[i].z;player.y=2;player.vy=0;if(glassFloor()!==2)throw Error('safe panel failed');}player.z=-30;updateGlass(.02);return {mode,round:state.round,reveals:Object.keys(roundData.reveals).length};}''')
 run('glass break','''()=>{state.round=4;startRound();roundData.started=true;player.z=21;player.x=roundData.rows[0].safe?-1.75:1.75;player.y=2;player.vy=0;let floor=glassFloor();player.y=-3;updateGlass(.02);return {mode,floor};}''')
 run('final nonviolent','''()=>{state.round=5;state.hp=100;state.allies=['lev','mina'];startRound();roundData.started=true;closeModal(false);finalCall();let r=roundData;for(let p of r.points){player.x=p.x;player.z=p.z;for(let i=0;i<130;i++){keys={KeyE:true,KeyC:true};updateFinal(.02);}}player.z=-19;updateFinal(.02);return {mode,round:state.round,points:r.points.map(p=>p.fill)};}''')
 run('final melee','''()=>{state.round=5;state.energy=100;state.hp=100;startRound();roundData.started=true;closeModal(false);let r=roundData;player.x=0;player.z=-8;player.yaw=0;for(let i=0;i<6;i++){r.opp.position.set(0,0,-10);r.attackCD=0;state.energy=100;finalAttack();}player.z=-19;updateFinal(.02);return {mode,round:state.round,opponent:r.hp};}''')
 run('night supplies','''()=>{state.round=0;state.day=1;state.daily={};state.hp=100;buildDorm();closeModal(false);startStealth();let r=roundData;for(let t of interactions.filter(t=>t.title.includes('ящик')))t.fn();let crates=r.crates;bedMenu();document.querySelectorAll('#modalButtons button')[1].click();return {mode,crates,reward:state.daily.stealth1===true};}''')
 run('all six day transitions','''()=>{state=freshState();let days=[];for(let i=0;i<6;i++){startRound();roundData.started=true;win('Автоматическая проверка перехода');if(i<5)buildDorm();else ending();days.push({round:state.round,day:state.day,mode});}return days;}''')
 # Capture final preview render once without permanent animation loop.
 page.evaluate('()=>{state=freshState();started=true;buildDorm();closeModal(false);paused=true;keys={};camera.position.set(0,1.65,14);camera.rotation.set(0,0,0);renderer.setPixelRatio(1);renderer.setSize(1100,720);updateHUD();renderer.render(scene,camera);}')
 page.screenshot(path=str(Path(__file__).with_name('test-dorm.png')),timeout=15000,animations='disabled')
 page.evaluate('()=>{state.round=4;startRound();roundData.started=true;closeModal(false);paused=true;camera.position.set(-1.7,4.4,30);camera.rotation.set(-.18,0,0);updateHUD();renderer.render(scene,camera);}')
 page.screenshot(path=str(Path(__file__).with_name('test-glass.png')),timeout=15000,animations='disabled')
 print('BROWSER_ERRORS',errors)
 Path(__file__).with_name('mechanics-report.json').write_text(json.dumps({'tests':results,'browser_errors':errors},ensure_ascii=False,indent=2))
 b.close()
