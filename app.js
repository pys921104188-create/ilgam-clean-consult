'use strict';
// After email activation, replace the email with the random endpoint from FormSubmit.
const FORM_ENDPOINT = 'https://formsubmit.co/pys921104188@gmail.com';
const STORAGE_KEY = 'ilgam-request-id'; // No contact information is saved in web storage.
const $ = (s) => document.querySelector(s);
const idPattern = /^IG-[a-f0-9-]{36}$/;
function getId() {
  try { const saved = sessionStorage.getItem(STORAGE_KEY); if (idPattern.test(saved)) return saved; } catch (_) {}
  const id = 'IG-' + crypto.randomUUID();
  try { sessionStorage.setItem(STORAGE_KEY, id); } catch (_) {}
  return id;
}
function hidden(form, name, value) {
  let input = Array.from(form.elements).find(el => el.name === name);
  if (!input) { input = document.createElement('input'); input.type = 'hidden'; input.name = name; form.append(input); }
  input.value = value;
}
function phoneError(input) {
  const raw = input.value.trim();
  const normalized = raw.replace(/[\s()-]/g, '');
  const valid = /^0\d{8,10}$/.test(normalized) || /^\+82\d{8,10}$/.test(normalized);
  input.setCustomValidity(valid ? '' : '지역번호를 포함한 연락처를 확인해 주세요. 예: 010-1234-5678');
  return valid;
}
function photoError() {
  const input = $('#photos');
  if (!input) return true;
  const files = Array.from(input.files);
  let message = '';
  if (files.length > 3) message = '사진은 최대 3장까지 첨부할 수 있어요.';
  else if (files.some(file => !['image/jpeg', 'image/png'].includes(file.type))) message = 'JPG 또는 PNG 사진을 선택해 주세요.';
  else if (files.reduce((sum, file) => sum + file.size, 0) > 8 * 1024 * 1024) message = '사진의 전체 용량을 8MB 이하로 줄여 주세요.';
  else if (files.some(file => file.size === 0)) message = '빈 파일은 첨부할 수 없어요. 다른 사진을 선택해 주세요.';
  input.setCustomValidity(message);
  $('#photo-status').textContent = message || (files.length ? `${files.length}장 선택됨 · ${(files.reduce((s,f)=>s+f.size,0)/1024/1024).toFixed(1)}MB` : '');
  return !message;
}
const params = new URLSearchParams(location.search);
if (params.get('step') === 'detail' && $('#detail-panel')) {
  $('#quick-panel').hidden = true; $('#detail-panel').hidden = false;
  $('#step-quick').removeAttribute('aria-current'); $('#step-detail').setAttribute('aria-current', 'step');
  const id = params.get('rid');
  if (idPattern.test(id)) { try { sessionStorage.setItem(STORAGE_KEY, id); } catch (_) {} }
}
for (const input of document.querySelectorAll('input[type="tel"]')) {
  input.addEventListener('input', () => input.setCustomValidity(''));
  input.addEventListener('blur', () => { if (input.value) phoneError(input); });
}
$('#photos')?.addEventListener('change', photoError);
for (const form of document.querySelectorAll('form')) {
  form.action = FORM_ENDPOINT;
  form.addEventListener('formdata', event => {
    const data = event.formData;
    const scopes = data.getAll('청소 범위');
    if (scopes.length) data.set('청소 범위', scopes.join(', '));
    if (form.id === 'detail-form') {
      // FormSubmit documents separate file fields; normalize the mobile multi-picker.
      data.delete('attachment');
      Array.from($('#photos').files).forEach((file, i) => data.append(i === 0 ? 'attachment' : `attachment${i + 1}`, file));
    }
  });
  form.addEventListener('submit', event => {
    const error = form.querySelector('.error'); error.hidden = true;
    if (!['https:', 'http:'].includes(location.protocol)) {
      event.preventDefault(); error.textContent = '신청은 웹 주소에서 가능해요. 운영자는 안내서에 따라 페이지를 먼저 배포해 주세요.'; error.hidden = false; return;
    }
    if (!navigator.onLine) { event.preventDefault(); error.textContent = '인터넷 연결을 확인한 후 다시 신청해 주세요.'; error.hidden = false; return; }
    const phone = form.querySelector('input[type="tel"]');
    phoneError(phone);
    if (form.id === 'detail-form') photoError();
    for (const input of form.querySelectorAll('input[required]:not([type="checkbox"]):not([type="tel"])')) {
      input.setCustomValidity(input.value.trim() ? '' : '내용을 입력해 주세요.');
      input.addEventListener('input', () => input.setCustomValidity(''), {once:true});
    }
    if (!form.reportValidity()) { event.preventDefault(); return; }
    const id = getId(); const step = form.id === 'quick-form' ? 'quick' : 'detail';
    hidden(form, '신청번호', id);
    hidden(form, '제출 시각', new Date().toISOString());
    hidden(form, '동의 안내 버전', '2026-09-20');
    hidden(form, '_url', location.origin + location.pathname);
    const next = new URL('thanks.html', location.href);
    next.search = new URLSearchParams({step, rid:id}).toString();
    hidden(form, '_next', next.href);
    // Native POST preserves the provider's CAPTCHA and file-upload flow.
    // The server, not this script, redirects to thanks.html after handling the submission.
    const button = form.querySelector('[type="submit"]');
    button.disabled = true; button.textContent = '스팸 방지 확인으로 이동 중…';
    setTimeout(() => { button.disabled = false; button.textContent = step === 'quick' ? '상담 신청하기 ↗' : '상세정보 전달하기 ↗'; }, 15000);
  });
}
window.addEventListener('pageshow', () => {
  for (const form of document.querySelectorAll('form')) {
    const button = form.querySelector('[type="submit"]'); button.disabled = false;
    button.textContent = form.id === 'quick-form' ? '상담 신청하기 ↗' : '상세정보 전달하기 ↗';
  }
});
const dialog = $('#privacy-dialog');
for (const button of document.querySelectorAll('.privacy-open')) button.addEventListener('click', () => dialog.showModal());
for (const button of document.querySelectorAll('.dialog-close')) button.addEventListener('click', () => dialog.close());
if ($('#success-title')) {
  const id = params.get('rid'); const step = params.get('step');
  if (idPattern.test(id) && ['quick','detail'].includes(step)) {
    $('#success-title').textContent = step === 'detail' ? '상세정보까지 전달했어요.' : '일감이가 전문가에게 전달했어요.';
    $('#success-description').textContent = '확인 후 연락드릴게요.';
    $('#request-id').textContent = `신청번호 ${id}`;
    if (step === 'quick') { $('#add-detail').hidden = false; $('#add-detail').href = 'index.html?' + new URLSearchParams({step:'detail',rid:id}); }
  } else {
    $('#success-title').textContent = '청소 상담을 시작해 볼까요?';
    $('#success-description').textContent = '연락처를 남겨주시면 상담을 도와드릴게요.';
    $('#success-icon').textContent = '＋'; $('#delivery-note').hidden = true;
  }
}
