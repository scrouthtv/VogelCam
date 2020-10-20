const prefix = "../files/"

function openPreview(filename) {
	const previewPane = document.getElementById("previewPane");
	var iframe = document.createElement("iframe");
	iframe.src = prefix + filename;
	iframe.title = "Preview";
	previewPane.insertBefore(iframe, previewPane.firstChild);
	previewPane.style.display = "block";
}

function closePreview() {
	const previewPane = document.getElementById("previewPane");
	previewPane.removeChild(previewPane.firstChild);
	previewPane.style.display = "none";
}
