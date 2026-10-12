export const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const isValidCollegeEmail = (email) => {
  return /^\S+@\S+\.edu(\.[a-z]+)?$/i.test(email) || /^\S+@\S+\.ac(\.[a-z]+)?$/i.test(email) || /^\S+@\S+\.\S+$/.test(email);
};

export const validatePasswordStrength = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
};
