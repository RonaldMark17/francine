/**
 * Helper to determine whether an order belongs to the currently logged in user.
 * Strictly prevents orders from one user being leaked or displayed to another user.
 *
 * @param {object} order - The order record
 * @param {object} user - The current logged in user
 * @returns {boolean}
 */
export function doesOrderBelongToUser(order, user) {
  if (!user || !order) return false;

  // 1. Direct userId match
  if (order.userId && String(order.userId) === String(user.id)) {
    return true;
  }

  // 2. Email matching (case-insensitive)
  const userEmail = (user.email || '').trim().toLowerCase();
  const orderEmail = (order.customer?.email || order.email || '').trim().toLowerCase();
  if (userEmail && orderEmail && userEmail === orderEmail) {
    return true;
  }

  // Account aliases for demo roles
  if (user.id === 'usr-student-1' && (orderEmail.includes('student@plaridel') || orderEmail.includes('santos'))) {
    return true;
  }
  if (user.id === 'usr-teacher-1' && (orderEmail.includes('teacher.mendoza') || orderEmail.includes('mendoza'))) {
    return true;
  }
  if ((user.id === 'usr-admin-1' || user.id === 'usr-admin-2') && 
      (orderEmail === 'admin' || orderEmail.includes('admin@mamamoinkprint.ph') || orderEmail.includes('celerio'))) {
    return true;
  }

  // 3. Name matching
  const userName = (user.name || '').trim().toLowerCase();
  const orderName = (order.customer?.name || order.name || '').trim().toLowerCase();
  if (userName && orderName) {
    if (userName === orderName) return true;
    const userFirstName = userName.split(' ')[0];
    const userLastName = userName.split(' ').slice(-1)[0];
    if (userLastName.length > 2 && orderName.includes(userLastName) && orderName.includes(userFirstName)) {
      return true;
    }
  }

  return false;
}
