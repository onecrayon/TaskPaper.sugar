/**
 * Toggles a tag on and off for the task surrounding the cursor
 */

action.performWithContext = function(context, outError) {
	var zone = context.syntaxTree.zoneAtCharacterIndex(context.selectedRanges[0].location),
		taskSelector = new SXSelector('task'),
		tagSelector = new SXSelector('tag'),
		tag = action.setup.tag,
		recipe = new CETextRecipe();
	// Parse up the tree if the zone is not a task
	while (!taskSelector.matches(zone)) {
		zone = zone.parent;
	}
	// Look for the tag zone
	var child, tagZone = null;
	for (var i = 0, count = zone.childCount; i < count; i++) {
		child = zone.childAtIndex(i);
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
	return context.applyTextRecipe(recipe);
};
