var calCarVolume = function calCarVolume(width, length, height) {
	return width * length * height / 1000000000;
}

var calShippingCost = function calShippingCost(volume, costPerVolume) {
	return volume * costPerVolume;
}

var calFinalPrice = function calFinalPrice(fob, shippingCost) {
	return fob + shippingCost;
}

module.exports = {
	calCarVolume: calCarVolume,
	calShippingCost: calShippingCost,
	calFinalPrice: calFinalPrice
}