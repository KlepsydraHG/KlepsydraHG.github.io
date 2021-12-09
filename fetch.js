const retrieve = (endpoint, authorization) => {
  const headers = authorization
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  return fetch(endpoint, {
    headers,
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status === "200") {
        return json;
      } else {
        throw new Error(json.message);
      }
    })
    .catch((err) => console.error(err));
};
