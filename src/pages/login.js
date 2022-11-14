import React from 'react';
/* global BigInt */

var setLoginToken = null;

function validateLogin(){
  //https://bigprimes.org/
  var password = document.getElementById("password").value;
  var master_password = 899698826925408217616668411965875890691630320222587056493923n;

  // var test = 1n;
  // var test_ascii_list = [];

  // while (test !== 0n){
  //   test_ascii_list.unshift(Number(test % 64n) + 33);
  //   test = test >> 6n;
  // }
  // console.log(String.fromCodePoint(...test_ascii_list));


  var test_ascii_list_1 = [];
  var test_ascii_list_2 = [];

  var password_1 = password.slice(0, 17);
  var password_2 = password.slice(17);


  var password_result_1 = 0n
  var password_result_2 = 0n

  while (password_1 !== ""){
    password_result_1 = password_result_1 << 6n;
    password_result_1 += BigInt(password_1.charCodeAt(0)) - 33n;
    test_ascii_list_1.push(password_1.charCodeAt(0));
    password_1 = password_1.slice(1);
  }
  while (password_2 !== ""){
    password_result_2 = password_result_2 << 6n;
    password_result_2 += BigInt(password_2.charCodeAt(0)) - 33n;
    test_ascii_list_2.push(password_2.charCodeAt(0));
    password_2 = password_2.slice(1);
  }

  var password_result = password_result_1 * password_result_2;

  if (password_result === master_password){
    console.log("match");
    setLoginToken(true);
  }
  else {
    document.getElementById("loginResult").textContent="Login Failed";
  }
}

export default function Login(props) {
  setLoginToken = props.setLoginToken;
  return(
    <>
      <style>{`
        .login-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

      `}</style>
      <div className="login-wrapper">
        <h1>Please Log In</h1>
        <form>
          <label>
            <p>Username</p>
            <input id="username" type="text" />
          </label>
          <label>
            <p>Password</p>
            <input id="password" type="password" />
          </label>
          <div>
            <br/>
            <button onClick={validateLogin} type="submit">Submit</button>
          </div>
          <br/>
          <span id="loginResult">  </span>
        </form>
      </div>
    </>
  )
}
