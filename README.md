# Kazoo Remote Forward
This Express app communicates with Kazoo (by 260Hz) to provide users to manage remotely call forwarding.
* It will announce to the caller with the current status
* Provides the caller the option to toggle call forwarding
* Provides the caller the option to change the the number where calls are being forwarded
* Provides the caller the option of changing settings after announcing the current settings
  * Bypass deskphone
  * Require keypress (leave voicemails on forwarded number / allow use of cellphones voicemail)
  * Caller ID to show (caller's or companies)
  * Forward only direct calls or all calls
* Provides the caller the option to place an outgoing call using the companies caller ID (or is specified a CID for this user it will use that CID)
* Provides the caller the option to login to voicemail

# Installation
1. Clone this repository to your desired server
2. In package.json add your base URL and API key in the start script
3. Run **npm i** to install dependencies
4. Create an DNS record for url convenience 
5. Run **npm run start**

# Kazoo setup
1. In the **Pivot** app select the **Numbers Routing** tab
2. Click on **Create new Pivot Action**
  ![image](https://github.com/joshuamargareten/Kazoo-Remote-Forward/assets/106287331/89a5a65c-e1f2-4de9-978a-c933d4ca20e6)

3. Add a friendly name for the Pivot
4. Select an extension or spare number, or purchase a new DID
5. In the URL field add the URL or IP address to your server
6. Method can be either option
7. Format should be set to Kazoo
8. Click on **Save**

   ![image](https://github.com/joshuamargareten/Kazoo-Remote-Forward/assets/106287331/e12d1845-821d-49f1-a77b-dcc525570cb7)


# Debug
1. In the **Pivot** app select the **Live Debug** tab
2. Select the log you wish to check
3. Click on **View details**
