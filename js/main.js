/**
 * MAIN.JS
 * Menu mobile e invio del modulo di contatto.
 */

// ========== MENU MOBILE ==========

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

// Si chiude scegliendo una voce, toccando fuori o con Esc
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('click', (event) => {
  if (!menu.classList.contains('is-open')) return;
  if (menu.contains(event.target) || menuToggle.contains(event.target)) return;
  setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

// ========== MODULO DI CONTATTO ==========
// Invia a Formspree senza cambiare pagina. Testi in base alla lingua della pagina.

const testi = {
  it: {
    invio: 'Invio…',
    invia: 'Invia',
    ok: 'Grazie, ho ricevuto il tuo messaggio. Ti rispondo io per fissare la chiamata.',
    errore: 'Il messaggio non è partito. Riprova tra poco, oppure scrivimi a',
  },
  en: {
    invio: 'Sending…',
    invia: 'Send',
    ok: 'Thank you, I got your message. I will reply myself to set up the call.',
    errore: "Your message didn't go through. Try again shortly, or write to me at",
  },
};
const t = testi[document.documentElement.lang] || testi.it;

const form = document.querySelector('.contact-form');

if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('.btn-label');

  function showStatus(text, isError) {
    status.classList.toggle('is-error', isError);
    status.textContent = text;
    if (isError) {
      const link = document.createElement('a');
      link.href = 'mailto:greta@gretaandreolli.it';
      link.textContent = 'greta@gretaandreolli.it';
      status.append(' ', link);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    label.textContent = t.invio;
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(response.status);
      form.reset();
      showStatus(t.ok, false);
    } catch (error) {
      showStatus(t.errore, true);
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      label.textContent = t.invia;
    }
  });
}
