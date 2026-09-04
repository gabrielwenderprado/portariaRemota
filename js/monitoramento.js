/* ============================================================
   CPMG — Central de Monitoramento
   Arquivo de comportamento da página (JavaScript)

   ► PARA ALTERAR LOGIN E SENHA, edite as linhas abaixo:
   ============================================================ */

// Lista de usuários autorizados a entrar no sistema
// Cada usuário tem um "usuario" e uma "senha"
// Você pode adicionar quantos quiser no mesmo formato
const USUARIOS = [
  { usuario: "cpmg",      senha: "cpmg2025" },
  { usuario: "operador1", senha: "senha123" }
];



/* ----------------------------------------------------------
   SEÇÃO 1 — LOGIN E LOGOUT
   Controla quem pode entrar e sair do sistema
---------------------------------------------------------- */

// Função chamada quando o operador clica em "Entrar no Sistema"
function fazerLogin() {

  // Pega o que foi digitado nos campos de usuário e senha
  const usuarioDigitado = document.getElementById('inp-user').value.trim();
  const senhaDigitada   = document.getElementById('inp-pass').value;

  // Verifica se existe algum usuário na lista com esse usuário E essa senha
  // percorre a lista e retorna verdadeiro se encontrar algum que bata
  const loginCorreto = USUARIOS.some(function(cadastro) {
    return cadastro.usuario === usuarioDigitado && cadastro.senha === senhaDigitada;
  });

  // Se o login estiver correto
  if (loginCorreto) {

    // Pega a tela de login e começa a escondê-la (fica transparente)
    const telaLogin = document.getElementById('login-screen');
    telaLogin.classList.add('hidden'); // adiciona a classe que deixa transparente

    // Após 500 milissegundos (meio segundo), remove a tela de login de vez
    // e mostra o painel de câmeras
    setTimeout(function() {

      telaLogin.style.display = 'none'; // remove completamente da tela
      const telaPainel = document.getElementById('monitor-screen');
      telaPainel.classList.add('visible'); // mostra o painel

      // Inicia as funções do painel
      iniciarRelogio();
      construirGradeDeCameras();
      iniciarRegistroDeEventos();

    }, 500);

  // Se o login estiver errado...
  } else {

    // Mostra a mensagem de erro
    const mensagemErro = document.getElementById('login-error');
    mensagemErro.classList.add('show'); // torna a mensagem visível

    // Apaga o que foi digitado no campo de senha
    document.getElementById('inp-pass').value = '';

    // Após 3 segundos, esconde a mensagem de erro automaticamente
    setTimeout(function() {
      mensagemErro.classList.remove('show');
    }, 3000);

  }
}

// Função chamada quando o operador clica em "Sair"
function fazerLogout() {

  // Esconde o painel de monitoramento
  document.getElementById('monitor-screen').classList.remove('visible');

  // Mostra a tela de login novamente
  const telaLogin = document.getElementById('login-screen');
  telaLogin.style.display  = 'flex';
  telaLogin.style.opacity  = '1';
  telaLogin.classList.remove('hidden');

  // Limpa os campos de usuário e senha
  document.getElementById('inp-user').value = '';
  document.getElementById('inp-pass').value = '';
}

// Escuta o teclado para facilitar o uso
// Se apertar Enter na tela de login → tenta fazer login
// Se apertar Escape → fecha qualquer janela aberta
document.addEventListener('keydown', function(tecla) {

  const telaLoginVisivel =
    !document.getElementById('login-screen').classList.contains('hidden') &&
    document.getElementById('login-screen').style.display !== 'none';

  if (tecla.key === 'Enter'  && telaLoginVisivel) fazerLogin();
  if (tecla.key === 'Escape') {
    fecharJanelaDaCamera();
    fecharEmergencia();
  }

});


/* ----------------------------------------------------------
   SEÇÃO 2 — RELÓGIO
---------------------------------------------------------- */

function iniciarRelogio() {

  // Função interna que atualiza o horário na tela
  function atualizarHorario() {
    const agora    = new Date(); // pega a data e hora atual
    const horario  = agora.toLocaleTimeString('pt-BR'); 

    const elementoRelogio      = document.getElementById('clock');
    const elementoRelogioModal = document.getElementById('cam-modal-time');

    if (elementoRelogio)      elementoRelogio.textContent      = horario;
    if (elementoRelogioModal) elementoRelogioModal.textContent = horario;
  }

  atualizarHorario(); // roda uma vez imediatamente para não aparecer "00:00:00"
  setInterval(atualizarHorario, 1000); // repete a cada 1000 milissegundos (1 segundo)
}


/* ----------------------------------------------------------
   SEÇÃO 3 — CÂMERAS
   Constrói a grade de 25 câmeras na tela
---------------------------------------------------------- */

