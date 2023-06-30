exports.getUserDto = (model) => {
  const { _id, email, username, isActivated } = model;
  return {
    id: _id,
    email,
    username,
    isActivated,
  };
};
