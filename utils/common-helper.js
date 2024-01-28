const validateFields = (req, res, requiredFields) => {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send({
        success: false,
        message: `${field.replace('_', ' ').capitalize()} is required`,
      });
    }
  }

  return null
};

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};

module.exports = { validateFields, getKey }