var actionTable = [
  'Say',
  'GetFrontPage',
  'ShowPic',
  'GetCapitals',
  'GetFirstElement',
  'DisplayCityWeather',
  'DisplayCityThumbnail',
  'EndOfSub',
  'Debug'
];

function registerActions(onloadCB) {
  var actionCopyTable = actionTable.slice(0);
  function recursiveReg() {
    var actionName = actionCopyTable.shift();
    var actionObject = {"name":actionName, "start":actionName, "cancel":"cancel"};
    registerAction(JSON.stringify(actionObject), actionCopyTable.length == 0 ? onloadCB : recursiveReg);
  }
  recursiveReg();
}

function Say(requestID, entityID, params) {
  messages.innerHTML += '<br/>' + entityID + ' : ' + params.message;
  sendSuccess(requestID);
}

function GetFrontPage(requestID, entityID, params) {
  loading.innerHTML = 'loading...';
  console.log('requesting front page');
  $.getJSON('http://www.reddit.com/r/{0}/new/.json?limit=16&after=t3_{1}&show=all&sr_detail&jsonp=?'.format(params.subreddit, params.after), function(data) {
    if (data.data.children.length == 0) {
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
    item.title = child.data.title;
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
  getEntityKnowledge(entityID, onloadCB = function(resp) {
    for (var i = 0; i < resp.front.length; ++i) {
      var kb = resp.front[i];
      loading.innerHTML = 'refreshing...';
      if (kb.thumbnail.indexOf('http') === 0) {
        messages.innerHTML += '<div class="col-md-3 col-sm-6""><div class="thumbnail" style="height:200px; overflow: hidden;"><a href="{0}" target="_blank"><img src="{1}" style="max-height: 100px;"></a><div class="caption"><p><a href="http://www.reddit.com/{3}" target="_blank">{2}</a></p></div></div></div>'.format(kb.url, kb.thumbnail, kb.title, kb.permalink, kb.subreddit);
      }
    }
    $('#results').animate({scrollTop: document.getElementById('messages').offsetHeight}, 1000);
    updateEntityKnowledge(entityID, 'front', 0, function() {
      loading.innerHTML = '';
      sendSuccess(requestID);
    });
  });
}

function GetCapitals(requestID, entityID, params) {
  function matchCapital(title) {
    var matching = '';
    countries.some(function(i) {
      var regex = new RegExp('\\b' + i.capital + '\\b', 'i');
      regex.exec(title) !== null ? res = regex.toString().replace('/\\b', '').replace('\\b/i', '') : res = '';
      matching = res;
      return res;
    });
    return matching;
  }
  getEntityKnowledge(entityID, onloadCB = function(resp) {
    var cityList = [];
    for (var i = 0; i < resp.results.content.length; ++i) {
      var kb = resp.results.content[i];
      var capitalName = matchCapital(kb.title);
      if (kb.thumbnail.indexOf('http') === 0) {
        if (capitalName != '') {
          if (matchedCapitals.indexOf(capitalName) == -1) {
            matchedCapitals.push(capitalName);
            var j = 0;
            for (var item in countries) {
              if (countries[item].capital == capitalName) {
                break;
              }
              j++;
            }
            var cityName = countries[j].capital + ', ' + countries[j].name + ', ' + countries[j].code;
            cityList.push({'name': cityName, 'pic': kb.thumbnail, 'url': kb.url});
          }
        }
      }
    }
    sendSuccess(requestID, '{"capitals":' + JSON.stringify(cityList) + '}');
  });
}

function GetFirstElement(requestID, entityID, params) {
  getEntityKnowledge(entityID, onloadCB = function(resp) {
    if (resp.capitals === null) {
      sendFailure(requestID);
    }
    else {
      var out = {};
      var array = resp.capitals;
      out.element = array.shift();
      out.capitals = array;
      updateEntityKnowledge(entityID, 'capitals', null, function() {
        updateEntityKnowledge(entityID, 'capitals', out.capitals, function() {
          updateEntityKnowledge(entityID, 'nextCapital', out.element, function() {
            sendSuccess(requestID);
          });
        });
      });
    }
  });
}

function DisplayCityWeather(requestID, entityID, params) {
  function getWeather(name) {
    function displayOnMap(city, image) {
      geocoder.geocode({'address': city}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var img = {
            url: image,
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
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + name, function(data) {
      if (typeof(data.weather) !== 'undefined') {
        displayOnMap(name, 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
      }
      else if (name.split(',').length == 3) {
        name = name.split(',')[0] + ',' + name.split(',')[2];
        getWeather(name);
      }
    });
  }
  getWeather(params.city.name);
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
  console.log('message from', entityID + ':', params.message);
  sendSuccess(requestID);
}
