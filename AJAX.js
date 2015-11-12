'use strict';

var currentToken = null;
var currentId = null;
var first_name, last_name;

var projApi = {
  gameWatcher: null,
  url: 'http://localhost:3000',


  ajax: function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
      url: this.url + '/register',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
      url: this.url + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  //Authenticated api actions
  listUsers: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/users',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  listProfiles: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/profiles',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  createProfile: function (data, token, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/profiles',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json',
    }, callback);
  },


  showGame: function (id, token, callback) {
    this.ajax({
      method: 'GET',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  joinGame: function (id, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
      dataType: 'json'
    }, callback);
  },

  markCell: function (id, data, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json'
    }, callback);
  },

  watchGame: function (id, token) {
    var url = this.ttt + '/games/' + id + '/watch';
    var auth = {
      Authorization: 'Token token=' + token
    };
    this.gameWatcher = resourceWatcher(url, auth); //jshint ignore: line
    return this.gameWatcher;
  }
};


//$(document).ready(...
  $(function() {
    var form2object = function(form) {
      var data = {};
      $(form).find("input").each(function(index, element) {
        var type = $(this).attr('type');
        if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
          data[$(this).attr('name')] = $(this).val();
        }
        if ($(this).attr('id') === "first_name") first_name = $(this).val();
        if ($(this).attr('id') === "last_name") last_name = $(this).val();

      });
      return data;
    };
    var wrap = function wrap(root, formData) {
      var wrapper = {};
      wrapper[root] = formData;
      return wrapper;
    };

    var callback = function callback(error, data) {
      if (error) {
        console.error(error);
        $('#result').val('status: ' + error.status + ', error: ' +error.error);
        return;
      }
      $('#result').val(JSON.stringify(data, null, 4));
      console.log(JSON.stringify(data, null, 4));

    };

    $('#signup-form').on('submit', function(e) {
      e.preventDefault();
      var credentials = wrap('credentials', form2object(this));
      projApi.register(credentials, function(error, data){
        var token = data.user.token;
        var user_id = data.user.id;
        var comment = "";
        var profileData = {'profile': {first_name, last_name, comment, user_id}};
        console.log(JSON.stringify(profileData, null, 4));
        projApi.createProfile(profileData, token, callback);
      });



    });

    $('#login-form').on('submit', function(e) {
      var credentials = wrap('credentials', form2object(this));
      var cb = function cb(error, data) {
        if (error) {
          callback(error);
          return;
        }
        callback(null, data);
        currentToken = (data.user.token);
        currentId = data.user.id;
      };
      e.preventDefault();
      projApi.login(credentials, cb);
    });

    $('.qbtnadd').click(function(e) {

      e.preventDefault();
      projApi.listProfiles(currentToken, function(e, data) {
        if (e) {
          console.log(e);
        } else {
          console.log(JSON.stringify(data, null, 4));
          data.profiles.forEach(function(profile){
            if(profile.user_id === currentId){
              $('#qtable').append("<tr>" +
                               "<td>" + profile.first_name + "</td>" +
                               "<td>" + profile.last_name + "</td>" +
                               "<td>" + profile.comment + "</td>" +
                             "</tr>");
            };
          });
        };
      });
    });

    $('#create-game').on('submit', function(e) {
      var token = $(this).children('[name="token"]').val();
      e.preventDefault();
      tttapi.createGame(token, callback);
    });

    $('#show-game').on('submit', function(e) {
      var token = $(this).children('[name="token"]').val();
      var id = $('#show-id').val();
      e.preventDefault();
      // gameId = data.game.id
  //
  tttapi.showGame(id, token, function(err, data){
    gameId = data.game.id;
    cell = data.game.cells;
    token = data.user.token;

  });
});

    $('#join-game').on('submit', function(e) {
      var token = $(this).children('[name="token"]').val();
      var id = $('#join-id').val();
      e.preventDefault();
      tttapi.joinGame(id, token, callback);
    });

    $('#mark-cell').on('submit', function(e) {
      var token = $(this).children('[name="token"]').val();
      var id = $('#mark-id').val();
      var data = wrap('game', wrap('cell', form2object(this)));
      e.preventDefault();
      tttapi.markCell(id, data, token, callback);
    });

    $('#watch-game').on('submit', function(e){
      var token = $(this).children('[name="token"]').val();
      var id = $('#watch-id').val();
      e.preventDefault();

      var gameWatcher = tttapi.watchGame(id, token);

      gameWatcher.on('change', function(data){
        var parsedData = JSON.parse(data);
      if (data.timeout) { //not an error
        this.gameWatcher.close();
        return console.warn(data.timeout);
      }
      var gameData = parsedData.game;
      var cell = gameData.cell;
      $('#watch-index').val(cell.index);
      $('#watch-value').val(cell.value);
    });
      gameWatcher.on('error', function(e){
        console.error('an error has occured with the stream', e);
      });
    });

  });
