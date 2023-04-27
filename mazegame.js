function MagicMaze(size) {
	this.size = size;
	let h = (size - 1) / 2;
	move = new Array(size * size - (h + 1) * (h + 1) + 1);
	let i = 0;
	for (j = 0; j < 4 * h; j++) {
		move[i++] = new Tiles("NS");
	}
	for (j = 0; j < 2 * h; j++) {
		move[i++] = new Tiles("EWS");
	}
	while (i < move.length) {
		move[i++] = new Tiles("WS");
	}
	this.tiles = new Array(size * size);
	for (i = 0; i < size * size; i++)
		this.tiles[i] = new Tiles("NS");

	this.cell(0, 0, new Tiles("ES"));
	this.cell(0, size - 1, new Tiles("WS"));
	this.cell(size - 1, size - 1, new Tiles("NW"));
	this.cell(size - 1, 0, new Tiles("EN"));
	for (i = 1; i < h; i++) {
		this.cell(0, 2 * i, new Tiles("EWS"));
		this.cell(2 * i, size - 1, new Tiles("NWS"));
		this.cell(size - 1, 2 * i, new Tiles("ENW"));
		this.cell(2 * i, 0, new Tiles("ENS"));
	}
	for (i = 1; i < h; i++)
		for (j = 1; j < h; j++) {
			if (j > 1 && j <= h - i)
				this.cell(2 * i, 2 * j, new Tiles("EWS"));
			else if (j >= i && j > h - i)
				this.cell(2 * i, 2 * j, new Tiles("NWS"));
			else if (j < i && j >= h - i)
				this.cell(2 * i, 2 * j, new Tiles("ENW"));
			else
				this.cell(2 * i, 2 * j, new Tiles("ENS"));
		}
	let l = move.length;
	for (i = 0; i < size - 1; i++)
		for (j = 0; j < size - 1; j++)
			if (i % 2 != 0 || j % 2 != 0) {
				r = Math.floor(Math.random() * l--);
				this.cell(i, j, move[r]);
				move[r] = move[l];

				p = Math.floor(Math.random() * 4);
				while (p-- > 0)
					this.cell(i, j).axisdegree();
			}
	this.lastInsert = undefined;
	this.TileT = move[0];
	this.Pawns = new Array(5);
	this.Pawns[0] = new Pawn(0, 0, '<i class="fa fa-taxi" aria-hidden="true"></i>', "blue");
	this.Pawns[1] = new Pawn(0, size - 1, '<i class="fa fa-futbol-o" aria-hidden="true"></i>', "blue");
	this.Pawns[2] = new Pawn(size - 1, 0, '<i class="fa fa-space-shuttle" aria-hidden="true"></i>', "blue");
	this.Pawns[3] = new Pawn(size - 1, size - 1, '<i class="fa fa-linux" aria-hidden="true"></i>', "blue");
	this.Pawns[4] = new Pawn(Math.floor(this.size / 2), Math.floor(this.size / 2), '<i class="fa fa-trophy" aria-hidden="true" fa-4x></i>', "blue");
	this.curPlayer = 0;
	this.extraUsed = false;
}

class Tiles {
	constructor(t) {
		for (this.typeTile = 0; this.typeTile < this.types.length; this.typeTile++) {
			if (this.types[this.typeTile] == t)
				break;
		}
	}
	getType() {
		return this.types[this.typeTile];
	}
	axisdegree() {
		this.typeTile = this.axisis[this.typeTile];
	}
	toJSON() {
		return { typeTile: this.typeTile };
	}
	fromJSON(o) {
		this.typeTile = o.typeTile;
	}
}

class Pawn {
	constructor(i, j, symbol, color) {
		this.i = i;
		this.j = j;
		this.symbol = symbol;
		this.color = color;
	}
}

Pawn.prototype.i = 0;
Pawn.prototype.j = 0;
MagicMaze.prototype.clicked = false;

MagicMaze.prototype.cell = function (i, j, c) {
	if (c == undefined)
		return this.tiles[i * this.size + j];
	this.tiles[i * this.size + j] = c;
}

