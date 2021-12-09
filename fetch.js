const retrieve = (endpoint, authorization) => {
  const headers = authorization
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/html; charset=iso-8859-1",
      }
    : {};
  return fetch(endpoint, {
    headers,
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((json) => {
      if (json.status === "200") {
        return json;
      } else {
        throw new Error(json.message);
      }
    })
    .catch((err) => console.error(err));
};
