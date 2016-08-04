angular.module('myApp.controllers', [])

.controller('loginController', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
    var self = this

    var loadingDone = false;

    var intervalID = window.setInterval(getPosition, 1000);

    function getPosition() {
        navigator.geolocation.getCurrentPosition(function(position) {
            // clearIntervalAndSuch();
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            $rootScope.currentPosition = pos;
            loadingDone = true;
            console.log('BOOL = true');
            console.log($rootScope.currentPosition);
        })
        if (loadingDone === true) {
            clearIntervalAndSuch();
        }
    }

    function clearIntervalAndSuch() {
        clearInterval(intervalID);
        displayPage();
    }

    function displayPage() {
        if (window.location.href.includes('code')) {
            var startingIndex = window.location.search.indexOf('code=') + 5
            $rootScope.code = window.location.search.substring(startingIndex, window.location.search.length)
            $http.post(`https://www.googleapis.com/oauth2/v4/token?code=${$rootScope.code}&client_id=709501805031-d87qamtke60go50st3tiv2lu235fpcfb.apps.googleusercontent.com&client_secret=Srv4Ep2JLkXSZnHdi_HGmYFY&redirect_uri=http://localhost:8000&grant_type=authorization_code`).then(function(response) {
                $rootScope.accessToken = response.data.access_token
                var postObj = {
                    accessToken: $rootScope.accessToken
                }
                $http.post('http://localhost:3000/google/oauth', postObj).then(function(data) {
                    $rootScope.username = data.data.email
                    $http.post('http://localhost:3000/google/new', {
                        username: $rootScope.username
                    }).then(function(data) {
                        $rootScope.user_id = data.data.user_id
                        if (data.data.firstTimeUser) {
                            $rootScope.firstTimeUser = true
                        }
                    })
                })
            })
        }
        loginAndSuch();
    }
    function loginAndSuch(){
      if (window.location.href.includes('code')) {
          $state.go('members')
      }
    }

}])

.controller('newsController', ['$http', '$rootScope', '$state', function($http, $rootScope, $state) {
    var self = this
    this.main = true
    this.saved = false
    this.currentSection = 'home'
    this.prefTabs = false
    console.log($rootScope);
    if ($rootScope.username) {
        $http.post('http://localhost:3000/news/getPreferences', {
            user_id: $rootScope.user_id
        }).then(function(prefs) {
            if (prefs.data.preferences) {
                self.prefTabs = true
                self.preferences = prefs.data.preferences
            } else {
                self.showPrefs = true
            }
        })
    }
    $http.get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=6acc556fbac84c2aa266476c82b9d4f2').then(function(data) {
        self.stories = data.data.results;
    })

    this.updateNewsPage = function(section) {
        $http.get(`https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=6acc556fbac84c2aa266476c82b9d4f2`).then(function(data) {
            self.stories = data.data.results
        })
        this.currentSection = section
    }

    this.gatherPreferences = function() {
        self.showPrefs = false
        if ($rootScope.user_id) {
            var postObj = {
                user_id: $rootScope.user_id
            }
        } else {
            var postObj = {}
        }
        var preferences = document.getElementsByClassName('news-checkbox')
        for (var i = 0; i < preferences.length; i++) {
            if (preferences[i].checked) {
                postObj[preferences[i].name] = preferences[i].name
            }
        }
        $http.post('http://localhost:3000/news/setPreferences', postObj).then(function() {
            $state.reload()
        })
    }

    this.showSectionSelections = function() {
        self.showPrefs = true
    }

    this.saveArticle = function(img, section, title, url, abstract) {
        var postObj = {
            user_id: $rootScope.user_id,
            image: img,
            section: section,
            title: title,
            url: url,
            abstract: abstract
        }
        $http.post('http://localhost:3000/news/save', postObj).then(function() {
            console.log('post successful');
        })
    }

    this.deleteArticle = function(article) {
        var postObj = {
            user_id: $rootScope.user_id,
            title: article
        }
        $http.post('http://localhost:3000/news/deleteArticle', postObj).then(function() {
            self.getSavedArticles()
        })
    }

    this.getSavedArticles = function() {
        $http.post('http://localhost:3000/news/retrieveArticles', {
            user_id: $rootScope.user_id
        }).then(function(data) {
            self.stories = data.data
        })
        this.main = false
        this.saved = true
    }

    this.getCurrentArticles = function() {
        $state.reload()
    }
}])

