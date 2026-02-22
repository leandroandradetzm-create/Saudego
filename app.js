// Saudego — Protótipo clicável (offline)
// Navegação simples por telas

const app = document.getElementById('app');
const backBtn = document.getElementById('backBtn');
const tabbar = document.getElementById('tabbar');
const fab = document.getElementById('emergencyFab');
const sheet = document.getElementById('sheet');

let historyStack = [];
let state = {
  role: null, // 'patient' | 'pro'
  tab: 'resumo',
  patient: {
    name: 'Leo Martins',
    age: 24,
    blood: 'O+',
    conditions: ['Asma', 'Diabetes Tipo 2'],
    allergies: ['Penicilina'],
    meds: [
      {name:'Salbutamol', dose:'100mcg', qty:'2 jatos', times:'se crise / 6-6h'},
      {name:'Metformina', dose:'850mg', qty:'1 cp', times:'08:00 / 20:00'},
    ],
    consults: [
      {date:'21/02/2026', qp:'Falta de ar', author:'Profissional verificado'},
      {date:'10/01/2026', qp:'Tosse e febre', author:'Responsável/Paciente'},
    ],
    docs: ['Hemograma (PDF)', 'RX Tórax (foto)', 'Receita (foto)'],
    emergencyContacts: [{name:'Ana Souza', phone:'(11) 98765-4321'}],
  }
};

function push(screen){
  historyStack.push(screen);
  render();
}
function pop(){
  historyStack.pop();
  render();
}

function current(){
  return historyStack[historyStack.length-1] || {name:'welcome'};
}

function setBackVisible(v){
  backBtn.classList.toggle('hidden', !v);
}

function setTabsVisible(v){
  tabbar.classList.toggle('hidden', !v);
  fab.classList.toggle('hidden', !v);
}

function setActiveTab(tab){
  state.tab = tab;
  document.querySelectorAll('.tab').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab === tab);
  });
}

function html(strings, ...vals){
  return strings.map((s,i)=> s + (vals[i] ?? '')).join('');
}

function screenWelcome(){
  setBackVisible(false);
  setTabsVisible(false);
  return html`
    <div class="card">
      <div class="row">
        <div class="avatar">S</div>
        <div>
          <p class="h1">Saudego</p>
          <p class="p">Sua saúde na mão</p>
        </div>
      </div>
      <div class="sep"></div>
      <button class="btn" data-nav="login">Entrar</button>
      <div style="height:10px"></div>
      <button class="btn secondary" data-nav="signup">Criar conta</button>
    </div>
    <div class="card">
      <p class="p">Protótipo clicável (sem instalar app). Use para avaliar fluxo e telas.</p>
    </div>
  `;
}

function screenLogin(){
  setBackVisible(true);
  setTabsVisible(false);
  return html`
    <div class="card">
      <p class="h1">Entrar</p>
      <p class="p">Simulação. Escolha o tipo de acesso.</p>
      <div class="sep"></div>
      <button class="btn" data-action="loginPatient">Entrar como Paciente</button>
      <div style="height:10px"></div>
      <button class="btn secondary" data-action="loginPro">Entrar como Profissional</button>
    </div>
  `;
}

function screenSignup(){
  setBackVisible(true);
  setTabsVisible(false);
  return html`
    <div class="card">
      <p class="h1">Criar conta</p>
      <p class="p">Primeiro, diga quem você é.</p>
      <div class="sep"></div>
      <button class="btn" data-action="signupPatient">Sou Paciente</button>
      <div style="height:10px"></div>
      <button class="btn secondary" data-action="signupPro">Sou Profissional de saúde</button>
    </div>
  `;
}

function patientHome(){
  setBackVisible(false);
  setTabsVisible(true);
  setActiveTab(state.tab);
  if(state.tab === 'resumo') return patientResumo();
  if(state.tab === 'consultas') return patientConsultas();
  if(state.tab === 'exames') return patientExames();
  if(state.tab === 'compartilhar') return patientCompartilhar();
  if(state.tab === 'config') return patientConfig();
}

