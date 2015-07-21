var triangleDirections = {
	"00":	{
		"A": {
			parentDir:	"BC",
			neighbourName:	"00"
		},
		"B": {
			parentDir:	"CA",
			neighbourName:	"00"
		},
		"C": {
			parentDir:	"AB",
			neighbourName:	"00"
		},
		"AB": {
			neighbourName:	"11"
		},
		"BC": {
			neighbourName:	"01"
		},
		"CA": {
			neighbourName:	"10"
		},
	},
	"01":	{
		"A": {
			parentDir:	"A",
			neighbourName:	"01"
		},
		"B": {
			parentDir:	"AB",
			neighbourName:	"01"
		},
		"C": {
			parentDir:	"CA",
			neighbourName:	"01"
		},
		"AB": {
			parentDir:	"AB",
			neighbourName:	"11"
		},
		"BC": {
			neighbourName:	"00"
		},
		"CA": {
			parentDir:	"CA",
			neighbourName:	"10"
		},
	},
	"10":	{
		"A": {
			parentDir:	"AB",
			neighbourName:	"10"
		},
		"B": {
			parentDir:	"B",
			neighbourName:	"10"
		},
		"C": {
			parentDir:	"BC",
			neighbourName:	"10"
		},
		"AB": {
			parentDir:	"AB",
			neighbourName:	"01"
		},
		"BC": {
			parentDir:	"BC",
			neighbourName:	"11"
		},
		"CA": {
			neighbourName:	"00"
		},
	},
	"11":	{
		"A": {
			parentDir:	"CA",
			neighbourName:	"11"
		},
		"B": {
			parentDir:	"BC",
			neighbourName:	"11"
		},
		"C": {
			parentDir:	"C",
			neighbourName:	"11"
		},
		"AB": {
			neighbourName:	"00"
		},
		"BC": {
			parentDir:	"BC",
			neighbourName:	"10"
		},
		"CA": {
			parentDir:	"CA",
			neighbourName:	"01"
		},
	}
};

function positionFrom(path, direction) {
	var neighbour;
	var parentPath = path.substr(0, path.length - 2);
	var subPath = path.substr(-2);

	var res = triangleDirections[subPath][direction];
	if("parentDir" in res) {
		neighbour = positionFrom(parentPath, res.parentDir) + res.neighbourName;
	} else {
		neighbour = parentPath + res.neighbourName;
	}
	return neighbour;
}