// Nomes que aparecem em cada câmera
const nomesDasCameras = [
  'Portaria Principal', 'Portaria Serviço', 'Hall Bloco A',  'Hall Bloco B',  'Hall Bloco C',
  'Estac. Nível 1',    'Estac. Nível 2',   'Estac. Nível 3','Corredor 1',    'Corredor 2',
  'Elevador A',        'Elevador B',        'Área Comum',    'Salão de Festas','Academia',
  'Piscina',           'Playground',        'Jardim',        'Cobertura',     'Gerador',
  'Recepção',          'Guarita',           'Saída Norte',   'Saída Sul',     'Câmera PTZ'
];

// Estilos visuais de fundo para simular ambientes diferentes
const fundosDasCameras = [
  'scene-lobby',    // fundo de hall/lobby
  'scene-parking',  // fundo de estacionamento
  'scene-hallway',  // fundo de corredor
  'scene-entrance', // fundo de entrada
  'scene-rooftop'   // fundo de cobertura/área aberta
];

// Quais câmeras vão aparecer com alerta (borda laranja piscando)
// Os números são as posições na lista — 0 é a primeira, 6 é a sétima, etc.
const camerasComAlerta  = [6, 11];

// Qual câmera vai aparecer como offline (sem sinal)
const cameraOffline = 19;

