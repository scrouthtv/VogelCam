function reloadList() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const data = JSON.parse(this.responseText);
			console.log(data);
			data.forEach(entry => {
				console.log(entry);
			});
		}
	};
	xhttp.open("GET", "list.php", true);
	xhttp.send();
}
