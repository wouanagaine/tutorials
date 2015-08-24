String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { return typeof args[number] != 'undefined' ? args[number] : match; });
};

var simID;
var entityID;
console.log(window.location.href);
var httpURL;
var wsURL;

function createSimulation(user, project, version, onloadCB) {
  httpURL = 'http://' + RUNTIME_URL + '/api/v1/' + user + '/' + project + '/' + version;
  wsURL = 'ws://' + RUNTIME_URL + '/api/v1/' + user + '/' + project + '/' + version;
  var oReq = new XMLHttpRequest();
  oReq.open('PUT', httpURL + '?' + 'scope=app', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    simID = oReq.responseText;
    onloadCB(simID);
  };
  oReq.onerror = function() {
    alert('error while creating simulation');
  };
  oReq.send();
}

function destroySimulation(onloadCB) {
  console.log('delete');
  //clearInterval( idUpdate );
  var oReq = new XMLHttpRequest();
  oReq.open('DELETE', httpURL + '/' + simID, true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.send();
  oReq.onload = onloadCB;
}

function createEntity(behavior, knowledge, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('PUT', httpURL + '/' + simID + '/entities', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    onloadCB(oReq.responseText);
  };
  oReq.onerror = function() {
    alert('error while creating entity ');
  };
  var params = {};
  params.behavior = behavior;
  params.knowledge = knowledge;
  oReq.send(JSON.stringify(params));
}

function update() {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + simID + '/update', true);
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

function cancel(requestID, entityID, params) {
  sendCancel(requestID);
}

function getEntityKnowledge(entityID, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('GET', httpURL + '/' + simID + '/entities/' + entityID + '/knowledge', true);
  oReq.setRequestHeader('Content-type', 'application/json');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function() {
    onloadCB(JSON.parse(oReq.responseText));
  };
  oReq.onerror = function(e) {
    alert('error ' + e.target.status + ' while retrieving the knowledge');
  };

  oReq.send();

}

function updateEntityKnowledge(entityID, destination, value, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + simID + '/entities/' + entityID + '/knowledge', true);
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
  oReq.open('POST', httpURL + '/' + simID + '/actions/' + requestID + '/success', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);

  oReq.send(jsonString);
}

function sendFailure(requestID, jsonString) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + simID + '/actions/' + requestID + '/failure', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.send(jsonString);
}

function sendCancel(requestID) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + simID + '/actions/' + requestID + '/cancelation', true);
  oReq.setRequestHeader('content-type', 'application/html; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.send();
}
function setOutput(requestID, jsonString, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('POST', httpURL + '/' + simID + '/actions/' + requestID + '/output', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function(responseText) {
    onloadCB();
  };
  oReq.onerror = function() {
    alert('error while setting output of action request ' + requestID);
  };
  oReq.send(jsonString);
}

function registerAction(jsonString, onloadCB) {
  var oReq = new XMLHttpRequest();
  oReq.open('PUT', httpURL + '/' + simID + '/actions', true);
  oReq.setRequestHeader('content-type', 'application/json; charset=utf-8');
  oReq.setRequestHeader('accept', '');
  oReq.setRequestHeader('X-Craft-Ai-App-Id', TUTO_APP_ID);
  oReq.setRequestHeader('X-Craft-Ai-App-Secret', TUTO_APP_SECRET);
  oReq.onload = function(responseText) {
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
  var wsUrlRoute = wsURL + '/' + simID + '/websockets';
  console.log('WS Connexion on', wsUrlRoute + ':');
  if (wsUrlRoute) {
    console.log('requesting WS connexion...');
    ws = new WebSocket(wsUrlRoute);
    ws.onmessage = function(evt) {
      if (evt.data != 'ping') {
        var jsonEvt = JSON.parse(evt.data);
        console.log('WS data:', evt.data);
        window[jsonEvt.call](jsonEvt.requestId , jsonEvt.entityId, jsonEvt.input);
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
