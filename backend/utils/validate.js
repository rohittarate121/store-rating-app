function validateName(name) {
  return name && name.length >= 20 && name.length <= 60;
}

function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { validateName, validatePassword, validateEmail };
