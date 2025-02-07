// Example fetch url
// https://api.github.com/users/<username>/events

const cache = {};

const fetchActivity = async (username) => {
  const url = `https://api.github.com/users/${username}/events`;

  const cacheDuration = 5 * 60 * 1000;
  const cachedData = cache[username];
  if (cachedData && Date.now() - cachedData.timestamp < cacheDuration) {
    console.log('Data fetched from cache');
    console.log(JSON.stringify(cache, null, 2));
    return cachedData.data;
  }

  try {
    const peticion = await fetch(url);
    const data = await peticion.json();

    if (!peticion.ok) {
      if (peticion.status === 404) {
        console.log('User not found');
      } else {
        console.log(`Error fetching data: ${peticion.status}`);
      }
      return;
    }

    cache[username] = {
      data: data,
      timestamp: Date.now(),
    };
    return data;
  } catch (error) {
    console.error(error);
  }
};

const githubAct = async (username) => {
  await fetchActivity(username).then((data) => {
    if (data.length === 0) {
      console.log('No recent activity found.');
      return;
    }

    data.forEach((event) => {
      let action;
      switch (event.type) {
        case 'PushEvent':
          const commitCount = event.payload.commits.length;
          action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
          break;
        case 'IssuesEvent':
          action = `${
            event.payload.action.charAt(0).toUpperCase() +
            event.payload.action.slice(1)
          } an issue in ${event.repo.name}`;
          break;
        case 'WatchEvent':
          action = `Starred ${event.repo.name}`;
          break;
        case 'ForkEvent':
          action = `Forked ${event.repo.name}`;
          break;
        case 'CreateEvent':
          action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
          break;
        default:
          action = `${event.type.replace('Event', '')} in ${event.repo.name}`;
          break;
      }
      console.table(`- ${action}`);
    });
  });
};

module.exports = { githubAct };
