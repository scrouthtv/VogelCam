const prefix = "../files/"

var currentPreview = "";

function openPreview(filename) {
	if (currentPreview != "") clearPreview();
	const previewPane = document.getElementById("previewPane");
	var iframe = document.createElement("iframe");
	iframe.src = prefix + filename;
	iframe.title = "Preview";
	previewPane.insertBefore(iframe, previewPane.firstChild);
	previewPane.style.display = "block";
	previewPane.style.opacity = 1;
	currentPreview = filename;
}

function clearPreview() {
	const previewPane = document.getElementById("previewPane");
	previewPane.removeChild(previewPane.firstChild);
	currentPreview = "";
}

function closePreview() {
	const previewPane = document.getElementById("previewPane");

	previewPane.style.opacity = 0;
	setTimeout(function() {
		previewPane.style.display = "none";
	}, 500);
}

function deletePreviewFile() {
	var fileToDelete = currentPreview;
	closePreview();
	deleteFile(fileToDelete);
}