function patientResumo(){
  const p = state.patient;
  return html`
    <div class="card">
      <div class="row">
        <div class="avatar">${p.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
        <div>
          <p class="h1">${p.name}</p>
          <p class="p">${p.age} anos • Sangue: ${p.blood}</p>
        </div>
      </div>
      <div class="chips">
        ${p.conditions.map(c=>`<span class="chip primary">${c}</span>`).join('')}
        ${p.allergies.map(a=>`<span class="chip danger">ALERGIA: ${a}</span>`).join('')}
      </div>
      <div class="grid">
        <div class="tile" data-nav="meds">Medicamentos<small>Dose + horários</small></div>
        <div class="tile" data-nav="alerts">Alergias / Alertas<small>Bem chamativo</small></div>
        <div class="tile" data-nav="child">Perfil da criança<small>Puericultura</small></div>
        <div class="tile" data-nav="share">Compartilhar<small>QR + link</small></div>
      </div>
    </div>

    <div class="card">
      <p class="h1">Medicamentos</p>
      ${p.meds.map(m=>`<div class="listItem"><b>${m.name}</b> ${m.dose}<div class="sub">${m.qty} • ${m.times}</div></div>`).join('')}
    </div>
  `;
}

function patientMeds(){
  setBackVisible(true);
  setTabsVisible(false);
  const p = state.patient;
  return html`
    <div class="card">
      <p class="h1">Meus Medicamentos</p>
      <p class="p">Obrigatório: dose + quantidade + horários.</p>
      ${p.meds.map(m=>`<div class="listItem"><b>${m.name}</b> ${m.dose}<div class="sub">${m.qty} • ${m.times}</div></div>`).join('')}
      <div style="height:12px"></div>
      <button class="btn secondary" data-action="addMed">+ Adicionar remédio</button>
    </div>
  `;
}

function patientAlerts(){
  setBackVisible(true);
  setTabsVisible(false);
  const p = state.patient;
  return html`
    <div class="card bigDanger">
      <div class="bannerDanger">ALERTAS IMPORTANTES</div>
      <div style="height:12px"></div>
      <p><b>Condições:</b> ${p.conditions.join(', ')}</p>
      <p><b>Alergias:</b> ${p.allergies.join(', ')}</p>
      <p class="p">Aqui é onde “grita” (diabético/asma/anticoagulado etc.).</p>
    </div>
  `;
}

