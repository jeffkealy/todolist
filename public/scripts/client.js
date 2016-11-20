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
      console.log(list);
      appendDom(list);
    },
    error: function() {
      console.log('Database error');
    }

  })
}
function appendDom(list){
  $('#task-container').empty();
  console.log("list in appendDom", list);
  for (var i = 0; i < list.length; i++) {
    $('#task-container').append('<div class="individualTask" id="taskID'+ list[i].id +'""><h3>'+ list[i].todo +'</h3></div>');
    $('#taskID'+ list[i].id).append('<div class="buttonClass"><button type="button" '+
    'class="completeButton btn btn-lg btn-success" >Completed</button><button type="button" class="deleteButton btn btn-lg btn-danger" >Delete</button></div>');
    
    $('#taskID'+ list[i].id).data('id', list[i].id)
    if (list[i].completed == true) {
      //console.log("true worked");
      $('#taskID'+ list[i].id).css('background-color', 'rgba(11, 175, 77, 0.26');
    }
  }

  }
function completeButton(){
  console.log("complete button clicked");
  var id = $(this).parent().parent().data('id');
  console.log("complete button clicked, id:", id);
  $.ajax({
    type: 'PUT',
    url: '/list/' + id,
    success: function(result) {
      console.log('updated!!!!', result);

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
  $.ajax({
    type: 'DELETE',
    url: '/list/' + id,
    success: function(result) {
      getTasks();
    },
    error: function(result) {
      console.log('could not delete book.');
    }
  });
}
// function pullCompleted(){
//   var id = $(this).parent().parent().data('id');
//   $.ajax({
//     type: 'GET',
//     url: '/list/completed' +id,
//     success: function(list) {
//       if (list == true) {
//         console.log("pullCompleted success",list);
//       }
//
//     },
//     error: function() {
//       console.log('Database error');
//     }
//
//   })
// }
});
