var currentData = [];

function reloadList() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const data = JSON.parse(this.responseText);
			const table = document.getElementById("filelist");

			var removed = currentData.filter(compareDataRow(data));
			removed.forEach(remove => table.deleteRow(idInTable(remove.name)));

			var added = data.filter(compareDataRow(currentData));
			added.forEach(add => {
				var row = table.insertRow(0);
				setTableRow(row, add);
			});

			currentData = data;
		}
	};
	xhttp.open("GET", "list.php", true);
	xhttp.send();
}

function setTableRow(row, data) {
	currentOrder.forEach(col => {
		var cell = row.insertCell(-1);
		// TODO pseudo-keys will be here
		cell.appendChild(document.createTextNode(data[col]));
		cell.classList.add("entry-" + col);
	});
	return row;
}

function compareDataRow(otherArray) {
	return current => {
		return otherArray.filter(other => other.name === current.name).length == 0;
	}
}

/**
 * Searches for the specified file name in the current table.
 * If not found, -1 is returned.
 */
function idInTable(file) {
	var table = document.getElementById("filelist").rows;
	var fileCell = idInOrder("name");
	for (i = 0; i < table.length; i++)
		if (table[i].cells[fileCell] == file) return i;
	return -1;
}


/**
 * Returns the first id of `col` in `currentOrder`.
 * If not found, -1 is returned.
 */
function idInOrder(col) {
	for (i = 0; i < currentOrder.length; i++)
		if (currentOrder[i] == col) return i;
	return -1;
}