function patientConsultas(){
  const p = state.patient;
  return html`
    <div class="card">
      <p class="h1">Consultas / Registros</p>
      <p class="p">Modelo de anamnese: QP + HMA (obrigatório). Sempre marca quem escreveu.</p>
      <button class="btn secondary" data-nav="newConsult">+ Novo registro</button>
      <div class="sep"></div>
      ${p.consults.map(c=>`
        <div class="listItem" data-nav="consultDetail" data-date="${c.date}">
          <b>${c.date}</b> — QP: ${c.qp}
          <div class="sub">${c.author}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function consultDetail(date){
  setBackVisible(true);
  setTabsVisible(false);
  const p = state.patient;
  const c = p.consults.find(x=>x.date===date) || p.consults[0];
  return html`
    <div class="card">
      <p class="h1">${c.date} — QP: ${c.qp}</p>
      <p class="p">Autor: ${c.author}</p>
      <div class="sep"></div>
      <p><b>HMA</b></p>
      <p class="p">Texto exemplo da HMA… (no app real, campo completo).</p>
      <div class="sep"></div>
      <p class="p">AP/AF/Exame físico/Plano (opcionais)</p>
    </div>
  `;
}

function newConsult(){
  setBackVisible(true);
  setTabsVisible(false);
  return html`
    <div class="card">
      <p class="h1">Novo registro (consulta)</p>
      <p class="p">Simulação do formulário de anamnese.</p>
      <div class="sep"></div>
      <label>Queixa principal (QP) *</label>
      <input class="field" placeholder="Ex.: Falta de ar"/>
      <div style="height:10px"></div>
      <label>HMA *</label>
      <textarea class="field" rows="5" placeholder="Conte a história do problema..."></textarea>
      <div style="height:10px"></div>
      <button class="btn" data-action="saveConsult">Salvar</button>
      <div style="height:10px"></div>
      <button class="btn subtle" data-action="cancel">Cancelar</button>
    </div>
  `;
}

function patientExames(){
  const p = state.patient;
  return html`
    <div class="card">
      <p class="h1">Exames / Documentos</p>
      <p class="p">No começo: o paciente só anexa (sem obrigar preencher campos).</p>
      <button class="btn secondary" data-action="addDoc">+ Anexar</button>
      <div class="sep"></div>
      ${p.docs.map(d=>`<div class="listItem"><b>${d}</b><div class="sub">Anexo</div></div>`).join('')}
    </div>
  `;
}

function patientCompartilhar(){
  return html`
    <div class="card">
      <p class="h1">Compartilhar com profissional</p>
      <p class="p">Gera QR e link (WhatsApp). Profissional só acessa se tiver cadastro e for verificado.</p>
      <div class="sep"></div>
      <label>Duração do acesso</label>
      <select class="field">
        <option>10 min</option>
        <option selected>30 min</option>
        <option>1 h</option>
        <option>Ilimitado</option>
      </select>
      <div style="height:12px"></div>
      <button class="btn" data-action="genShare">Gerar QR/Link</button>
      <div style="height:12px"></div>
      <div class="card" style="margin:0">
        <div style="text-align:center; padding:10px; border:1px dashed rgba(15,23,42,.18); border-radius:16px;">
          <div style="font-weight:900">[QR CODE]</div>
          <div class="p">Simulação</div>
        </div>
        <div style="height:10px"></div>
        <button class="btn secondary" data-action="whats">Enviar no WhatsApp</button>
      </div>
    </div>
  `;
}

function patientConfig(){
  const p = state.patient;
  return html`
    <div class="card">
      <p class="h1">Configurações</p>
      <p class="p">Aqui o paciente cadastra condições/alergias/medicamentos e ativa o cartão na tela bloqueada.</p>
      <div class="sep"></div>
      <div class="listItem" data-nav="lock">
        <b>Cartão de emergência na tela bloqueada</b>
        <span class="badge">${state.lockEnabled ? 'ATIVO' : 'DESATIVADO'}</span>
        <div class="sub">Sem QR • só essencial</div>
      </div>
      <div class="listItem" data-action="editBasic">
        <b>Dados básicos</b><div class="sub">Nome, nascimento etc.</div>
      </div>
    </div>
  `;
}

function lockScreen(){
  setBackVisible(true);
  setTabsVisible(false);
  return html`
    <div class="card">
      <p class="h1">Tela bloqueada (Cartão de emergência)</p>
      <p class="p">Sem QR. Só essencial pra salvar vidas.</p>
      <div class="sep"></div>
      <button class="btn" data-action="toggleLock">Ativar / Desativar</button>
      <div style="height:12px"></div>
      <div class="card bigDanger" style="margin:0">
        <div class="bannerDanger">EMERGÊNCIA</div>
        <div style="height:10px"></div>
        <p><b>DIABÉTICO</b> • <b>ASMÁTICO</b></p>
        <p><b>ALERGIAS:</b> Penicilina</p>
        <p><b>MEDS:</b> Metformina 850mg (08:00/20:00)</p>
        <p><b>CONTATO:</b> Ana Souza — (11) 98765-4321</p>
      </div>
    </div>
  `;
}

function childProfile(){
  setBackVisible(true);
  setTabsVisible(false);
  return html`
    <div class="card">
      <div class="row">
        <div class="avatar">L</div>
        <div>
          <p class="h1">Perfil da Criança</p>
          <p class="p">Puericultura: peso, altura, perímetro cefálico, curvas e vacinas (na evolução).</p>
        </div>
      </div>
      <div class="sep"></div>
      <div class="listItem"><b>Última consulta</b><div class="sub">Peso 18,2 kg • Altura 110 cm • PC 50 cm</div></div>
      <div class="listItem"><b>Curvas de crescimento</b><div class="sub">Gráfico (versão final)</div></div>
      <div class="listItem"><b>Vacinas</b><div class="sub">Carteira + lembretes (versão final)</div></div>
      <div class="listItem"><b>Marcos do desenvolvimento</b><div class="sub">Checklist por idade (versão final)</div></div>
    </div>
  `;
}

function proHome(){
  setBackVisible(false);
  setTabsVisible(false);
  return html`
    <div class="card">
      <p class="h1">Profissional de saúde</p>
      <p class="p">No app real, o profissional só acessa paciente se for verificado e receber link/QR do paciente.</p>
      <div class="sep"></div>
      <div class="listItem">
        <b>Status</b><span class="badge">VERIFICADO</span>
        <div class="sub">Consulta por conselho ou documento (versão final)</div>
      </div>
      <div class="listItem" data-nav="proPatient">
        <b>Abrir perfil (simulação)</b>
        <div class="sub">Como se tivesse vindo de um link liberado</div>
      </div>
      <button class="btn secondary" data-action="logout">Sair</button>
    </div>
  `;
}

function proPatientView(){
  setBackVisible(true);
  setTabsVisible(false);
  const p = state.patient;
  return html`
    <div class="card">
      <div class="row">
        <div class="avatar">${p.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
        <div>
          <p class="h1">${p.name}</p>
          <p class="p">${p.age} anos • Sangue: ${p.blood}</p>
        </div>
      </div>
      <div class="chips">
        ${p.conditions.map(c=>`<span class="chip primary">${c}</span>`).join('')}
        ${p.allergies.map(a=>`<span class="chip danger">ALERGIA: ${a}</span>`).join('')}
      </div>
    </div>
    <div class="card bigDanger">
      <p class="h1">Alergias (bem chamativo)</p>
      <p><b>${p.allergies.join(', ')}</b></p>
      <div class="sep"></div>
      <p class="h1">Condições</p>
      <p>${p.conditions.join(', ')}</p>
      <div class="sep"></div>
      <p class="h1">Medicamentos</p>
      ${p.meds.map(m=>`<div class="listItem"><b>${m.name}</b> ${m.dose}<div class="sub">${m.qty} • ${m.times}</div></div>`).join('')}
      <div class="sep"></div>
      <p class="h1">Consultas anteriores</p>
      ${p.consults.map(c=>`<div class="listItem"><b>${c.date}</b> — QP: ${c.qp}<div class="sub">${c.author}</div></div>`).join('')}
      <div class="sep"></div>
      <p class="h1">Exames/Documentos</p>
      ${p.docs.map(d=>`<div class="listItem"><b>${d}</b></div>`).join('')}
    </div>
  `;
}

function emergencyCard(){
  setBackVisible(true);
  setTabsVisible(false);
  const p = state.patient;
  return html`
    <div class="card bigDanger">
      <div class="bannerDanger">EMERGÊNCIA!</div>
      <div style="height:12px"></div>
      <p class="h1">ALERGIAS</p>
      <p style="font-size:18px;font-weight:900">${p.allergies.join(', ') || 'Nenhuma informada'}</p>
      <div class="sep"></div>
      <p class="h1">CONDIÇÕES</p>
      <p style="font-size:18px;font-weight:900">${p.conditions.join(' • ') || 'Nenhuma informada'}</p>
      <div class="sep"></div>
      <p class="h1">MEDICAMENTOS</p>
      ${p.meds.map(m=>`<div class="listItem"><b>${m.name}</b> ${m.dose}<div class="sub">${m.qty} • ${m.times}</div></div>`).join('')}
      <div class="sep"></div>
      <button class="btn" data-action="contacts">Contatos de emergência</button>
      <div style="height:10px"></div>
      <button class="btn subtle" data-action="cancel">Fechar</button>
    </div>
  `;
}

function render(){
  const s = current();
  // map screen to html
  let content = '';
  if(s.name==='welcome') content = screenWelcome();
  else if(s.name==='login') content = screenLogin();
  else if(s.name==='signup') content = screenSignup();
  else if(s.name==='patientHome') content = patientHome();
  else if(s.name==='meds') content = patientMeds();
  else if(s.name==='alerts') content = patientAlerts();
  else if(s.name==='newConsult') content = newConsult();
  else if(s.name==='consultDetail') content = consultDetail(s.date);
  else if(s.name==='lock') content = lockScreen();
  else if(s.name==='child') content = childProfile();
  else if(s.name==='proHome') content = proHome();
  else if(s.name==='proPatient') content = proPatientView();
  else if(s.name==='emergencyCard') content = emergencyCard();
  else content = screenWelcome();

  app.innerHTML = content;

  // back button behavior
  backBtn.onclick = () => {
    if(historyStack.length>1) pop();
  };

  // bind nav
  app.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const nav = el.dataset.nav;
      if(nav==='consultDetail'){
        push({name:'consultDetail', date: el.dataset.date});
      } else {
        push({name:nav});
      }
    });
  });

  // bind actions
  app.querySelectorAll('[data-action]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const a = el.dataset.action;
      if(a==='loginPatient'){ state.role='patient'; historyStack=[{name:'patientHome'}]; state.tab='resumo'; render(); }
      if(a==='loginPro'){ state.role='pro'; historyStack=[{name:'proHome'}]; render(); }
      if(a==='signupPatient'){ state.role='patient'; historyStack=[{name:'patientHome'}]; state.tab='resumo'; render(); }
      if(a==='signupPro'){ state.role='pro'; historyStack=[{name:'proHome'}]; render(); }
      if(a==='logout'){ historyStack=[{name:'welcome'}]; state.role=null; render(); }
      if(a==='cancel'){ pop(); }
      if(a==='saveConsult'){ alert('Salvo (simulação).'); pop(); }
      if(a==='addDoc'){ alert('Anexo adicionado (simulação).'); }
      if(a==='genShare'){ alert('QR/Link gerado (simulação).'); }
      if(a==='whats'){ alert('Abriria o WhatsApp (simulação).'); }
      if(a==='addMed'){ alert('Adicionar remédio (simulação).'); }
      if(a==='toggleLock'){ alert('Ativar/desativar (simulação).'); }
      if(a==='contacts'){ alert('Contatos: Ana Souza (11) 98765-4321 (simulação).'); }
      if(a==='editBasic'){ alert('Editar dados (simulação).'); }
    });
  });

  // tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.onclick = ()=>{
      state.tab = btn.dataset.tab;
      setActiveTab(state.tab);
      render();
    };
  });

  // show correct tab active
  setActiveTab(state.tab);

  // show/hide sheet
  sheet.onclick = (e)=>{ if(e.target===sheet) sheet.classList.remove('show'); };
}

document.getElementById('emergencyFab').onclick = ()=> sheet.classList.add('show');
sheet.querySelectorAll('[data-action]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const action = btn.dataset.action;
    if(action==='close'){ sheet.classList.remove('show'); return; }
    if(action==='panic'){ sheet.classList.remove('show'); alert('Pânico acionado (simulação).'); return; }
    if(action==='emergency'){ sheet.classList.remove('show'); push({name:'emergencyCard'}); return; }
  });
});

// init
historyStack = [{name:'welcome'}];
render();
