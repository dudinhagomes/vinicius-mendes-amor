// Utilidades
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function toast(msg, timeout = 2200) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  window.clearTimeout(el._t);
  el._t = window.setTimeout(() => el.classList.remove('show'), timeout);
}

// Corações flutuando
function spawnHearts() {
  const layer = $('#hearts-layer');
  if (!layer) return;

  const makeHeart = () => {
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 10 + Math.random() * 16; // 10-26px
    h.style.width = `${size}px`;
    h.style.height = `${size}px`;
    // posiciona na horizontal
    h.style.left = `${Math.random() * 100}%`;
    // inicio levemente abaixo para garantir subida
    h.style.bottom = `-20px`;
    // duração aleatória
    const dur = 6 + Math.random() * 6; // 6-12s
    h.style.animationDuration = `${dur}s`;
    // leve variação na opacidade
    h.style.opacity = 0.6 + Math.random() * 0.4;

    layer.appendChild(h);
    // remover quando terminar
    setTimeout(() => h.remove(), (dur + 0.5) * 1000);
  };

  // cria alguns no início
  for (let i = 0; i < 18; i++) setTimeout(makeHeart, i * 200);
  // continua criando de forma suave
  setInterval(makeHeart, 700);
}

// Modal
function openModal() { $('#modalCarta')?.classList.remove('hidden'); }
function closeModal() { $('#modalCarta')?.classList.add('hidden'); }

// História
function toggleHistoria() {
  const el = $('#historia');
  if (!el) return;
  const hidden = el.classList.toggle('hidden');
  el.setAttribute('aria-hidden', String(hidden));
}

function randomAffection() {
  const msgs = [
    'Você é meu lugar favorito. ♥',
    'Seu sorriso é meu amanhecer.',
    'Te escolho hoje, amanhã e sempre.',
    'Obrigado por existir.',
    'Com você, tudo faz sentido.',
    'Seus abraços são meu superpoder.'
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

/* Removido: funcionalidades de foto (carregar/salvar, seletor e handlers) */

function init() {
  spawnHearts();

  $('#btnCarta')?.addEventListener('click', openModal);
  $('#btnHistoria')?.addEventListener('click', () => {
    toggleHistoria();
    toast('Uma lembrança especial apareceu ✨');
  });
  $('#btnSurpresa')?.addEventListener('click', () => {
    toast(randomAffection());
  });

  // Removido: eventos relacionados à seleção de foto

  // fechar modal por backdrop ou X
  $$('#modalCarta [data-close]').forEach((el) => el.addEventListener('click', closeModal));
  // fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Personalização simples via hash: #para=Nome
  try {
    const url = new URL(window.location.href);
    const to = url.hash.match(/para=([^&]+)/i)?.[1];
    if (to) {
      const name = decodeURIComponent(to.replace(/\+/g, ' '));
      const d = $('#dedicatory');
      if (d) d.textContent = name;
    }
  } catch {}
}

document.addEventListener('DOMContentLoaded', init);
