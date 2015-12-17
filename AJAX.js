'use strict';

var currentToken = null;
var currentId = null;
var instructor_role = false;
var first_name, last_name;
var user_name;
var projApi = {
  gameWatcher: null,
  url: 'https://secret-cove-5044.herokuapp.com',


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
      headers: {
        Authorization: 'Token token=' + token
      },
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
      headers: {
        Authorization: 'Token token=' + token
      },
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
      url: this.url + '/help_items',
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
      url: this.url + '/help_items',
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
      projApi.register(credentials, function(error, data) {
         if(error) {
          console.error(error);
        }
        console.log(data);
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
        instructor_role = data.user.instructor_role;
        currentId = data.user.id;
        getHelpItems(currentToken);
        user_name = data.user.email.split("@")[0];
        console.log(user_name);

        if(instructor_role === true){
          $('.qbtnext').show();
        }else{
          $('.qbtnext').hide();
        }
      };
      e.preventDefault();
      projApi.login(credentials, cb);
    });

    $('.qbtnadd').click(function(e) {

      e.preventDefault();
      var data = {"help_item": {"student_id": currentId, "instructor_id": "nil", "comment": "nil"}};
      projApi.createQueue(data, currentToken, callback

        // function(e, queueData){
        // if(e) {console.log(e)}
        //   projApi.listProfiles(currentToken, function(e, data) {
        //     if (e) {
        //       console.log(e);
        //     } else {
        //       data.profiles.forEach(function(profile){
        //         if(profile.user_id === currentId){
        //           $('#qtable').append("<tr id='row-1'>" +
        //            "<td id='s_fname'>" + profile.first_name + "</td>" +
        //            "<td id='s_lname'>" + profile.last_name + "</td>" +
        //            "<td>" + profile.comment + "</td>" +
        //            "</tr>");
        //         };
        //       });
        //     };
        //   });
      );
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
      // var first = currentStudent.student_first_name
      // var last = currentStudent.student_last_name
      // var item = currentStudent.comment
      var item = $('#qtable').find('.help_item')[0]
      // var item = $('#' + currentStudent.id);
      var itemRowHTML = $(item).html();
      item.remove();

      $.ajax({
        method: 'DELETE',
        url: 'http://localhost:3000/help_items/' + item.id,
        headers: {
          Authorization: 'Token token=' + currentToken
        },
      }).done(function (data) {
        console.log("success!");
      });
    });

    //   switch (user_name) {
    //     case "tom":
    //       // $('#tom').html("")
    //       // $('#tom').html(first + " " + last + ": " + item)
    //       $('#tom').html(itemRowHTML);
    //     break;
    //     // case "antony":
    //     //   $('#antony').html("")
    //     //   $('#antony').html(first + " " + last + ": " + item)
    //     // break;
    //     // case "jeff":
    //     //   $('#jeff').html("")
    //     //   $('#jeff').html(first + " " + last + ": " + item)
    //     // break;
    //     // case "saad":
    //     //   $('#saad').html("")
    //     //   $('#saad').html(first + " " + last + ": " + item)
    //     // break;
    //     // case "matt":
    //     //   $('#matt').html("")
    //     //   $('#matt').html(first + " " + last + ": " + item)
    //     // break;
    //    default:
    //     break;
    //   }

    // });
  });


