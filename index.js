const observer = {
	next: function(data){ console.log(data) },
	complete: function(){ console.log('done') },
	error: function(){ console.log('Error: ', err) }
}

function filterFn(conditionFn){ 
	const inputObservable = this;
	const outputObserable = createObservable(function(obs) {
		inputObservable.subscribe({
			next: (x) => conditionFn(x) && obs.next(x),
			complete: () => obs.complete(),
			error: (err) => obs.error(err)
		})
	});

	return outputObserable;
}

function mapFn(transformationFn){ 
	const inputObservable = this;
	const outputObserable = createObservable(function(obs) {
		inputObservable.subscribe({
			next: (x) => obs.next(transformationFn(x)),
			complete: () => obs.complete(),
			error: (err) => obs.error(err)
		})
	});

	return outputObserable;
}

function createObservable(subscribeFn){
	return {
		map: mapFn,
		filter: filterFn,
		subscribe: subscribeFn
	}
}

const intervalObservable = createObservable(function(obs){
	let counts = 0;
	const intevalId = setInterval(() => {
		counts++;
		obs.next(counts);

		if(counts > 5){
			clearInterval(intevalId);
			obs.complete();
		} 

	}, 300)

});


const arrayObservable = createObservable(function(obs){
	[2,3,4,5,5].forEach(obs.next);
	obs.complete();
});

intervalObservable
	.filter(x => x%2)
	.map(x => x *10)
	.subscribe(observer)