.controller('redditController', ['$http', '$rootScope', function($http, $rootScope) {
    var reddit = this;
    $http.post('http://localhost:3000/reddit/subredditList').then(function(data) {
        console.log(data);
        reddit.redditSubList = data.data.data.children;
    })
    this.getSub = function(name) {
        $rootScope.subreddit = name;
    }
}])

.controller('redditSubController', ['$http', '$rootScope', function($http, $rootScope) {
    var redditSub = this;
    $http.post(`http://localhost:3000/reddit/subreddit/${$rootScope.subreddit}`).then(function(data) {
        console.log(data);
        redditSub.redditResults = data.data.data.children;
    })
}])


.controller('membersController', ['$http', '$rootScope', function($http, $rootScope) {
    console.log(window.location);
}])


.controller('weatherController', ['$http', '$rootScope', function($http, $rootScope) {
    console.log($rootScope);
    var self = this
    $http.post('http://localhost:3000/weather/getWeather', $rootScope.currentPosition).then(function(data) {
        self.weatherData = data.data
        self.city = data.data.name
        self.desc = data.data.weather[0].description
        self.temp = Math.ceil(data.data.main.temp) + '°'
    })
}])

.controller('trafficController', ['$http', '$rootScope', function($http, $rootScope) {
    //TODO: TURN ON FOR TESTING
    // navigator.geolocation.getCurrentPosition(function(position) {
    //     var pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //     };
    //     $rootScope.currentPosition = pos;
    //     console.log($rootScope.currentPosition);
    // })

    var origin1 = new google.maps.LatLng($rootScope.currentPosition);

    var mapOptions = {
        zoom: 9,
        center: origin1,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $rootScope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    // var createMarker = function (info){
    //
    //     var marker = new google.maps.Marker({
    //         map: $rootScope.map,
    //         position: new google.maps.LatLng(info.lat, info.long),
    //         title: info.city
    //     });
    //     marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
    //
    //     google.maps.event.addListener(marker, 'click', function(){
    //         infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
    //         infoWindow.open($rootScope.map, marker);
    //     });
    //
    //     $rootScope.markers.push(marker);
    //
    // }
    // $rootScope.openInfoWindow = function(e, selectedMarker){
    //     e.preventDefault();
    //     google.maps.event.trigger(selectedMarker, 'click');
    // }

    $http.post('http://localhost:3000/traffic', $rootScope.currentPosition).then(function(data) {

    })
    this.workAddGet = function(address) {
        address.id = 2 //$rootScope.user_id; TODO: REPLACE 1 WITH $rootScope.user_id
        $rootScope.workAddress = address;
        $http.post('http://localhost:3000/traffic/setAddress', $rootScope.workAddress).then(function(some) {

        })
    }
}])

.controller('calendarController', ['$http', '$rootScope', function($http, $rootScope) {

}])

.controller('twitterController', ['$http', '$rootScope', function($http, $rootScope) {

}])

.controller('funController', ['$http', '$rootScope', function($http, $rootScope) {

    var foo = this
    $http.get('http://localhost:3000/fun/getFun').then(function(obj) {

        foo.qoute = obj.data.quoteText
        foo.author = obj.data.quoteAuthor
        $http.get('http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5').then(function(obj2) {
            foo.word = obj2.data.word
            foo.definition = obj2.data.definitions[0].text
            foo.pof = obj2.data.definitions[0].partOfSpeech
            foo.example = obj2.data.examples[1].text
            $http.get('http://api.adviceslip.com/advice').then(function(obj3) {
                foo.advice = obj3.data.slip.advice
                $http.get('https://api.chucknorris.io/jokes/random').then(function(obj4) {
                    foo.chuckNorris = obj4.data.value
                })
            })
        })
    })
}])
