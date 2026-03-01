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
    'Obrigada(o) por existir.',
    'Com você, tudo faz sentido.',
    'Seus abraços são meu superpoder.'
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function loadSavedPhoto() {
  try {
    const dataUrl = localStorage.getItem('nossa_foto_dataurl');
    if (dataUrl) {
      const img = $('#fotoNos');
      if (img) img.src = dataUrl;
    }
  } catch {}
}

function pickPhoto() {
  const input = $('#inputFoto');
  if (!input) return;
  input.click();
}

function handlePhotoChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    const img = $('#fotoNos');
    if (img && typeof dataUrl === 'string') {
      img.src = dataUrl;
      try { localStorage.setItem('nossa_foto_dataurl', dataUrl); } catch {}
      toast('Foto atualizada com carinho ♥');
    }
  };
  reader.readAsDataURL(file);
}

function init() {
  spawnHearts();
  loadSavedPhoto();

  $('#btnCarta')?.addEventListener('click', openModal);
  $('#btnHistoria')?.addEventListener('click', () => {
    toggleHistoria();
    toast('Uma lembrança especial apareceu ✨');
  });
  $('#btnSurpresa')?.addEventListener('click', () => {
    toast(randomAffection());
  });

  // Foto: preferir interação nativa via label for=input no mobile, mas manter botão como alternativa
  $('#frameFoto')?.addEventListener('click', pickPhoto);
  $('#btnTrocarFoto')?.addEventListener('click', pickPhoto);
  $('#inputFoto')?.addEventListener('change', handlePhotoChange);
  // iOS Safari: garantir foco antes de abrir seletor via botão
  $('#btnTrocarFoto')?.addEventListener('touchend', (e) => {
    try { e.currentTarget?.focus?.(); } catch {}
  }, { passive: true });

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
