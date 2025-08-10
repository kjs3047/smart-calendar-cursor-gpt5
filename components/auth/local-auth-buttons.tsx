'use client';

export function StartNowButton() {
  const onClick = () => {
    try {
      localStorage.setItem('sc_user', JSON.stringify({ id: 'local', name: 'Local User' }));
    } catch (e) {
      // noop
    }
    location.href = '/calendar';
  };
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
    >
      시작하기
    </button>
  );
}

export function LocalSignOutButton() {
  const onClick = () => {
    try {
      localStorage.removeItem('sc_user');
    } catch (e) {
      // noop
    }
    location.href = '/';
  };
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-white hover:opacity-90"
    >
      로그아웃
    </button>
  );
}
