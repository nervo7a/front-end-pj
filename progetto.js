
                                                                /* PROGETTO DI SOMMINISTRAZIONE DI CLAUDIA CAVALIERE, marzo 2026
                                                                                    FOGLIO JAVASCRIPT */

                                                              /* menu navigazione */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('aperto');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('aperto');
  });
});


                                                               /* effetti carosello*/
const slides  = document.querySelectorAll('.slide');
const dots    = document.querySelectorAll('.dot');
let corrente  = 0;
let timer;

function mostraSlide(n) {
  slides[corrente].classList.remove('attivo');
  dots[corrente].classList.remove('attivo');
  corrente = (n + slides.length) % slides.length;
  slides[corrente].classList.add('attivo');
  dots[corrente].classList.add('attivo');
}

function avanza() { mostraSlide(corrente + 1); }

function avviaTimer() {
  clearInterval(timer);
  timer = setInterval(avanza, 5500);
}

document.getElementById('prima').addEventListener('click', () => { avanza(); avviaTimer(); });
document.getElementById('dopo').addEventListener('click', () => { mostraSlide(corrente - 1); avviaTimer(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    mostraSlide(parseInt(dot.dataset.idx));
    avviaTimer();
  });
});

const carosello = document.getElementById('carosello');
carosello.addEventListener('mouseenter', () => clearInterval(timer));
carosello.addEventListener('mouseleave', avviaTimer);

avviaTimer();

const osservatore = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visibile');
      osservatore.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.rivela').forEach(el => osservatore.observe(el));


                                                            /* validazione modulo */
const modulo = document.getElementById('modulo');

const regole = {
  nome: {
    convalida: v => v.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(v.trim()),
    errore: 'Inserisci un nome valido (almeno 2 caratteri, solo lettere).'
  },
  cognome: {
    convalida: v => v.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(v.trim()),
    errore: 'Inserisci un cognome valido (almeno 2 caratteri, solo lettere).'
  },
  dataNascita: {
    convalida: v => {
      if (!v) return false;
      const nascita = new Date(v);
      const oggi    = new Date();
      let eta = oggi.getFullYear() - nascita.getFullYear();
      const m = oggi.getMonth() - nascita.getMonth();
      if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) eta--;
      return eta >= 0 && eta <= 120;
    },
    errore: 'Inserisci una data di nascita valida.'
  },
  residenza: {
    convalida: v => v !== '',
    errore: 'Seleziona la tua regione di residenza.'
  },
   numero: {
    convalida: v => v !== '',
    errore: 'Inserisci il tuo numero di telefono.'
  },
  messaggio: {
    convalida: v => v.trim().length >= 10,
    errore: 'Il messaggio deve contenere almeno 10 caratteri.'
  }
};

function validaCampo(id) {
  const campo  = document.getElementById(id);
  const errDiv = document.getElementById('err-' + id);
  const regola = regole[id];
  const valido = regola.convalida(campo.value);

  campo.classList.toggle('errore', !valido);
  errDiv.textContent = valido ? '' : regola.errore;
  return valido;
}

Object.keys(regole).forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validaCampo(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('errore')) validaCampo(id);
    });
  }
});

modulo.addEventListener('submit', function(e) {
  e.preventDefault();

  const tuttiValidi = Object.keys(regole)
    .map(id => validaCampo(id))
    .every(Boolean);

  if (tuttiValidi) {
    modulo.style.display = 'none';
    document.getElementById('messaggioSuccesso').style.display = 'block';
    document.getElementById('messaggioSuccesso').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    const primoErrore = modulo.querySelector('.errore');
    if (primoErrore) primoErrore.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
