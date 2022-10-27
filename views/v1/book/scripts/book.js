var pathname = $(location).attr('pathname');
var bookIdPosition = pathname.lastIndexOf('/') + 1;
var isBookInUse = false;
var bookId;
let url = `http://localhost:3005/books/${bookId}`;
let fetchData = {
    method: "POST",

}

// doAjaxQuery('GET', '/api/v1/books/' + pathname.substr(bookIdPosition), null, function(res) {
//     view.fillBookInfo(res.data);
//     if (res.data.event) {
//         isBookInUse = true;
//         bookId = res.data.id;
//     }
// });
$('.btnBookID').click(function wantThisBook() {
    fetch({
        method: "POST",
    }, url)
    .then(function() {
        alert("Contacts: ....");
    })
    .catch(function(error) {
        console.log(error);
    })
});
