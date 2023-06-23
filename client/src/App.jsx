import { OAuthPopup, useOAuth2 } from "@tasoskakour/react-use-oauth2";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as React from "react";
import dayjs from 'dayjs';

const Home =  () => {
	const { data, loading, error, getAuth, logout } = useOAuth2({
		authorizeUrl: 'https://discord.com/oauth2/authorize',
		clientId: '1120485891035648001',
		redirectUri: `${document.location.origin}/callback`,
		scope: 'identify',
		responseType: 'code',
		exchangeCodeForTokenServerURL: 'http://192.168.1.24:9000/token',
		exchangeCodeForTokenMethod: 'POST',
		onSuccess: (payload) => console.log('Success', payload),
		onError: (error_) => console.log('Error', error_),
	});

  const [userId, setUserId] = React.useState([]);
  const [game, setGame] = React.useState([]);
  const [gameWhen, setGameWhen] = React.useState([]);
    const [active, setActive] = React.useState(false);
    const [duration, setDuration] = React.useState([]);

  React.useEffect(() => {
    if (data && data.access_token){
    fetch('https://discord.com/api/users/@me', {headers: { authorization: `${data.token_type} ${data.access_token}`}})
      .then((res) => res.json())
      .then((user) => {
        setUserId(user.id);
      })
      .catch((err) => {
        console.log(err.message);
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (userId != ''){
    fetch(`http://192.168.1.24:9000/data?userId=${userId}`)
       .then((res) => res.json() )
       .then((movieData) => {
          console.log(movieData);
          setGame(movieData[0].gameName);
        let day = dayjs(movieData[0].startTimestamp);
          setGameWhen(day.format('DD/MM/YYYY [at] h:mm A'));
        if (movieData[0].endTimestamp == null)
          {
            setActive(true);
          }
        else
          {
            console.log(movieData[0]);
            let end = dayjs(movieData[0].endTimestamp);
            const diff = end.diff(day, 'm');
            
            
            setDuration(diff);
          }
       })
       .catch((err) => {
          console.log(err.message);
       });
      }
 }, [userId]);
  
  // fetch('https://discord.com/api/users/@me', {
  //   headers: {
  //     authorization: `${data.token_type} ${data.access_token}`,
  //   },
  // }.then((res) => res.json())
  // , []);

  const isLoggedIn = Boolean(data?.access_token); // or whatever...

  if (error) {
    return <div>Error</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {
    return (
      <div>
        <pre>data: {JSON.stringify(data)}</pre>
        <pre>{userId}</pre>
        <pre>{game}</pre>
        <pre>{gameWhen}</pre>
        <pre>{duration} </pre>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <button style={{ margin: "24px" }} type="button" onClick={() => getAuth()}>
      Login
    </button>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<OAuthPopup />} path="/callback" />
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;