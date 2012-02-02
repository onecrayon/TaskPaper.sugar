/**
 * Adds a new task when using a newline at the end of a TaskPaper task
 */

action.canPerformWithContext = function(context, outError) {
	// Don't even both with this if there's a selection
	return context.selectedRanges[0].length === 0;
};

// Shared selectors
var puncSelector = new SXSelector('task > punctuation.definition.begin'),
	rootSelector = new SXSelector('task'),
	taskSelector = new SXSelector('task, task *'),
	projectSelector = new SXSelector('project > name, project > name *, project-tags');

function isSameZone(zone1, zone2) {
	return zone1.range.location === zone2.range.location && zone1.range.length === zone2.range.length;
}

action.performWithContext = function(context, outError) {
	/*
	Possible scenarios:
	
	- Beginning of the line (moves the whole task down a line)
	- Middle of the line (creates new task at cursor, strips dangling whitespace)
	- End of the line (creates new task)
	*/
	var cursor = context.selectedRanges[0],
		zone = context.syntaxTree.zoneAtCharacterIndex(cursor.location);
	
	if (puncSelector.matches(zone)) {
		// We're immediately prior to the initial punctuation, so just insert a normal newline
		return context.insertTextSnippet(new CETextSnippet('\n'));
	}
	
	var rootZone = zone,
		recipe = new CETextRecipe();
	// Make sure our root zone is the whole task
	while (!rootSelector.matches(rootZone) && rootZone !== undefined) {
		rootZone = rootZone.parent;
	}
	
	if (rootZone === undefined) {
		// Reset our zone to the zone immediately before the cursor
		zone = context.syntaxTree.zoneAtCharacterIndex(cursor.location - 1);
		if (rootSelector.matches(zone) && zone.text === '- ') {
			// We are in an empty task element, so delete it
			recipe.deleteRange(zone.range);
			return context.applyTextRecipe(recipe);
		} else if (taskSelector.matches(zone)) {
			// The task element is immediately to the left of the cursor, so insert a new task snippet
			return context.insertTextSnippet(new CETextSnippet('\n- $0'));
		} else if (projectSelector.matches(zone)) {
			// The prior element is the project, so insert a linebreak and increase our indentation level
			return context.insertTextSnippet(new CETextSnippet('\n\t'));
		} else {
			// There is no task element near the cursor, so just insert a linebreak normally
			return context.insertTextSnippet(new CETextSnippet('\n'));
		}
	} else {
		// We are inside of a task element
		if (cursor.location < rootZone.range.length + 2) {
			// The cursor is in the start of the task line, prior to the actual text
			// Insert a newline immediately prior to the task
			recipe.insertAtIndex(context.lineStorage.lineRangeForIndex(cursor.location).location, context.textPreferences.lineEndingString);
			return context.applyTextRecipe(recipe);
		} else {
			// We are inside the task element, but need to trim the whitespace from around the cursor before we insert our new task snippet
			var trimIndex = cursor.location;
			while (/^\s$/.test(context.substringWithRange(new Range(trimIndex - 1, 1)))) {
				trimIndex--;
			}
			if (trimIndex < cursor.location) {
				// There's whitespace prior to the cursor, trim it
				recipe.deleteRange(new Range(trimIndex, cursor.location - trimIndex));
			}
			// Apply our recipe prior to moving on
			context.applyTextRecipe(recipe);
			var snippet = '\n-';
			if (!/^\s$/.test(context.substringWithRange(new Range(cursor.location, 1)))) {
				// No whitespace after the cursor, so add to our snippet
				snippet += ' ';
			}
			// Insert it!
			return context.insertTextSnippet(new CETextSnippet(snippet));
		}
	}
};
