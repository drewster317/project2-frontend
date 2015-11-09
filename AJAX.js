'use strict';
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
      url: this.ttt + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  //Authenticated api actions
  listGames: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.ttt + '/games',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  createGame: function (token, callback) {
    this.ajax({
      method: 'POST',
      url: this.ttt + '/games',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
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

    $('.signup').on('submit', function(e) {
      var credentials = wrap('credentials', form2object(this));
      projApi.register(credentials, callback);
      console.log(JSON.stringify(credentials, null, 4));

      e.preventDefault();
    });

    $('#login').on('submit', function(e) {
      var credentials = wrap('credentials', form2object(this));
      var cb = function cb(error, data) {
        if (error) {
          callback(error);
          return;
        }
        callback(null, data);
        $('.token').val(data.user.token);
      };
      e.preventDefault();
      tttapi.login(credentials, cb);
    });

    $('#list-games').on('submit', function(e) {
      var token = $(this).children('[name="token"]').val();
      e.preventDefault();
      tttapi.listGames(token, callback);
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
