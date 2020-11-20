const fs = require("fs");
/**
 * Read json file from the root folder 
 */
fs.readFile("./clicks.json", "utf8", (err, clicksArr) => {
	if(err) {
		console.log("Failed to load clicks.json:", err);
		return;
	}
	clicksArr && fs.writeFile('./resultset.json', JSON.stringify(getClicksSubset(JSON.parse(clicksArr))), err => {
		if(err) {
			console.log('Failed to writing clicks subset JSON file', err)
		} else {
			console.log('Successfully wrote resultset.json file');
		}
	});
});
/**
 * 
 * @param {filter data for each ip} data
 */
const filterClicksArr = function(data) {
	const finalArray = [];
	data.forEach(obj => {
		const item = finalArray.find(item => new Date(item.timestamp).getHours() === new Date(obj.timestamp).getHours());
		if(item) {
			const index = finalArray.findIndex(item => new Date(item.timestamp).getHours() === new Date(obj.timestamp).getHours());
			if(item.amount < obj.amount) {
				finalArray.splice(index, 1, obj);
			}
			return;
		}
		finalArray.push(obj);
	});
	return finalArray;
};
/**
 * 
 * @param {clicks original JSON array} clicks 
 */
const getClicksSubset = function(clicks) {
	const clicksTempObj = {};
	const subsetArr = [];
	for(let i = 0; i < clicks.length; i++) {
		if(clicks[i].ip in clicksTempObj) {
			clicksTempObj[clicks[i].ip].push(clicks[i]);
		} else {
			clicksTempObj[clicks[i].ip] = new Array();
			clicksTempObj[clicks[i].ip].push(clicks[i]);
		}
		if(i === clicks.length - 1) {
			for(let key in clicksTempObj) {
				clicksTempObj[key] = clicksTempObj[key].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
				if(clicksTempObj[key].length === 1) {
					subsetArr.push(clicksTempObj[key][0]);
				} else if(clicksTempObj[key].length <= 10) {
					subsetArr.push(...filterClicksArr(clicksTempObj[key]));
				}
				//  else if(clicksTempObj[key].length > 10){
				//      delete clicksTempObj[key];
				//  }  
			}
			//console.log('Filter clicks Array >>>>>', clicksTempObj);
            console.log('Final Subset Clicks Array >>>>>', subsetArr);
            return subsetArr;
		}
	}
};