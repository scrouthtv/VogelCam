var currentData = [];
var currentSortKey = "name";
var currentSortDesc = false;

const tableID = "filelist";

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

			const table = document.getElementById(tableID).tBodies[0];

			var removed = currentData.filter(compareDataRow(data));
			removed.forEach(remove => {
				table.deleteRow(idInTable(remove.name));
			});

			var added = data.filter(compareDataRow(currentData));
			added.forEach(add => {
				var row = table.insertRow(0);
				setTableRow(row, add);
			});

			sortTableBy(currentSortDesc, currentSortKey);
			setTableFoot(meta);
			currentData = data;
			setTheme();
		}
	};
	xhttp.open("GET", "list.php", true);
	xhttp.send();
}

const availThemes = ["dark", "light"];
/**
 * Adds the currentTheme as a class to all elements.
 * Removes all themes from availThemes.
 */
function setTheme() {
	const elementList = document.getElementsByTagName("*");
	for (var i = 0; i < elementList.length; i++) {
		var elem = elementList[i];
		availThemes.forEach(aTheme => elem.classList.remove(aTheme));
		elem.classList.add(currentTheme);
	}
}

/**
 * With this approach, to sort by the *actual* date / size,
 * one can't use the -parsed fields
 */
function sortTableBy(descending, key) {
	currentSortKey = key;
	currentSortDesc = descending;

	const secondaryKey = "name";

	const table = document.getElementById(tableID).tBodies[0];
	var rows = [];
	var keys = [];
	const keyID = idInOrder(key);
	const secondaryID = idInOrder(secondaryKey);
	const filenameID = idInOrder("name");
	const length = table.rows.length;
	for (i = 0; i < length; i++) { // ignore the thead
		var row = table.rows[0];
		var rowKey;
		if (key.endsWith("-parsed")) {
			const filename = row.cells[filenameID].innerHTML;
			const dataRow = currentData[filenameToCurrentDataRow(filename)];
			if (typeof dataRow !== 'undefined') rowKey = dataRow[key.replace("-parsed", "")];
		} else {
			rowKey = row.cells[keyID].innerHTML;
		}
		rowKey += ":" + row.cells[secondaryID].innerHTML;
		keys.push(rowKey);
		rows[rowKey] = row;
		table.deleteRow(0);
	}

	if (key === "name") {
		// string compare for name column
		keys.sort();
	} else {
		// numerical sort for all other keys, ignore secondary key when sorting
		keys.sort((e1, e2) => {
			var e1num = e1.substring(0, e1.indexOf(":"));
			var e2num = e2.substring(0, e2.indexOf(":"));
			if ((e1num - e2num) != 0) return e1num - e2num;
			else return e1.localeCompare(e2);
		});
	}

	if (descending) keys.reverse();

	keys.forEach(key => {
		var row = table.insertRow(-1);
		copyTableRow(rows[key], row);
	});

	setTableHead();
	document.getElementById(tableID).tHead.rows[0].cells[keyID].childNodes[descending ? 0 : 1].classList.add("inactive");
}

/**
 * Returns -1 if not found.
 */
function filenameToCurrentDataRow(filename) {
	for (var i = 0; i < currentData.length; i++)
		if (currentData[i].name === filename) return i;
	return -1;
}

function copyTableRow(template, target) {
	var cells = template.cells;
	target.classList = template.classList;
	for (var i = 0; i < cells.length; i++) {
		var templateCell = cells[i];
		var targetCell = target.insertCell(-1);
		targetCell.innerHTML = templateCell.innerHTML;
		targetCell.classList = templateCell.classList;
	}
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
	const table = document.getElementById(tableID);
	while (document.getElementsByClassName("meta").length > 0) table.deleteRow(-1);
	var tfoot = table.createTFoot();
	var row = tfoot.insertRow(-1);
	row.classList.add(currentTheme);
	var cell = row.insertCell(0);
	cell.classList.add(currentTheme);
	cell.colSpan = currentOrder.length + 1; // spans the entire table
	cell.classList.add("meta");
	var content = meta.folder + ": " + meta.amount + " files";
	var power = humanPrefix(meta.total);
	content += " (" + formatSizeWithPower(meta.free, power);
	content += " / " + formatSizeWithPower(meta.total, power) + " free)";
	cell.appendChild(document.createTextNode(content));
}

function setTableHead() {
	const table = document.getElementById(tableID).tHead;
	while (table.rows.length > 0) table.deleteRow(0);
	var row = table.insertRow(0);
	row.classList.add(currentTheme);
	currentOrder.forEach(column => {
		var cell = row.insertCell(-1);
		var text = document.createTextNode(column);
		var br = document.createElement("br");

		var down = document.createElement("a");
		down.appendChild(document.createTextNode("\u25bc"));
		down.href = "javascript:sortTableBy(true, '" + column + "');";
		down.classList.add(currentTheme);
		var up = document.createElement("a");
		up.appendChild(document.createTextNode("\u25b2"));
		up.href = "javascript:sortTableBy(false, '" + column + "')"
		up.classList.add(currentTheme);

		cell.appendChild(down);
		cell.appendChild(up);
		cell.appendChild(br);
		cell.appendChild(text);
		cell.classList.add("head-" + column);
		cell.classList.add(currentTheme);
	});
	var cell = row.insertCell(-1);
	cell.appendChild(document.createElement("br"));
	cell.appendChild(document.createTextNode("delete"));
}

//function swapCells(a, b) {
// still wip, does not work because I can't write to the DOM structure.
// to make this happen, Id have to basically move the td nodes
// but then there wouldn't be any animation
// the animation would be another table on top that
// is floating and has this one column
// and is attached to the mouse
	//const table = document.getElementById(tableID).rows;
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
		if (col == "name") {
			var a = document.createElement("a");
			a.appendChild(document.createTextNode(data.name));
			a.href = "javascript:openPreview('" + data.name + "');";
			cell.classList.add("entry-name");
			cell.appendChild(a);
			text = "<a href='javascript:openPreview(" + data[col] + ");'>" + data[col] + "</a>";
		} else {
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
			cell.classList.add("entry-" + col);
			cell.appendChild(document.createTextNode(text));
		}
	});
	var cell = row.insertCell(-1);
	var a = document.createElement("a");
	a.appendChild(document.createTextNode("[x]"));
	a.href = "javascript:deleteFile('" + data.name + "');";
	cell.classList.add("entry-delete");
	cell.appendChild(a);
	row.classList.add("data-row");
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
	var table = document.getElementById(tableID).rows;
	var fileCell = idInOrder("name");
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
