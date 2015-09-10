var actionTable = [
  'Say',
  'GetFrontPage',
  'ShowPic',
  'GetCapitals',
  'GetFirstElement',
  'GetCityWeather',
  'DisplayCityWeather',
  'DisplayCityThumbnail',
  'EndOfSub',
  'Debug',
  'Prompt'
];

function registerActions(onloadCB) {
  var actionCopyTable = actionTable.slice(0);
  function recursiveReg() {
    var actionName = actionCopyTable.shift();
    var actionObject = {'name':actionName, 'start':actionName, 'cancel':'cancel'};
    registerAction(JSON.stringify(actionObject), actionCopyTable.length === 0 ? onloadCB : recursiveReg);
  }
  recursiveReg();
}

function Say(requestID, entityID, params) {
  messages.innerHTML += '<br/>Agent ' + entityID + ' says: ' + params.message;
  $('#results').animate({scrollTop: document.getElementById('messages').offsetHeight}, 1000);
  sendSuccess(requestID);
}

function GetFrontPage(requestID, entityID, params) {
  loading.innerHTML = 'loading...';
  console.log('requesting front page');
  $.getJSON('http://www.reddit.com/r/{0}/new/.json?limit=16&after=t3_{1}&show=all&sr_detail&jsonp=?'.format(params.subreddit, params.after), function(data) {
    if (data.data.children.length === 0) {
      sendFailure(requestID, JSON.stringify({'reason': 'No more posts here'}));
    }
    else {
      var usefull = [];
      var lastID = '';
      $.each(data.data.children, function(index, child) {
    var item = {};
    item.domain = child.data.domain;
    item.subreddit = child.data.subreddit;
    item.url = child.data.url;
    item.thumbnail = child.data.thumbnail;
    item.name = child.data.title;
    item.id = child.data.id;
    item.permalink = child.data.permalink;
    usefull.push(item);
    lastID = item.id;
  });
      var out = {};
      out.last = lastID;
      out.frontpage = usefull;
      sendSuccess(requestID, JSON.stringify(out));
      loading.innerHTML = '';
    }
  });
  this.addEventListener('error', function() {
    sendFailure(requestID, JSON.stringify({'reason': 'Invalid subreddit name'}));
  }, true);
}

function ShowPic(requestID, entityID, params) {
  for (var i = 0; i < params.front.length; ++i) {
    var kb = params.front[i];
    loading.innerHTML = 'refreshing...';
    if (kb.thumbnail.indexOf('http') === 0) {
      messages.innerHTML += '<div class="col-md-3 col-sm-6""><div class="thumbnail" style="height:200px; overflow: hidden;"><a href="{0}" target="_blank"><img src="{1}" style="max-height: 100px;"></a><div class="caption"><p><a href="http://www.reddit.com/{3}" target="_blank">{2}</a></p></div></div></div>'.format(kb.url, kb.thumbnail, kb.name, kb.permalink, kb.subreddit);
    }
  }
  $('#results').animate({scrollTop: document.getElementById('messages').offsetHeight}, 1000);
  loading.innerHTML = '';
  sendSuccess(requestID);
}

function GetCapitals(requestID, entityID, params) {
  function matchCapital(name) {
    var matching = '';
    countries.some(function(i) {
      var regex = new RegExp('\\b' + i.capital + '\\b', 'i');
      regex.exec(name) !== null ? res = regex.toString().replace('/\\b', '').replace('\\b/i', '') : res = '';
      matching = res;
      return res;
    });
    return matching;
  }
  var cityList = [];
  for (var i = 0; i < params.content.length; ++i) {
    var kb = params.content[i];
    var key = params.key || 'name';
    var capitalName = matchCapital(kb[key]);
    if (capitalName !== '') {
      if (matchedCapitals.indexOf(capitalName) == -1) {
        matchedCapitals.push(capitalName);
        var j = 0;
        for (var item in countries) {
          if (countries[item].capital == capitalName) {
            break;
          }
          j++;
        }
        var cityName = countries[j].name;
        cityList.push({'name': cityName, 'pic': kb.thumbnail, 'url': kb.url});
      }
    }
  }
  sendSuccess(requestID, '{"capitals":' + JSON.stringify(cityList) + '}');
}

