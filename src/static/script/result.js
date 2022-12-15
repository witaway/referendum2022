/*
function showSpoiler(obj) {
    var inner = obj.parentNode.getElementsByTagName("div")[0];
    if (inner.style.display == "none") inner.style.display = "";
    else inner.style.display = "none";
}
*/

function navigate(select) {
	var url = select.options[select.selectedIndex].value;
	if (url) {
		location.href = url;
	}
}
