
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

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

var getHelpItems = function(token) {
  // Make a request to get all the help items
  $.ajax({
    url: 'http://localhost:3000/help_items',
    headers: {
        Authorization: 'Token token=' + token
    },
    dataType: 'json'
  })
  .done(function(data) {
    debugger;
    console.log("Help Items = " + data);

    var helpItemsHTML = "<tr><th>First name</th><th>Last name</th><th>Need Help With</th></tr>";
    var helpItems = data.help_items;

    helpItems.forEach(function(item){
      if(item.status === 'waiting'){
        helpItemsHTML += "<tr><td>" + item.student_first_name + "</td><td>" + item.student_last_name + "</td><td>" + item.comment + "</td></tr>"
      }else if (item.status === 'active'){
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








