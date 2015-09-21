String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { return typeof args[number] != 'undefined' ? args[number] : match; });
};

var instanceID;
var agentID;
console.log(window.location.href);
var httpURL;
var wsURL;

function createInstance(user, project, version, onloadCB) {
  httpURL = 'https://' + RUNTIME_URL + '/api/v1/' + user + '/' + project + '/' + version;
  wsURL = 'wss://' + RUNTIME_URL + '/api/v1/' + user + '/' + project + '/' + version;
  var oReq = new XMLHttpRequest();
  oReq.open('PUT', httpURL + '?' + 'scope=app', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    instanceID = JSON.parse(oReq.responseText).instance.instance_id;
    onloadCB(instanceID);
  };
  oReq.onerror = function() {
    alert('error while creating instance');
  };
  oReq.send();
}

function destroyInstance(onloadCB) {
  console.log('delete');
  //clearInterval( idUpdate );
  var oReq = new XMLHttpRequest();
  oReq.open('DELETE', httpURL + '/' + instanceID, true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.send();
  oReq.onload = onloadCB;
}

function createAgent(behavior, knowledge, onloadCB, onErrorCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('PUT', httpURL + '/' + instanceID + '/agents', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    onloadCB();
  };
  oReq.onerror = function() {
    onErrorCB();
  };
  var params = {};
  params.behavior = behavior;
  params.knowledge = knowledge;
  oReq.send(JSON.stringify(params));
}

function update() {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + instanceID + '/update', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
  };
  oReq.onerror = function() {
    alert('error while updating the instance');
  };
  oReq.send('{"time":0.5,"ts":' + new Date().getTime() + '}');
}

function cancel(requestID, agentID, params) {
  sendCancel(requestID);
}

function getAgentKnowledge(agentID, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('GET', httpURL + '/' + instanceID + '/agents/' + agentID + '/knowledge', true);
  oReq.setRequestHeader('Content-type', 'application/json');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    onloadCB(JSON.parse(oReq.responseText).knowledge);
  };
  oReq.onerror = function(e) {
    alert('error ' + e.target.status + ' while retrieving the knowledge');
  };

  oReq.send();

}

function updateAgentKnowledge(agentID, destination, value, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + instanceID + '/agents/' + agentID + '/knowledge', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);

  oReq.onload = function() {
    onloadCB();
  };
  var j = {};
  j[destination] = value;
  oReq.send(JSON.stringify(j));

}

function updateInstanceKnowledge(destination, value, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + instanceID + '/instanceKnowledge', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);

  oReq.onload = function() {
    onloadCB();
  };
  var j = {};
  j[destination] = value;
  oReq.send(JSON.stringify(j));

}

function updateGlobalKnowledge(destination, value, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + simID + '/globalKnowledge', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);

  oReq.onload = function() {
    onloadCB();
  };
  var j = {};
  j[destination] = value;
  oReq.send(JSON.stringify(j));

}

function sendSuccess(requestID, jsonString) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + instanceID + '/actions/' + requestID + '/success', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);

  oReq.send(jsonString);
}

function sendFailure(requestID, jsonString) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + instanceID + '/actions/' + requestID + '/failure', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.send(jsonString);
}

function sendCancel(requestID) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + instanceID + '/actions/' + requestID + '/cancelation', true);
  oReq.setRequestHeader('content-type', 'application/html; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.send();
}

function registerAction(jsonString, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('PUT', httpURL + '/' + instanceID + '/actions', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    console.log('action', JSON.parse(jsonString).name, 'registred');
    onloadCB();
  };
  oReq.onerror = function() {
    alert('error while registering action ' + JSON.parse(jsonString).name);
  };
  oReq.send(jsonString);
}

function doUpdate() {
  idUpdate = setInterval(update, 500);
}

function doWS() {
  var wsUrlRoute = wsURL + '/' + instanceID + '/websockets';
  console.log('WS Connexion on', wsUrlRoute + ':');
  if (wsUrlRoute) {
    console.log('requesting WS connexion...');
    ws = new WebSocket(wsUrlRoute);
    ws.onmessage = function(evt) {
      if (evt.data != 'ping') {
        var jsonEvt = JSON.parse(evt.data);
        console.log('WS data:', evt.data);
        window[jsonEvt.call](jsonEvt.requestId , jsonEvt.agentID, jsonEvt.input);
      }
      else {
        console.log('ping');
      }
      ws.send('Done');
    };
    ws.onopen = function() {
      ws.send('socket open');
      console.log('WS Connexion open', ws);
    };
    ws.onclose = function() {
      console.log('WS Connexion closed', ws);
    };
    ws.onerror = function() {
      console.log('WS Connexion error', ws);
    };
  }
}
