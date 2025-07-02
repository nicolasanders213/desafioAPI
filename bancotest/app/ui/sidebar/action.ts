export const postLogout = async () => {
  await fetch('/api/logout', {
    method: 'POST',
  });
};