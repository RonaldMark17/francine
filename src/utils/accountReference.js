// Stable account reference for both existing and newly registered accounts.
export function getAccountReference(user) {
  return user.idNumber || `MM-${String(user.id).replace(/^usr-/, '').toUpperCase()}`;
}
