const ig = new Instagram({
	username: '',
	password: '',
	// database: ,
});

ig.home().subscribe();

ig.search('').subscribe();

ig.location('').subscribe();

ig.user('').profile();

ig.user('').feed().subscribe();

ig.user('').followers().subscribe();

ig.user('').following().subscribe();

ig.media('').details();

ig.media('').likes().subscribe();

ig.media('').comments().subscribe();