MagicMaze.prototype.post = function () {
	function postCell(td, pos, c) {
		let t = c.getType();
		switch (pos) {
			case 0:
				c.topLeftCornerCell = td;
				td.style.backgroundColor = "#ffd037";
				break;
			case 1:
				c.topMarginCell = td;
				td.style.backgroundColor = t.includes("N") ? "yellow" : "#ffd037";
				break;
			case 2:
				c.topRightCornerCell = td;
				td.style.backgroundColor = "#ffd037";
				break;
			case 3:
				c.leftMarginCell = td;
				td.style.backgroundColor = t.includes("W") ? "yellow" : "#ffd037";
				break;
			case 4:
				c.centerCell = td;
				td.style.backgroundColor = "yellow";
				break;
			case 5:
				c.rightMarginCell = td;
				td.style.backgroundColor = t.includes("E") ? "yellow" : "#ffd037";
				break;
			case 6:
				c.bottomLeftCornerCell = td;
				td.style.backgroundColor = "#ffd037";
				break;
			case 7:
				c.bottomMarginCell = td;
				td.style.backgroundColor = t.includes("S") ? "yellow" : "#ffd037";
				break;
			case 8:
				c.bottomRightCornerCell = td;
				td.style.backgroundColor = "#ffd037";
				break;
		}
	}
	table = document.getElementById("magicmaze");
	table.innerHTML = "";
	for (row = 0; row < 3 * this.size; row++) {
		tr = document.createElement("TR");
		if (row % 3 == 1)
			tr.style.height = "7ex";
		else
			tr.style.height = "2ex";
		for (col = 0; col < 3 * this.size; col++) {
			td = document.createElement("TD");
			td.appendChild(document.createTextNode(" "));
			let i = Math.floor(row / 3);
			let j = Math.floor(col / 3);
			td.setAttribute("onclick", "mouseClick(" + i + ", " + j + ")");
			td.setAttribute("ondrop", "drop(event, " + i + ", " + j + ")");
			td.setAttribute("ondragover", "allowDrop(event)");
			let c = this.cell(i, j);
			if (col % 3 == 1)
				td.style.width = "7ex";
			else
				td.style.width = "2ex";
			postCell(td, (row % 3) * 3 + (col % 3), c);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	table = document.getElementById("tileT");
	table.innerHTML = "";
	for (row = 0; row < 3; row++) {
		tr = document.createElement("TR");
		if (row % 3 == 1)
			tr.style.height = "7ex";
		else
			tr.style.height = "2ex";
		for (col = 0; col < 3; col++) {
			td = document.createElement("TD");
			td.appendChild(document.createTextNode(" "));
			if (col % 3 == 1)
				td.style.width = "7ex";
			else
				td.style.width = "2ex";
			postCell(td, (row % 3) * 3 + (col % 3), this.TileT);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	for (i = 0; i < 5; i++) {
		c = this.cell(this.Pawns[i].i, this.Pawns[i].j);
		c.centerCell.innerHTML = this.Pawns[i].symbol;
		c.centerCell.style.border = "0";
		c.centerCell.style.textAlign = "center";
		c.centerCell.style.color = this.Pawns[i].color;
	}
	showAccess(this.Pawns[this.curPlayer].i, this.Pawns[this.curPlayer].j);
	this.save();
}

MagicMaze.prototype.push = function (i, j) {
	let temp;
	if (i == 0) {
		for (k = i; k < this.size; k++) {
			temp = this.cell(k, j);
			this.cell(k, j, this.TileT);
			this.TileT = temp;
		}
		for (p = 0; p < 5; p++) {
			if (this.Pawns[p].j == j) {
				this.Pawns[p].i = (this.Pawns[p].i + 1) % this.size;
			}
		}
	}
	else if (i == this.size - 1) {
		for (k = i; k >= 0; k--) {
			temp = this.cell(k, j);
			this.cell(k, j, this.TileT);
			this.TileT = temp;
		}
		for (p = 0; p < 5; p++) {
			if (this.Pawns[p].j == j) {
				this.Pawns[p].i = (this.Pawns[p].i + this.size - 1) % this.size;
			}
		}
	}
	else if (j == 0) {
		for (k = j; k < this.size; k++) {
			temp = this.cell(i, k);
			this.cell(i, k, this.TileT);
			this.TileT = temp;
		}
		for (p = 0; p < 5; p++) {
			if (this.Pawns[p].i == i) {
				this.Pawns[p].j = (this.Pawns[p].j + 1) % this.size;
			}
		}
	}
	else if (j == this.size - 1) {
		for (k = j; k >= 0; k--) {
			temp = this.cell(i, k);
			this.cell(i, k, this.TileT);
			this.TileT = temp;
		}
		for (p = 0; p < 5; p++) {
			if (this.Pawns[p].i == i) {
				this.Pawns[p].j = (this.Pawns[p].j + this.size - 1) % this.size;
			}
		}
	}
	if (this.lastInsert == undefined) {
		this.lastInsert = new Array(2);
	}
	this.lastInsert[0] = i;
	this.lastInsert[1] = j;
	this.extraUsed = true;
	this.post();
}

MagicMaze.prototype.endTurn = function () {
	if (this.Pawns[this.curPlayer].i == this.Pawns[4].i && this.Pawns[this.curPlayer].j == this.Pawns[4].j) {
		this.Pawns[4].i = Math.floor(Math.random() * this.size);
		this.Pawns[4].j = Math.floor(Math.random() * this.size);
	}
	this.curPlayer = (this.curPlayer + 1) % 4;
	this.extraUsed = false;
	this.post();
}

MagicMaze.prototype.totalAccess = function (i, j) {
	tilesAccess = new totAccess();
	tilesAccess.add(i, j);
	return tilesAccess;
}

function showAccess(i, j) {
	let total = magicmaze.totalAccess(i, j);
	for (i = 0; i < total.length; i++) {
		total[i].centerCell.style.backgroundColor = "#ff781f";
		let t = total[i].getType();

		if (t.includes("N"))
			total[i].topMarginCell.style.backgroundColor = "#ff781f";
		if (t.includes("E"))
			total[i].rightMarginCell.style.backgroundColor = "#ff781f";
		if (t.includes("S"))
			total[i].bottomMarginCell.style.backgroundColor = "#ff781f";
		if (t.includes("W"))
			total[i].leftMarginCell.style.backgroundColor = "#ff781f";
	}
}

function mouseClick(i, j) {
	if (magicmaze.extraUsed) {
		magicmaze.Pawns[magicmaze.curPlayer].i = i;
		magicmaze.Pawns[magicmaze.curPlayer].j = j;
		magicmaze.post();
	}
}

function turnoff() {
	if (magicmaze.clicked)
		magicmaze.clicked = false;
	else
		magicmaze.post;
}

MagicMaze.prototype.fromJSON = function (s) {
	o = JSON.parse(s);
	this.size = o.size;
	this.tiles = new Array(this.size * this.size);
	for (i = 0; i < this.size * this.size; i++) {
		this.tiles[i] = new Tiles("NS");
		this.tiles[i].fromJSON(o.tiles[i]);
	}
	this.TileT = new Tiles("NS");
	this.TileT.fromJSON(o.TileT);
	this.lastInsert = o.lastInsert;
	this.Pawns = new Array(4);
	for (p = 0; p < 5; p++) {
		this.Pawns[p] = o.Pawns[p];
	}
	this.curPlayer = o.curPlayer;
	this.extraUsed = o.extraUsed;
}

MagicMaze.prototype.save = function () {
	localStorage.setItem("magicmaze", JSON.stringify(magicmaze));
}

Tiles.prototype.types = ["NS", "EW", "WS", "ES", "EN", "NW", "EWS", "ENS", "ENW", "NWS"];
Tiles.prototype.axisis = [1, 0, 3, 4, 5, 2, 7, 8, 9, 6];

function totAccess() { }
totAccess.prototype = Array.prototype;
totAccess.prototype.add = function (i, j) {
	let c = magicmaze.cell(i, j);
	if (this.indexOf(c) >= 0)
		return;
	this.push(c);
	let t = c.getType();
	if (t.includes("N") && i > 0) {
		adj = magicmaze.cell(i - 1, j);
		tAdj = adj.getType();
		if (tAdj.includes("S"))
			this.add(i - 1, j);
	}
	if (t.includes("E") && j < magicmaze.size - 1) {
		adj = magicmaze.cell(i, j + 1);
		tAdj = adj.getType();
		if (tAdj.includes("W"))
			this.add(i, j + 1);
	}
	if (t.includes("S") && i < magicmaze.size - 1) {
		adj = magicmaze.cell(i + 1, j);
		tAdj = adj.getType();
		if (tAdj.includes("N"))
			this.add(i + 1, j);
	}
	if (t.includes("W") && j > 0) {
		adj = magicmaze.cell(i, j - 1);
		tAdj = adj.getType();
		if (tAdj.includes("E"))
			this.add(i, j - 1);
	}
}