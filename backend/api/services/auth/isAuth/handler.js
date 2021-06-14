module.exports = async function operation(request, { log }) {
  log.trace('isAuth');
  log.debug(request.cookies);

  const signUserId = request.cookies.userId;

  log.info(signUserId);

  if (!signUserId) {
    return false;
  }

  const result = request.unsignCookie(signUserId);

  log.info(result);

  return result.valid;
};
