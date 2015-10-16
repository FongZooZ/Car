var calCarVolume = function calCarVolume(width, length, height) {
	return width * length * height * 0.000000001;
}

var calShippingCost = function calShippingCost(volume, costPerVolume) {
	return volume * costPerVolume;
}

var calPrice = function calPrice(fob, shippingCost) {
	return fob + shippingCost;
}