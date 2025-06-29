<h1>🔑 Setup X API Key</h1>
  <p>To set up an X API key (formerly Twitter), follow these steps:</p>

  <h2>1. Create an X Developer Account</h2>
  <p>
    Go to the 
    <a href="https://developer.x.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">
      X Developer Portal
    </a> 
    and sign up for a developer account. Choose a plan that suits your needs.
  </p>
  <div class="note">
    <strong>Note:</strong><br>
    The <strong>Free plan</strong> provides limited access to X's v2 API:
    <ul>
      <li>1 App / Environment</li>
      <li>Retrieve up to 100 posts</li>
      <li>Write up to 500 posts per month</li>
    </ul>
  </div>

  <h2>2. Create an App</h2>
  <p>
    Once your developer account is ready, create a new App by providing:
    <ul>
      <li>A name and description</li>
      <li>The required permissions (e.g., Read/Write)</li>
    </ul>
  </p>
  <img src="https://github.com/user-attachments/assets/571e1462-5008-4ea6-bfae-85ea73840d16" alt="App Creation Screenshot" width="450">

  <h2>3. Generate API Keys</h2>
  <p>
    Go to your app’s settings and generate your API keys:
    <ul>
      <li>Bearer Token (OAuth 2.0)</li>
      <li>Other necessary credentials</li>
    </ul>
    These keys will be used to authenticate your application.
  </p>
  <img src="https://github.com/user-attachments/assets/ddbc2811-5466-464d-858c-825d3c88a4f0" alt="API Key Generation Screenshot" width="800">

  <h2>4. Configure Your Application</h2>
  <p>
    Copy your keys into your application config file.  
    Use the format in 
    <a href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/config_example.json" target="_blank" rel="noopener noreferrer">
      config_example.json
    </a>:
  </p>

  <pre><code>{
  "token": "Discord bot token here",
  "clientId": "Discord bot ID here",
  "riotApiKey": "Riot Game API key here",
  "xBearerToken": "X API key here"
}
</code></pre>

  <h2>5. Test Your Setup</h2>
  <p>
    Make a test API request using your configuration to confirm:
    <ul>
      <li>The API key is valid</li>
      <li>Your app is authenticated</li>
      <li>The connection to the X API works</li>
    </ul>
  </p>

  <p><strong>✅ Your application is now ready to interact with the X API!</strong></p>

</body>
</html>
