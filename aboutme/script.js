login("trolintermeda@trol.pl", "tajnehaslo").then((json) => {
  if (json !== undefined) {
    setToken(json.token);
  }
});
