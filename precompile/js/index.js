// Writing bad code since the aim is to build good looking widgets as fast as possible.

import '../css/index.scss';
const tmi = require('tmi.js');
const dommy = require('dommy.js');

window.onload = function(){
	const key = getParameterByName('key');
	const username = getParameterByName('username');
	const channel = getParameterByName('channel');
	const container = document.getElementsByClassName('container')[0];

	window.createEmote = createEmote;
	if(!key || !username || !channel){
		document.getElementById('red-error').style.display = 'flex';
		return;
	}

	var options = {
		options: {
			debug: true
		},
		connection: {
			reconnect: true
		},
		identity: {
			username: username,
			password: "oauth:"+key,
		},
		channels: [channel]
	};

	var client = new tmi.client(options);

	client.on('chat', (channel, userstate, message, self) => {
		console.log(userstate.emotes);
		Object.keys(userstate.emotes).forEach((emote) => {
			userstate.emotes[emote].forEach(() => {
				setTimeout(() => {
					container.appendChild(createEmote(`https://static-cdn.jtvnw.net/emoticons/v1/${emote}/3.0`));
				}, Math.round(Math.random()*5000));
			});
		});
	});

	client.connect()
	.catch( () => {
		document.getElementById('red-error').style.display = 'flex';
		console.log('failed to connect!');
	});
}

function createEmote(url){
	return dommy({
		tag:'div',
		attributes:{'class':'emote-container', style:`top:${Math.round(Math.random()*70)}%; height:${30+Math.round(Math.random()*20)}vh`},
		children:[
			{
				tag:'div',
				attributes:{'class':'emote-center-container'},
				children:[
					{
						tag:'div',
						attributes:{'class':'circle'},
						children:[
							{
								tag:'img',
								attributes:{'src':url, 'class':'emote'}
							}
						]
					}
				],
			}
		],
		events:{
			animationend: function(){
				this.parentNode.removeChild(this);
			}
		}
	});
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}