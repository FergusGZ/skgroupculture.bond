(() => {
  'use strict';
  const nav = document.getElementById('navbar');
  const menu = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.menu-toggle');
  const topLink = document.getElementById('backToTop');
  function setMenu(open, focus = false) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '關閉導覽選單' : '打開導覽選單');
    if (focus) toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.hidden) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false, true); });
  window.matchMedia('(min-width:768px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  const updateScroll = () => {
    nav.classList.toggle('is-scrolled', scrollY > 32);
    topLink.hidden = scrollY < 500;
    topLink.classList.remove('translate-y-20');
  };
  window.addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.desktop-nav a,.mobile-nav a').forEach(a => {
        if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }), {rootMargin:'-10% 0px -65% 0px'});
    ['home','about','services','platform','contact'].forEach(id => observer.observe(document.getElementById(id)));
  }
  const form = document.getElementById('consultation-form');
  let inquiry = '';
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const company = form.elements.company.value.trim();
    const category = form.elements.category.value.trim();
    const market = form.elements.market.value.trim();
    if (!company || !category || !market) {
      const blank = [...form.querySelectorAll('[required]')].find(field => !field.value.trim());
      blank.setCustomValidity('請填寫此欄位。');
      blank.reportValidity();
      blank.addEventListener('input', () => blank.setCustomValidity(''), {once:true});
      return;
    }
    inquiry = `您好，我想諮詢品牌出海服務。\n\n公司 / 品牌名稱：${company}\n產品類別：${category}\n目標市場或平台：${market}`;
    document.getElementById('consultation-preview').value = inquiry;
    document.getElementById('consultation-mail').href = 'mailto:contact@skgroupculture.bond?subject=' + encodeURIComponent('品牌出海諮詢 - ' + company) + '&body=' + encodeURIComponent(inquiry);
    document.getElementById('consultation-result').hidden = false;
    document.getElementById('copy-status').textContent = '';
  });
  form.addEventListener('input', () => {
    document.getElementById('consultation-result').hidden = true;
  });
  document.getElementById('copy-consultation').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(inquiry);
      status.textContent = '已複製，可貼至您的郵件。';
    } catch {
      const preview = document.getElementById('consultation-preview');
      preview.focus(); preview.select();
      status.textContent = '已選取內容，請按 Ctrl+C 或 Command+C 複製。';
    }
  });
})();
