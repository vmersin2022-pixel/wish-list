export const getGuestUid = () => {
  let uid = localStorage.getItem('guest_uid');
  if (!uid) {
    uid = 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guest_uid', uid);
  }
  return uid;
};

export const getGuestName = () => {
  return localStorage.getItem('guest_name') || '';
};

export const setGuestName = (name: string) => {
  localStorage.setItem('guest_name', name);
};
