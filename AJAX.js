'use strict';

var currentToken = null;
var currentId = null;
var first_name, last_name;

var projApi = {
  gameWatcher: null,
  url: 'https://secret-cove-5044.herokuapp.com/',


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


listQueue: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/help_queues',
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

  createQueue: function (data, token, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/help_queues',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json',
    }, callback);
  },

  deleteQueue: function(id, token, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/help_queues/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },
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
      var data = {"help_queue": {"student_id": currentId, "instructor_id": "nil"}};
      projApi.createQueue(data, currentToken, function(e, queueData){
        if(e) {}
        projApi.listProfiles(currentToken, function(e, data) {
        if (e) {
          console.log(e);
        } else {
          console.log(JSON.stringify(data, null, 4));
          data.profiles.forEach(function(profile){
            if(profile.user_id === currentId){
              $('#qtable').append("<tr id='row-1'>" +
                               "<td id='s_fname'>" + profile.first_name + "</td>" +
                               "<td id='s_lname'>" + profile.last_name + "</td>" +
                               "<td>" + profile.comment + "</td>" +
                             "</tr>");
            };
          });
        };
      });

      });

    });

    $('.qbtnremove').click(function(e) {
      e.preventDefault();
      projApi.listQueue(currentToken, function(e, qdata) {
        if(e) {}
        qdata.help_queues.forEach(function(q) {
          if(Number(q["student_id"]) === currentId) {
            projApi.deleteQueue(q.id, currentToken, function(e,qdelete) {
              if(e) {
                console.log('poop');
                 $('#row-1').remove();
              }
              else {
              }
            });
          };
        });
      })
    });

    $(".qbtnext").click(function(e){
      var first = $("#s_fname").text();
      var last = $("#s_lname").text();
      $('#row-1').remove();
      $("#instructor3").append("<div style = 'margin-left: 100px; margin-top: 20px '>" + first + " " + last + "</div>");
    });
  });
