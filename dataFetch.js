// Example fetch url
// https://api.github.com/users/<username>/events

const fetchActivity = (username) => {
  const url = `https://api.github.com/users/${username}/events`;

  const peticion = fetch(url);

  peticion
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    })
    .catch(console.warn);
};

module.exports = { fetchActivity };
