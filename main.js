document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  loginUser(); 
});


const loginUser = async () => {
  const username = document.getElementById('username').value; 
  const password = document.getElementById('password').value; 
      const { data } = await axios.get(`https://itqan-online.com/apps/test-visits/api.php?fun=login&user=${username}&pass=${password}`);
      const messageElement = document.getElementById('message');
      if (data.result === 'Username_Or_Password_Missing') {
          messageElement.textContent = 'Please fill all feilds';
      } else if (data.result === 'Username_Or_Password_Wrong') {
          messageElement.textContent = 'Invalid username or password.';
      } else if (Array.isArray(data.result) && data.result[0] === 'TOKEN') {
          window.location.href = './search.html'; 
      } else {
          messageElement.textContent = 'An unexpected error occurred.';
      
  } 
};

