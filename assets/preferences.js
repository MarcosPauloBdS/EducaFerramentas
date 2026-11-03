/* Aplicado antes da primeira pintura; armazena apenas preferências deste dispositivo. */
(() => {
  try {
    const prefs=JSON.parse(localStorage.getItem('educa.preferences')||'{}');
    const valid=['aurora','cosmos','oceano','amanhecer','contraste'];
    document.documentElement.dataset.theme=valid.includes(prefs.theme)?prefs.theme:'aurora';
    document.documentElement.dataset.motion=prefs.motion==='off'?'off':'auto';
    document.documentElement.dataset.text=['normal','large','larger'].includes(prefs.text)?prefs.text:'normal';
  } catch { document.documentElement.dataset.theme='aurora'; }
})();
