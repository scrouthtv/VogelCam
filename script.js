// TODO print free space, total size, human readable size, pseudo keys

var currentData = [];

function reloadList() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const data = [];
			var meta;
			JSON.parse(this.responseText).forEach(row => {
				if (row.hasOwnProperty("name")) data.push(row);
				else meta = row;
			});
			console.log(meta);

			const table = document.getElementById("filelist");

			var removed = currentData.filter(compareDataRow(data));
			removed.forEach(remove => {
				table.deleteRow(idInTable(remove.name));
			});

			var added = data.filter(compareDataRow(currentData));
			added.forEach(add => {
				var row = table.insertRow(0);
				setTableRow(row, add);
			});

			setTableHead();
			setTableFoot(meta);
			currentData = data;
		}
	};
	xhttp.open("GET", "list.php", true);
	xhttp.send();
}

const prefixes = {
	0 : "",
	3 : "k",
	6 : "M",
	9 : "G",
	12 : "T",
	15 : "P"
}

const largestReadableSize = 900;

function formatSizeWithPower(size, power) {
	size = size / Math.pow(1024, power/3);
	return (Math.round(size * 100) / 100) + " " + prefixes[power] + "B";
}

function formatSize(size) {
	return formatSizeWithPower(size, humanPrefix(size));
}

/**
 * Returns a power with which this size would be readable. Is always a multiple of 3.
 */
function humanPrefix(size) {
	var power = 0;
	while (size > largestReadableSize) {
		size = size / 1024;
		power += 3;
	}
	return power;
}

function setTableFoot(meta) {
	const table = document.getElementById("filelist");
	table.deleteTFoot();
	var tfoot = table.createTFoot();
	var row = tfoot.insertRow(0);
	var cell = row.insertCell(0);
	cell.colspan = currentOrder.length + 1; // spans the entire table
	cell.classList.add("meta");
	var content = meta.folder + ": " + meta.amount + " files";
	var power = humanPrefix(meta.total);
	content += " (" + formatSizeWithPower(meta.free, power);
	content += " / " + formatSizeWithPower(meta.total, power) + " free)";
	cell.appendChild(document.createTextNode(content));
}

function setTableHead() {
	const table = document.getElementById("filelist");
	table.deleteTHead();
	var thead = table.createTHead();
	var row = thead.insertRow(0);
	currentOrder.forEach(column => {
		var cell = row.insertCell(-1);
		cell.appendChild(document.createTextNode(column));
	});
	var cell = row.insertCell(-1);
	cell.appendChild(document.createTextNode("delete"));
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

const monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"];

/**
 * Parses a *UNIX* timestamp. These are in seconds since 1970.
 * JavaScript timestamps are in milliseconds since 1970.
 */
function parseUnixTimestamp(timestamp) {
	const time = new Date(timestamp * 1000);

	text = monthString[time.getMonth()] + " ";
	text += padWithZeros(time.getDate(), 2) + " ";
	text += padWithZeros(time.getHours(), 2) + ":";
	text += padWithZeros(time.getMinutes(), 2);

	return text;
}

function padWithZeros(number, zeros) {
	while (number.length < zeros) number = "0" + number;
	return number;
}

function setTableRow(row, data) {
	currentOrder.forEach(col => {
		var cell = row.insertCell(-1);
		var text = "";
		switch (col) {
			case 'atime-parsed': case 'mtime-parsed': case 'ctime-parsed': 
				text = parseUnixTimestamp(data[col.substring(0, col.indexOf("-"))]);
				break;
			case 'size-parsed':
				text = formatSize(data.size);
				break;
			default:
				text = data[col];
				break;
		}
		cell.appendChild(document.createTextNode(text));
		cell.classList.add("entry-" + col);
	});
	var cell = row.insertCell(-1);
	var a = document.createElement("a");
	a.appendChild(document.createTextNode("[x]"));
	a.href = "javascript:deleteFile('" + data.name + "');";
	cell.classList.add("entry-delete");
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
