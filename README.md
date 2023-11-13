<h1>menehune</h1>
<img src="https://github.com/HACC2023/Supersonic-Legends/blob/main/uhmenehune-transparent.png" style="width:150;"/><sup>small, strong, and smart</sup>
<p><b>menehune</b> is an assistant that provides students, employees, and faculty information about the University of Hawaii <u>before</u> and <u>as</u> you need it.</p>
<p>This prototype version of this application specializes in UH Information Technology Services support and UH Information Security Policies.</p>
<h2>Overview</h2>
<p><b>menehune</b> is an extension (Google Chrome) to your web browser that constantly monitors what you are viewing.  <b>menehune</b> is tuned to look for specific keywords in the pages called "special text".  The "special text" is associated with a specially crafted Google AI prompt relevant to "hawaii.edu" webpage the user is viewing.  That prompt is automatically sent to the Google AI service (Seach and Conversation).  Google AI summarizes a response from the database of UH ITS AskUS webpages and UH information security policies.  The AI-generated summary response and citations to relevant documents are returned and displayed in the web browser extension.  Here is the current sample list of "specialText" and the correlating prompts:
  <code>
    const textPrompts = {
  items: [
    {
      specialText: "Sorry, you entered an invalid UH username or password",
      prompt: "I forgot my laulima password"
    },
    {
      specialText: "duo_form",
      prompt: "What is DUO and MFA"
    },
    {
      specialText: "mfa",
      prompt: "What is MFA"
    }, 
    {
      specialText: "duo",
      prompt: "What is DUO"
    }, 
    {
      specialText: "Welcome to Laulima",
      prompt: "what is laulima"
    },
    {
      specialText: "credit card",
      prompt: "is uh pci compliant?"
    },
    {
      specialText: "gmail",
      prompt: "how do i use gmail"
    },
    // Add more objects as needed
  ]
  </code>
</p>
<p><a href="https://github.com/HACC2023/Supersonic-Legends/blob/main/assets/menehune-2-Usage%20Examples-hevcmp4.mp4">Watch this video to see it in action.</a> (NOTE: The videos are also available in the assets folder in the repository).  At the beginning of the video, you can see prompts being manually input in the text box and sent to the Google AI API.  Responses are returned accodingly.  Later, you see AI prompts being sent automatically in the background to the Google AI API based on the content viewed.  For example:
  <ul>
    <li>Upon visiting the Laulima page, <b>menehune</b> automatically sent a prompt "What is laulima" to the Google AI API (which is seeded by UH AskUS and infosec policy documents).</li>
    <li>When a login to to Laulima failed, <b>menehuyne</b> automatically sent a prompt "I forgot my laulima password" to the Google AI API which generated relevant summaries and responses.</li>
    <li>When the user visited a page with "credit card" in the page, <b>menehune</b> automatically sent a prompt "is uh pci compliant?" to the Google AI API to generate relevant summaries and links to relevant policies.</li>
  </ul>
</p>
<h2>Guiding Principles</h2>
<ol>
  <li>I want direct answers.  I know I am talking to a machine.  Just give me relevant results and don't simulate a human.</li>
  <li>The assistant needs to provide answers automatically as much as possible.  I am not interested in conversing or having to develop the "right" question to get the "right" answer.</li>
  <li>I really don't want to call anyone.</li>
  <li>Detect what's wrong and give me a reason or solution.</li>
</ol>
<h2>Why This Technical Approach</h2>
<p>Google AI API (Search and Conversation) was used to ensure responses were limited to the information in the specific data provided: UH AskUS files and information security policies.  All results needed to be UH specific and not bring in other resources not directly from UH.  We had tested Microsoft's Power Virtual Agents and ChatBots.  The Google AI API was slightly simpler to use in this short amount of time specifically relating to authentication and permissions.  Microsoft's tool would likely be more appropriate for an enterprise heavily invested in the Microsoft 365 cloud services.</p>
<p>During testing, it was clear that generative AI/LLMs are not 100% accurate.  Developing a good prompt is key to reaping the benefits of this technology.  However, users are generally not interested in developing prompt skills.  Therefore, it is up to the <b>menehune</b> developers to identify key content in web pages and develop a relevant prompt to submit to the AI to develop summaries and cite relevant resources.  This human layer between the user and the AI is necessary to alleviate the burden on the user to develop/write prompts.  The user still has the option to type in their own prompt.  However, the "prompt engineering" should alleviate most needs for a user to write their own.</p>
<h2>Installation</h2>
<ol>
  <li>Download the <u>menehune</u> folder with all its files.</li>
  <li>Open your Google Chrome browser and go to "chrome://extensions"</li>
  <li>Add the Supersonic Legends profile to the Chrome browser using the email: menehune.hacc@gmail.com (the password will be provided by Slack direct message to Tiger Li).  Ensure you are logged into the menehune.hacc@gmail.com account by going to Gmail.</li>
  <li>At the top right of the page, turn on "Developer Mode" by moving the switch to the right.</li>
  <li>Click on the "Load Unpacked" button at the top left.</li>
  <li>Select the <u>menehune</u> directory of files you downloaded.</li>
  <li>In the "My Extensions" page, the <u>menehune</u> extension should be listed.</li>
  <li>Open the <b>menehune</b> extension by clicking on the browser's side panel icon at the top right.  Once the side panel is visible, select the <b>menehune</b> item from the drop-down menu.  The <b>menehune</b> application should be visible at this point.</li>  
</ol>
<p>View this <a href="https://github.com/HACC2023/Supersonic-Legends/blob/main/assets/menehune-1-Installation-hevcmp4.mp4">Installation Video.</a>  (NOTE: The videos are also available in the assets folder in the repository).</p>
<h2>Known Issues</h2>
<h3>2023-11-12</h3>
<ul>
  <li>Google API Rate Limits: Due to the level of subscription, requests to the Google API are limited and when they are exceeded, responses will not be returned.  If you make too many requests to the API in a minute, it is stops returning results.  Therefore, wait at least five (5) seconds in between requests to ensure the rate limit is not hit.  You can verify that the rate limit is the reason for the lack of responses by pointing your browser to "chrome://extensions" and viewing the "Errors" in the <b>menehune</b> extension.</li>
  <li>Sometimes, the prompt in the AskUs text area (where you input the prompt) is not refreshed when responses are updated.  This usually happens with the prompts sent in the background when a page is refreshed (versus when you manually press on the AskUs button).  It does not impact the results.</li>
  <li>This is limited to hawaii.edu content viewed in the Chrome browser.  This application will not monitor any other application or content.</li>
</ul>