// Função que cria e coloca as 25 câmeras na tela
function construirGradeDeCameras() {

  const gradeDeCameras = document.getElementById('cam-grid');
  if (!gradeDeCameras) return;

  gradeDeCameras.innerHTML = ''; // limpa qualquer câmera antiga antes de criar

  // Percorre a lista de nomes, criando uma câmera para cada um
  nomesDasCameras.forEach(function(nome, numero) {

    const temAlerta  = camerasComAlerta.includes(numero); // esta câmera tem alerta?
    const estaOffline = numero === cameraOffline;          // esta câmera está offline?

    // Cria um elemento <div> que representa a câmera
    const quadradoDaCamera = document.createElement('div');

    // Define as classes CSS — se tiver alerta, adiciona a classe "alert"
    quadradoDaCamera.className = 'cam-cell' + (temAlerta ? ' alert' : '');
    quadradoDaCamera.title = nome + ' — clique para ampliar';

    // Quando clicar na câmera, abre ela em tamanho maior
    quadradoDaCamera.addEventListener('click', function() {
      abrirJanelaDaCamera(numero, nome);
    });

    // Escolhe o fundo visual da câmera (repete os 5 fundos em ciclo)
    const fundoEscolhido     = fundosDasCameras[numero % fundosDasCameras.length];
    const velocidadeDaLinha  = (3 + (numero % 4)).toFixed(1); // velocidade da linha de varredura
    const corDoMovimento     = temAlerta ? 'rgba(249,115,22,0.5)' : 'rgba(14,165,233,0.35)';

    // Monta o conteúdo interno do quadrado da câmera
    quadradoDaCamera.innerHTML = `
      <div class="cam-feed ${fundoEscolhido}">
        ${estaOffline
          ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
               font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(239,68,68,0.6);">SEM SINAL</div>`
          : criarAnimacaoDeMovimento(numero, corDoMovimento)
        }
      </div>
      <div class="cam-noise"></div>
      ${!estaOffline ? `<div class="cam-scanline" style="animation-duration:${velocidadeDaLinha}s;"></div>` : ''}
      <div class="cam-id">CAM-${String(numero + 1).padStart(2, '0')}</div>
      ${!estaOffline ? `<div class="cam-rec"><div class="cam-rec-dot"></div>REC</div>` : ''}
      <div class="cam-overlay-info">
        <span class="cam-name">${nome.toUpperCase()}</span>
        <span class="cam-status ${estaOffline ? 'offline' : ''}"></span>
      </div>
    `;

    // Adiciona a câmera dentro da grade na tela
    gradeDeCameras.appendChild(quadradoDaCamera);
  });
}

// Cria o elemento que simula uma pessoa/objeto se movendo na câmera
function criarAnimacaoDeMovimento(numero, cor) {

  // Cada câmera tem valores um pouco diferentes para parecer única
  const atraso      = (numero * 1.3 % 7).toFixed(1);           // atraso antes de começar
  const duracao     = (5 + numero % 6).toFixed(1);             // quanto tempo dura a travessia
  const posicaoTopo = 20 + (numero * 13 % 50);                 // altura na câmera (em %)
  const distancia   = (200 + numero * 17 % 300) + 'px';        // distância percorrida
  const tamanho     = numero % 2 === 0 ? 16 : 10;              // tamanho do elemento

  return `<div class="mover" style="
    top:${posicaoTopo}%; left:0; width:${tamanho}px; height:${tamanho * 2}px;
    background:${cor};
    animation-duration:${duracao}s;
    animation-delay:-${atraso}s;
    --travel:${distancia};
  "></div>`;
}


/* ----------------------------------------------------------
   SEÇÃO 4 — JANELA DE CÂMERA AMPLIADA
   Abre uma câmera em tamanho maior quando clicada
---------------------------------------------------------- */

// Abre a janela com a câmera ampliada
function abrirJanelaDaCamera(numero, nome) {

  const fundoDaJanela = document.getElementById('cam-modal-feed');
  if (!fundoDaJanela) return;

  // Coloca o fundo visual correto na janela ampliada
  fundoDaJanela.className = 'cam-modal-feed ' + fundosDasCameras[numero % fundosDasCameras.length];
  fundoDaJanela.innerHTML = criarAnimacaoDeMovimento(numero, 'rgba(14,165,233,0.5)');

  // Atualiza o título e a localização mostrados na janela
  document.getElementById('cam-modal-title').textContent =
    'CAM-' + String(numero + 1).padStart(2, '0') + ' — ' + nome.toUpperCase();
  document.getElementById('cam-modal-loc').textContent = nome.toUpperCase();

  // Torna a janela visível
  document.getElementById('cam-modal').classList.add('open');
}

// Fecha a janela da câmera ampliada
// O parâmetro "clique" é usado para fechar apenas se clicar fora da janela
function fecharJanelaDaCamera(clique) {
  const janela = document.getElementById('cam-modal');
  if (!clique || clique.target === janela) {
    janela.classList.remove('open');
  }
}


/* ----------------------------------------------------------
   SEÇÃO 5 — BOTÃO DE EMERGÊNCIA
   Controla o aviso enviado à central de segurança
---------------------------------------------------------- */

// Abre a janela de confirmação de emergência
function abrirEmergencia() {
  document.getElementById('emergency-modal').classList.add('open');
  document.getElementById('em-actions').style.display   = 'flex';
  document.getElementById('em-sending').classList.remove('show');
  document.getElementById('em-sent').classList.remove('show');
  document.getElementById('em-sub-text').style.display  = 'block';
}

// Fecha a janela de emergência sem fazer nada
function fecharEmergencia() {
  document.getElementById('emergency-modal').classList.remove('open');
}

// Confirma o envio do alerta para a central
function confirmarEmergencia() {

  // Esconde os botões e o texto, mostra o indicador de "enviando"
  document.getElementById('em-actions').style.display  = 'none';
  document.getElementById('em-sub-text').style.display = 'none';
  document.getElementById('em-sending').classList.add('show');

  // Simula o tempo de envio — após 2,2 segundos mostra a confirmação
  setTimeout(function() {

    document.getElementById('em-sending').classList.remove('show');
    document.getElementById('em-sent').classList.add('show');

    // Registra o evento no log lateral
    adicionarEvento('warn', 'EMERGÊNCIA acionada — Central alertada');

    // Fecha a janela automaticamente após 2,5 segundos
    setTimeout(fecharEmergencia, 2500);

  }, 2200);
}


/* ----------------------------------------------------------
   SEÇÃO 6 — REGISTRO DE EVENTOS
   Mostra eventos de segurança na barra lateral da tela
---------------------------------------------------------- */

// Lista de eventos que vão aparecer automaticamente, em sequência
const listaDeEventos = [
  { tipo: 'info', texto: 'Câm. 03 — Acesso validado'           },
  { tipo: 'ok',   texto: 'Ronda virtual concluída'              },
  { tipo: 'warn', texto: 'Câm. 07 — Movimento detectado'       },
  { tipo: 'info', texto: 'Sistema — Backup em andamento'        },
  { tipo: 'ok',   texto: 'Portaria — Liberação autorizada'      },
  { tipo: 'warn', texto: 'Câm. 21 — Área restrita'             },
  { tipo: 'info', texto: 'Câm. 15 — Pessoa identificada'       },
  { tipo: 'ok',   texto: 'Sistema — Sem anomalias detectadas'   },
];

// Controla qual evento da lista será mostrado a seguir
let posicaoNaLista = 0;

// Adiciona um novo evento no topo do registro lateral
function adicionarEvento(tipo, texto) {

  const registroLateral = document.getElementById('event-log');
  if (!registroLateral) return;

  // Cria o elemento visual do evento
  const novoEvento = document.createElement('div');
  novoEvento.className = 'event-item ' + tipo;
  novoEvento.innerHTML = `<span class="event-time">agora</span><span class="event-text">${texto}</span>`;

  // Coloca o novo evento no topo da lista (os mais recentes ficam em cima)
  registroLateral.insertBefore(novoEvento, registroLateral.firstChild);

  // Atualiza os horários dos eventos anteriores
  registroLateral.querySelectorAll('.event-time').forEach(function(elemento, posicao) {
    if (posicao > 0) elemento.textContent = (posicao * 2) + ':00';
  });

  // Mantém no máximo 6 eventos visíveis — remove o mais antigo se passar disso
  while (registroLateral.children.length > 6) {
    registroLateral.removeChild(registroLateral.lastChild);
  }
}

// Inicia o timer que adiciona um novo evento a cada 8 segundos
function iniciarRegistroDeEventos() {
  setInterval(function() {

    // Pega o próximo evento da lista
    // O "%" faz a lista reiniciar do começo quando chegar no final
    const proximoEvento = listaDeEventos[posicaoNaLista % listaDeEventos.length];
    adicionarEvento(proximoEvento.tipo, proximoEvento.texto);

    posicaoNaLista++; // avança para o próximo evento

  }, 8000); // 8000 milissegundos = 8 segundos
}
