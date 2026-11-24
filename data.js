export const projects = [
  { id: 1, title: 'Đo phổ quang học',
    tags: ['python', 'data'] },
  { id: 2, title: 'Portfolio cá nhân',
    tags: ['web', 'css'] },
  { id: 3, title: 'Dashboard nhiệt độ',
    tags: ['web', 'data'] },
  { id: 4, title: 'Mô phỏng con lắc',
    tags: ['python'] },
];
async function showRepos(user) {
  state.textContent = 'Đang tải…';
  list.textContent = '';
  try {
    const repos = await loadRepos(user);
    state.textContent = repos.length ? ''
      : 'Chưa có repo công khai.';
    repos.forEach((r) => list.append(repoCard(r)));
  } catch (err) {
    state.textContent = 'Không tải được: ' + err.message;
    const again = document.createElement('button');
    again.textContent = 'Thử lại';
    again.onclick = () => showRepos(user);
    state.append(again);
  }
}
showRepos('nhipham0928');