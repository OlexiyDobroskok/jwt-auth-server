exports.getUserDto = (model) => {
  const { _id, email, userName, isActivated, date } = model;
  return {
    id: _id,
    email,
    userName,
    isActivated,
    date: date.toString(),
  };
};
