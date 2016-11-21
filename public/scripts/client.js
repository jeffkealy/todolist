$(document).ready(function(){
  getTasks();
  $('#task-submit').on('click', postTask);
  $('#task-container').on('click', '.completeButton', completeButton );
  $('#task-container').on('click', '.deleteButton', deleteButton );
function postTask(){
  event.preventDefault();

  var task = {}
  $.each($('#task-form').serializeArray(), function (i, field) {
    task[field.name] = field.value;
  });
  console.log("POST data", task);
    $.ajax({
      type: 'POST',
      url: '/list',
      data: task,
      success: function(res) {
        $('#task').val('');
        getTasks();
      },
      error: function() {
        console.log('could not post a list item');
      }
    })
}
function getTasks(){
  $.ajax({
    type: 'GET',
    url: '/list',
    success: function(list) {
      appendDom(list);
    },
    error: function() {
      console.log('Database error');
    }

  })
}
function appendDom(list){
  $('#task-container').empty();
  for (var i = 0; i < list.length; i++) {
    $('#task-container').append('<div class="individualTask" id="taskID'+ list[i].id +'""><h3>'+ list[i].todo +'</h3></div>');
    $('#taskID'+ list[i].id).append('<div class="buttonClass"><button type="button" '+
    'class="completeButton btn btn-lg btn-success" id="comp-buttonID'+ list[i].id +'" >Completed</button>'+
    '<button type="button" class="deleteButton btn btn-lg btn-danger" >Delete</button></div>');
    $('#taskID'+ list[i].id).data('id', list[i].id)

    if (list[i].completed == true) {
      $('#taskID'+ list[i].id).addClass('completed')
      $('#comp-buttonID'+ list[i].id).text('Mark Incomplete')
      //$('#taskID'+ list[i].id).css('background-color', 'rgba(11, 175, 77, 0.26');
    }
    $('.completed').animate({
          backgroundColor: "#c0ead1",
          color: "dark-grey"
        }, 500);
  }

  }
function completeButton(){
  var id = $(this).parent().parent().data('id');
  console.log("complete button clicked, id:", id);
  $.ajax({
    type: 'PUT',
    url: '/list/' + id,
    success: function(result) {
      console.log('updated!!!!');

      getTasks();
    },
    error: function(result) {
      console.log('could not update book!');
    }
  });
}


function deleteButton(){
      var id = $(this).parent().parent().data('id');
      console.log("delete button clicked, id:", id);

        swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this task?",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#ec6c62"
      });
      $('.confirm').on('click', function(){
        $.ajax({
          type: 'DELETE',
          url: '/list/' + id,
          success: function(result) {
            console.log("id: ", id);
            getTasks();
          },
          error: function(result) {
            console.log('could not delete book.');
          }
        });
        })

    }

});
