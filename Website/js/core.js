function convertProbabilityToWord(prob) {
	var word;
	if(prob<30){
		word = "Unlikely";
	}
	else if(30<=prob<50){
		word = "Theres a chance";
	}
	else if(50<=prob<70){
		word = "Likely";
	}
	else {
		word = "Very Likely";
	}

	return word;
}

