// TODO print free space, total size, human readable size, pseudo keys

var currentData = [];

function reloadList() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const data = JSON.parse(this.responseText);
			const table = document.getElementById("filelist");

			var removed = currentData.filter(compareDataRow(data));
			removed.forEach(remove => {
				console.log(remove.name);
				console.log(idInTable(remove.name));
				table.deleteRow(idInTable(remove.name));
			});

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

//function swapCells(a, b) {
// still wip, does not work because I can't write to the DOM structure.
// to make this happen, Id have to basically move the td nodes
// but then there wouldn't be any animation
// the animation would be another table on top that
// is floating and has this one column
// and is attached to the mouse
	//const table = document.getElementById("filelist").rows;
	//for (i = 0; i < table.length; i++) {
		//var row = table[i].cells;
		//console.log(row[a]);
		//console.log(row[b])
		//var tmp = row[a];
		////console.log(tmp);
		//row[a] = row[b];
		//row[b] = tmp;
		//console.log(row[a]);
		//console.log(row[b])
		//console.log(row);
	//}
//}

function setTableRow(row, data) {
	currentOrder.forEach(col => {
		var cell = row.insertCell(-1);
		// TODO pseudo-keys will be here
		cell.appendChild(document.createTextNode(data[col]));
		cell.classList.add("entry-" + col);
	});
	var cell = row.insertCell(-1);
	var a = document.createElement("a");
	a.appendChild(document.createTextNode("[x]"));
	a.href = "javascript:deleteFile('" + data.name + "');";
	cell.appendChild(a);
	return row;
}

function deleteFile(filename) {
	if (confirm("Do you really want to delete " + filename + "?")) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				alert(this.responseText);
				reloadList();
			}
		}
		xhttp.open("GET", "delete.php?file=" + filename, true);
		xhttp.send();
	}
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
	console.log("file cell: " + fileCell);
	for (i = 0; i < table.length; i++) {
		if (table[i].cells[fileCell].innerHTML == file) return i;
	}
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
