
var currentStudent = {};
$(document).ready(function() {
  //if the logged in user is an instructor then show next button

})
///Register form


$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
  label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if( $this.val() === '' ) {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if( $this.val() === '' ) {
      label.removeClass('highlight');
    }
    else if( $this.val() !== '' ) {
      label.addClass('highlight');
    }
  }

});

// handling display of login
$(".btn-login").click(function(){
  console.log("poop");
  $("#login").css("display", "block");
  $("#signup").css("display", "none");
});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  // $('.tab-content > div').hide();

  $(target).fadeIn(600);

});

var getHelpItems = function(token) {
  // Make a request to get all the help items
  $.ajax({
    url: projApi.url + '/help_items',
    headers: {
        Authorization: 'Token token=' + token
    },
    dataType: 'json'
  })
  .done(function(data) {
    console.log("Help Items = " + data);

    var helpItemsHTML = "<tr><th>First name</th><th>Last name</th><th>Need Help With</th></tr>";
    var helpItems = data.help_items;
    currentStudent = helpItems[0]
    helpItems.forEach(function(item){
      if(item.status === 'waiting'){
        helpItemsHTML += "<tr  class='help_item' id=" + item.id + "><td>" + item.student_first_name + "</td><td>" + item.student_last_name + "</td><td>" + item.comment + "</td></tr>"
      }else if (item.status === 'active'){
         var activeItemHTML = "<li>" + item.student_first_name + ", " + item.student_last_name + "<p>" + item.comment + "</p></li>"
         $("#" +item.instructor_first_name).append(activeItemHTML);
         activeItemHTML = "";

        console.log("item is active");
      }
    })
    $('#qtable').html('');
    $('#qtable').append(helpItemsHTML);

  })
  .fail(function(error) {
    console.log("error");
  });

};