function GetFirstElement(requestID, entityID, params) {
  if (params.array === null) {
    sendFailure(requestID);
  }
  else {
    var out = {};
    var array = params.array;
    out.element = array.shift();
    out.capitals = array;
    sendSuccess(requestID, '{"capitals":' + JSON.stringify(out.capitals) + ', "element":' + JSON.stringify(out.element) + '}');
  }
}

function GetCityWeather(requestID, entityID, params) {
  function getWeather(city) {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + city, function(data) {
      if (data.weather !== undefined) {
        sendSuccess(requestID, '{"weather":' + JSON.stringify(data.weather[0]) + '}');
      }
      else if (city.split(',').length == 3) {
        city = city.split(',')[0] + ',' + city.split(',')[2];
        getWeather(city);
      }
      else if (city.split(',').length == 2) {
        city = city.split(',')[0];
        getWeather(city);
      }
      else {
        sendFailure(requestID, '{"weather": { "description": "No weather found for ' + city + '"}}');
      }
    })
    .error(sendFailure(requestID));
  }
  getWeather(params.cityName);
}

function DisplayCityWeather(requestID, entityID, params) {
  function displayOnMap(city, weather) {
    geocoder.geocode({'address': city}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var img = {
          url: 'http://openweathermap.org/img/w/' + weather.icon + '.png',
          size: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25)
        };
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: img
        });
        map.panTo(results[0].geometry.location);
        marker.setAnimation(google.maps.Animation.DROP);
      }
      else {
        console.log('Geocode was not successful for the following reason: ' + status);
        sendFailure(requestID);
      }
    });
  }
  displayOnMap(params.cityName, params.cityWeather);
  sendSuccess(requestID);
}

function DisplayCityThumbnail(requestID, entityID, params) {
  capitalsID.innerHTML += '<div class="col-md-6"><div class="thumbnail capitalThumb" style="height: 160px; overflow: hidden;"><a href="{1}" target="_blank"><img src="{2}" style="max-height: 100px;"></a><div class="caption" style="text-align:center;"><strong>{0}</strong></div></div></div>'.format(params.city.name, params.city.url, params.city.pic);
  $('#capitals').animate({scrollTop: document.getElementById('capitalsID').offsetHeight}, 1000);
  sendSuccess(requestID);
}

function EndOfSub(requestID, entityID, params) {
  $('#next').prop('disabled', true);
  $('#nextFooter').prop('disabled', true);
  messages.innerHTML += '<div class="col-md-3 col-sm-6"><div class="thumbnail endOfSub" style="height: 200px;"><img src="http://ipadwatcher.com/wp-content/uploads/2010/05/dead-end.jpg" style="height: 120px;"><div class="caption" style="text-align:center;"><h4>{0}</h4></div></div></div>'.format(params.message);
  $('#results').animate({scrollTop: document.getElementById('messages').offsetHeight}, 1000);
  loading.innerHTML = '';
  sendSuccess(requestID);
}

function Debug(requestID, entityID, params) {
  console.log('message from agent', entityID + ':', params.message);
  sendSuccess(requestID);
}

function Prompt(requestID, entityID, params) {
  var succeeds = function() {
    $('#prompt').off('hidden.bs.modal', succeeds);
    sendSuccess(requestID, '{"answer":' + JSON.stringify($('#promptinput').val()) + '}');
  };
  $('#prompt').on('hidden.bs.modal', succeeds);
  $('#prompt').on('shown.bs.modal', function() {
    $('#promptinput').focus();
  });
  $('#promptinput').prop('value', '');
  promptmessage.innerHTML = params.message;
  $('#prompt').modal('show');
}
