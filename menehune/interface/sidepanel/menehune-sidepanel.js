// extract text when the page loades by receiving the message from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'extractText') {
    var extractedText = request.text;
    var prompt = checkText(extractedText);

    // print the prompt and extracted text to the debug area at the bottom of the sidepanel
    document.getElementById('extractedText').value = prompt + "\n\n" + extractedText;
    queryAskUs(prompt);
  }
});

// extracting text code by clicking on the extract button
document.addEventListener('DOMContentLoaded', function () {
  var extractButton = document.getElementById('extractButton');
  // enable and execute when the extract button is clicked
  extractButton.addEventListener('click', function () {
    console.error("extract button clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.error("tabs[0].id", tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractText' }, function (response) {
        if (response && response.text) {
          var extractedText = response.text;
          var prompt = checkText(extractedText);

          // print the prompt and extracted text to the debug area at the bottom of the sidepanel
          document.getElementById('extractedText').value = prompt + "\n\n" + extractedText;
          queryAskUs(prompt);
        }
      });
    });
  });
});

// specialText: the text we are looking for in the extracted text
// prompt: the text we want to send to ask us based on the specialText that is found
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
};


// function to check if special words or phrases are in the extracted text to determine the prompt to send to ask us
function checkText(text2check) {
  for (let i = 0; i < textPrompts.items.length; i++) {
    if (text2check.includes(textPrompts.items[i].specialText)) {
      return textPrompts.items[i].prompt;
    }
  }
}


// search and query function initiated by clicking the ask us button 
document.getElementById('askus_button').addEventListener('click', askus_clicked);

function askus_clicked() {
  const q = document.getElementById('query_textbox').value;
  queryAskUs(q);
}

function queryAskUs(qstring) {
  const headers = {
    "Content-Type": "application/json"
  };

  const data = {
    "query": {
      "input": qstring
    },
    "summarySpec": {
      "ignoreAdversarialQuery": true,
      "includeCitations": true
    }
  };

  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.error('Token acquired:', token);

    const fetchData = {
      method: 'POST',
      headers: {
        ...headers,
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    };

    // the url for the Google Discovery Engine API (Search and Conversation)
    const url = 'https://us-discoveryengine.googleapis.com/v1alpha/projects/803539608328/locations/us/collections/default_collection/dataStores/askusanytime-faq_1698171279282/conversations/-:converse';
    // debug print url and fetchData  
    console.error(url, JSON.stringify(fetchData))
    
    // query the Google Discovery Engine API (Search and Conversation) with the fetchData parameters 
    fetch(url, fetchData)
      .then(response => response.json())
      .then(data => {
        console.error('SUCCESS: Response data:', JSON.stringify(data));
        document.getElementById('query_textbox').innerText = "";
        // process the response from the Google Discovery Engine API (Search and Conversation)
        processData(data);
      })
      .catch(error => {
        console.error('eeeError:', error);
      });
  });// ends chrome.identity.getAuthToken



  /*const fetchData = {
    method: 'POST',
    headers: {
      ...headers,
      'Authorization': 'Bearer ya29.a0AfB_byBOCrutopSjlel_H6MK3h5Njjhx4-IKiEwfpbx9ezOZlSCSn39XYnGit_p3wzs86u9dwrvO2BBIs4C5ZH1xZwqBZlRqBMlfB2oftUIQdb95sjzvlwYPX2kUuqUcnZ8LI19qg_BGzDFasPiqmp6oGpivwWY5lj98KEzHqW0aCgYKAVUSARMSFQHGX2Miu27FvFGCxf-6zwDYe8fGKA0178',
    },
    body: JSON.stringify(data),
  };
  console.error(url, JSON.stringify(fetchData))
  */


  document.getElementById('message').innerHTML = "<p><b>Attempting to summarize an answer for you...</b></p>";
  fetch(url, fetchData)
    .then(response => response.json())
    .then(data => {
      console.error('SUCCESS: Response data:', JSON.stringify(data));
      processData(data);
    })
    .catch(error => {
      console.error('eeeError:', error);
    });
} // ends queryAskUs function

// process the response from the Google Discovery Engine API (Search and Conversation)
function processData(data) {
  reply = data.reply.reply;
  reply = reply.replace("No results could be found. Try rephrasing the search query.", "An AI-generated summary is not available. Submit a question in the query box above.  You may need to rephrase your question if you do not receive an applicable response.");
  document.getElementById('message').innerHTML = "<p><b>" + reply + "</b></p>";
  var searchResults = "";
  for (var i = 0; i < data.searchResults.length; i++) {
    title = data.searchResults[i].document.derivedStructData.title;
    title = title.replace(":: ASK US, University of Hawaii System", "");
    title = title.trim()
    link = data.searchResults[i].document.derivedStructData.link;
    link = link.replace("gs://", "https://storage.cloud.google.com/");
    searchResults += "<li><a href=\"" + link + "\" target=\"_blank\">" + title + "</a></li>";
  }
  document.getElementById('message').innerHTML += "<ol>" + searchResults + "</ol>";
  var query_textbox_text = data.conversation.messages[0].userInput.input;
  query_textbox_text = query_textbox_text.replace("undefined", ""); 
  document.getElementById('query_textbox').innerText = query_textbox_text;
}
