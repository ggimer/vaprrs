
$("#newThread").on("click", displayNewThreadModal);

var threadModal = new bootstrap.Modal(document.getElementById('newThreadModal'));

async function displayNewThreadModal(){
  threadModal.show();
}

function disableButton(){
  document.getElementById('postButton').disabled = true;
}