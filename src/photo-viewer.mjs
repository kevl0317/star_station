// One delegated viewer also handles cards rendered after a level ends.
export function initPhotoViewer() {
  if (document.getElementById('photo-viewer')) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'photo-viewer';
  dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-labelledby', 'photo-viewer-title');
  dialog.innerHTML = `<div class="photo-viewer-bar"><span id="photo-viewer-title"></span><button type="button" aria-label="关闭图片预览" autofocus>关闭 ×</button></div><img alt=""><p class="photo-viewer-error" hidden>图片暂时无法加载，请关闭后重试。</p>`;
  document.body.append(dialog);
  const img = dialog.querySelector('img');
  const error = dialog.querySelector('.photo-viewer-error');
  let opener;
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  img.addEventListener('error', () => { error.hidden = false; });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-photo-src]');
    if (!button) return;
    event.preventDefault();
    opener = button;
    error.hidden = true;
    img.alt = button.dataset.photoTitle || '知识卡图片';
    dialog.querySelector('#photo-viewer-title').textContent = img.alt;
    img.src = button.dataset.photoSrc;
    dialog.showModal();
  });
  dialog.addEventListener('keydown', (event) => event.stopPropagation());
}
