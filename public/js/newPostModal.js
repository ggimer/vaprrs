
$("#newPost").on("click", displayNewPostModal);

var postModal = new bootstrap.Modal(document.getElementById('newPostModal'));

async function displayNewPostModal() {
    postModal.show();
}

function disableButton() {
    document.getElementById('postButton').disabled = true;
}

var postReplyText = document.getElementById("postReplyText");
if (postReplyText.addEventListener)
    postReplyText.addEventListener("keydown", this.textbox_keyHandler, false);
else if (textbox.attachEvent)
    postReplyText.attachEvent("onkeydown", this.textbox_keyHandler);
function textbox_keyHandler(e) {
    if (e.keyCode == 9) {
        var textbox = document.getElementById("postReplyText");
        textbox.value += "\t";
        if (e.preventDefault) e.preventDefault();
        return false;
    }
}