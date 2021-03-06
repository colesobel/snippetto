angular.module('myApp', ['ui.router', 'myApp.controllers', 'myApp.newsController',
  'myApp.youtubeController', 'myApp.todoControllers', 'myApp.loginController',
  'myApp.trafficController','myApp.redditController','myApp.redditSubController',
  'myApp.weatherController', 'myApp.funController', 'myApp.services'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('login')//login
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'loginController',
      controllerAs: 'login'
    })
    .state('news', {
      url: '/news',
      templateUrl: '/views/news.html',
      controller: 'newsController',
      controllerAs: 'news'
    })
    .state('reddit',{
      url:'/reddit',
      templateUrl:'/views/reddit.html',
      controller:'redditController',
      controllerAs: 'reddit'
    })
    .state('reddit_sub',{
      url:'/reddit_sub',
      templateUrl:'/views/reddit_subSelected.html',
      controller:'redditSubController',
      controllerAs: 'redditSub'
    })
    .state('home', {
      url: '/home',
      templateUrl: '/views/home.html',
      controller: 'homeController',
      controllerAs: 'home'
    })
    .state('weather', {
      url: '/weather',
      templateUrl: '/views/weather.html',
      controller: 'weatherController',
      controllerAs: 'weather'
    })
    .state('traffic', {
      url: '/traffic',
      templateUrl: '/views/traffic.html',
      controller: 'trafficController',
      controllerAs: 'traffic'
    })
    .state('todo', {
      url: '/todo',
      templateUrl: '/views/todo.html',
      controller: 'todoController',
      controllerAs: 'todo'
    })
    .state('youtube', {
      url: '/youtube',
      templateUrl: '/views/youtube.html',
      controller: 'youtubeController',
      controllerAs: 'youtube'
    })
    .state('fun', {
      url: '/fun',
      templateUrl: '/views/fun.html',
      controller: 'funController',
      controllerAs: 'fun'
    })
    .state('showTask', {
      url: '/showTask/:user_id/:task_id',
      templateUrl: '/views/showTask.html',
      controller: 'showTaskController',
      controllerAs: 'showTask'
    })
    .state('nyt', {
      url: '/nytTemp',
      templateUrl: '/views/nytsearchtemp.html',
      controller: 'nytTempController',
      controllerAs: 'nytTemp'
    })
}])
