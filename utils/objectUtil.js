/**
 * Check object contain any null child or not
 * @param  {Object}  target Object to check
 * @return {Boolean}        true if contain null, vice versa
 */
var hasNull = function hasNull(target) {
	for (var member in target) {
		if (target[member] == null)
			return true;
	}
	return false;
}

module.exports = {
	hasNull: hasNull
}