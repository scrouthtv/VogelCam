const prefix = "../files/"

function openPreview(filename) {
	document.getElementById("previewPane").innerHTML = "";
	var iframe = document.createElement("iframe");
	iframe.src = prefix + filename;
	iframe.title = "Preview";
	document.getElementById("previewPane").appendChild(iframe);
}
