// ─── Regex Validation ─────────────────────────────────────────────────────────
// Returns array of failed rules (empty array = valid)

const validatePassword = (password, username, dob) => {
  const errors = [];

  if (!/[A-Z]/.test(password)) errors.push("Must contain at least one uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Must contain at least one lowercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Must contain at least one number.");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push("Must contain at least one special character.");
  if (password.length < 8) errors.push("Must be at least 8 characters long.");

  // Security restrictions
  if (password.toLowerCase() === username.toLowerCase())
    errors.push("Password must not match your username.");

  // DOB check — compare against common formats derived from dob (YYYY-MM-DD)
  const dobStripped = dob.replace(/-/g, ""); // e.g. 20001231
  const dobVariants = [
    dob,           // 2000-12-31
    dobStripped,   // 20001231
    dob.split("-").reverse().join(""), // 31122000
    dob.split("-").slice(1).join(""),  // 1231
  ];
  if (dobVariants.some((v) => password.includes(v)))
    errors.push("Password must not contain your date of birth.");

  return errors;
};

// ─── Strength Classification ─────────────────────────────────────────────────
// Returns "Weak", "Medium", or "Strong"

const classifyStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  if (password.length >= 16) score++;

  if (score <= 3) return "Weak";
  if (score <= 5) return "Medium";
  return "Strong";
};

module.exports = { validatePassword, classifyStrength };