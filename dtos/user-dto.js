exports.getUserDto = (model) => {
  const { _id, email, userName, isActivated } = model;
  return {
    id: _id,
    email,
    userName,
    isActivated,
  };
};
