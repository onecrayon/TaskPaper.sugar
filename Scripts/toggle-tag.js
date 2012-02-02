/**
 * Toggles a tag on and off for the task surrounding the cursor
 */

// Shared selectors
var rootSelector = new SXSelector('task'),
	taskSelector = new SXSelector('task, task *'),
	tagSelector = new SXSelector('tag');

function findRoot(zone) {
	while (!rootSelector.matches(zone)) {
		zone = zone.parent;
	}
	return zone;
}

action.performWithContext = function(context, outError) {
	var range = context.selectedRanges[0],
		zones = [], zone,
		tag = action.setup.tag,
		recipe = new CETextRecipe();
	if (range.length === 0) {
		// We only have a cursor, so find the nearby task (if any)
		zone = context.syntaxTree.zoneAtCharacterIndex(range.location);
		if (taskSelector.matches(zone)) {
			// We are inside the task zone
			zone = findRoot(zone);
			zones.push(zone);
		} else if (range.location > 0 && taskSelector.matches(context.syntaxTree.zoneAtCharacterIndex(range.location - 1))) {
			zone = context.syntaxTree.zoneAtCharacterIndex(range.location - 1);
			zone = findRoot(zone);
			// The task zone is immediately to our left; grab it
			zones.push(zone);
		}
	} else {
		// We have one or more selections; parse through them and find all the included task zones
		var tempZones;
		for (var i = 0, count = context.selectedRanges.length; i < count; i++) {
			// We work with line ranges, because the selection might not completely encompass the task zone(s)
			range = context.lineStorage.lineRangeForRange(context.selectedRanges[i]);
			tempZones = context.syntaxTree.zonesInCharacterRange(range);
			for (var j = 0, countZones = tempZones.length; j < countZones; j++) {
				if (rootSelector.matches(tempZones[j])) {
					zones.push(tempZones[j]);
				}
			}
		}
	}
	
	if (zones.length === 0) {
		// No nearby task zones, so exit
		return false;
	}
	
	// Loop through all task zones and update them accordingly
	var child, tagZone = null;
	for (var i = 0, count = zones.length; i < count; i++) {
		zone = zones[i];
		tagZone = null;
		// Look for the target tag zone
		for (var j = 0, tagCount = zone.childCount; j < tagCount; j++) {
			child = zone.childAtIndex(j);
			if (tagSelector.matches(child) && child.text.indexOf(tag) === 0) {
				tagZone = child;
				break;
			}
		}
		if (tagZone === null) {
			// There's no tag yet, so add one
			recipe.insertAtIndex(zone.range.location + zone.range.length, ' ' + tag);
		} else {
			if (tagZone.range.location === zone.range.location + 2) {
				// The @tag is the very first thing in the task, so delete the space following it
				recipe.deleteRange(new Range(tagZone.range.location, tagZone.range.length + 1));
			} else {
				// The @tag is inline somewhere, so delete the space before it along with the tag
				recipe.deleteRange(new Range(tagZone.range.location - 1, tagZone.range.length + 1));
			}
		}
	}
	
	// Apply our changes!
	return context.applyTextRecipe(recipe);
};
