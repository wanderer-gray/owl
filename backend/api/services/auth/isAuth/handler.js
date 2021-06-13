module.exports = async function operation(request, { log }) {
  log.trace('isAuth');
  log.debug(request.cookies);

  const { userId } = request.cookies;

  return !!userId;
};
