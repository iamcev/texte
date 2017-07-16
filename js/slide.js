//holds slide information
function Slide(img, col, sec, til, con, not) {
	this.img = img;
	this.col = col;
	this.sec = sec;
	this.til = til;
	this.con = con;
	this.not = not;

	this.image = img;

	this.con = formatString(this.con, '#');
	this.con = formatString(this.con, '_');
	this.con = formatString(this.con, '*');

	this.not = formatString(this.not, '#');
	this.not = formatString(this.not, '_');
	this.not = formatString(this.not, '*');
}

//parses through array of lines (pres) and creates all slides
function createSlides(pres) {
	//list of all possible attributes
	var attributes = [
	'fro',
	'int',
	'hi1',
	'hi2',
	'hi3',
	'img',
	'col',
	'sec',
	'til',
	'con',
	'not'
	];

	//attributes to be used to define slide
	var img = '';
	var col = '';
	var sec = '';
	var til = '';
	var con = '';
	var not = '';

	//manage information retrieval
	var currentKey;
	var newKey;
	var value;
	var atSlides = false;

	//go through each line
	for (var i = 0; i < pres.length; i++) {
		newKey = false;

		//skip lines starting with '//' and empty lines
		if (pres[i].substring(0, 2) === '//' || pres[i].length == 1) continue;

		//start new slide if line starts with '='
		if (pres[i].substring(0, 1) === '=') {

			//everything before first '=' is not considered a slide, can be used to declare custom theme
			if (atSlides) {
				var s = new Slide(img, col, sec, til, con, not);
				slides.push(s);

				//reset title, content, and notes (other values can stay, so as to avoid redundancy)
				til = '';
				con = '';
				not = '';
			} else atSlides = true;
			continue;
		}

		//go through each attribute and see if line begins with its declaration
		for (var j = 0; j < attributes.length; j++) {
			if (pres[i].substring(0, attributes[j].length + 1) === attributes[j] + ':') {

				//once key has been found, update $currentKey, and get the line's value
				currentKey = attributes[j];
				value = pres[i].substring(currentKey.length + 1, pres[i].length);
				value = value.trim();
				newKey = true;
			}
		}

		//if key wasn't found, continue adding to the previously acquired attribute
		if (!newKey) {
			if (pres[i].substring(0, 1) === '+')  value = value + '<p>' + pres[i].substring(1, pres[i].length) + '</p>';
			else if (pres[i].substring(0, 1) === '-') value = value + '<p class="l">' + pres[i].substring(1, pres[i].length) + '</p>';
			else value = value + pres[i];
		}

		//assign value to attribute for slide
		switch (currentKey) {
			case 'img':
				img = value;
				break;

			case 'col':
				col = value;
				break;

			case 'sec':
				sec = value;
				break;

			case 'til':
				til = value;
				break;

			case 'con':
				con = value;
				break;

			//globals (not for slides, but for interface colors)
			case 'fro':
				fro = value;
				break;

			case 'int':
				int = value;
				break;
		}
	}
	//push last slide
	var s = new Slide(img, col, sec, til, con, not);
	slides.push(s);

	//load first slide
	loadSlide(0);
}
