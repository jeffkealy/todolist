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
  for (var i = 0; i < list.length; i++) {
    $('#task-container').append('<div class="individualTask" id="taskID'+ list[i].id +'"">'+ list[i].todo +'</div>');
    $('#taskID'+ list[i].id).append('<button type="button" class="completeButton" >Completed</button>');
    $('#taskID'+ list[i].id).append('<button type="button" class="deleteButton" >Delete</button>');
    $('#taskID'+ list[i].id).data('id', list[i].id)
  }

  }
function completeButton(){
  console.log("complete button clicked");
  var id = $(this).parent().data('id');
  console.log("delete button clicked, id:", id);
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
  var id = $(this).parent().data('id');
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
});
