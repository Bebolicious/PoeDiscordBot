const Discord = require('discord.js');
const config = require('./AppSettings.json');
const client = new Discord.Client();
const v = config.version;
const host = config.preset.host;
const inputPrefix = '$';

client.once('ready', () => {
    console.log('PoeBot Connected to host');
    console.log('Setting up handlers...');
    //dailyTest();
});

function GetappId() {
    
}

// function dailyTest() {
//     const fetch = require('node-fetch');
//     const JSDOM = require('jsdom').JSDOM;
//     let url = 'https://www.poelab.com/kddzd/';
//     fetch(url)
//         .then(resp => resp.text())
//         .then(text => {
//             let dom = new JSDOM(text)
//             let {
//                 document
//             } = dom.window;
//             const img = document.querySelector('div#regular-container').innerHTML;
//             let regex = new RegExp('(http|ftp|https):(..www.*.jpg)');
//             let imageUrl = img.match(regex)[0];
//             console.log('Daily uberlab image url: ' + imageUrl);
//             return;
//         }).catch(function (err) {
//             console.warn('Something went wrong.', err);
//         });;
// }

client.on('message', message => {
    if (!message.content.startsWith(inputPrefix) || message.author.bot) {
        return;
    };

    if(message.channel.id !== '730827161879052368') {
        message.channel.send('I am not allowed in here :(');
        return;
    };

    const args = message.content.slice(inputPrefix.length).split(/ +/);
    const input = args.shift().toLowerCase();

    if (input === 'online?' && config) {
        message.channel.send('I am actually up and running version: ' + v + ' from: ' + host)
    };

    if (input === 'getchar') {
        console.log(args);
        const fetch = require("node-fetch");
        var requestOptions = {
            method: 'GET',
            headers: {
                Cookie: 'POESESSID=926ed593c43cf7f528347e2a11315194; __cfduid=dad13790cfc7f088dbb934b85db18eee21614438824; Path=/; Domain=pathofexile.com; HttpOnly; Expires=Mon, 29 Mar 2021 15:13:44 GMT;',
                'User-Agent': 'PostmanRuntime/7.26.10'
            },
            redirect: 'follow'
        };
        const url = 'https://www.pathofexile.com/character-window/get-characters?accountName=' + args[0];

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                let charObj = {
                    "fields": []
                }
                const resultString = JSON.stringify(result);
                if(resultString.includes('error') && resultString.includes('Forbidden')) {
                    message.channel.send('Profile \'' + args[0] + '\' is set to private');
                    return;
                }

                Object.entries(result).forEach(([key, value]) => {
                    if (value.league === "Ritual") {
                        charObj.fields.push({
                            "name": "Character",
                            "value": "League\nLevel\nClass\n",
                            "inline": true
                        });
                        charObj.fields.push({
                            "name": value.name,
                            "value": "Ritual\n" + value.level + "\n" + value.class + "\n",
                            "inline": true
                        })
                        charObj.fields.push({
                            "name": "‏‏‎ ‎",
                            "value": "‏‏‎ ‎",
                        })

                    }
                })
                const embed = {
                    "thumbnail": {
                        "url": "https://static.wikia.nocookie.net/pathofexile_gamepedia/images/3/36/Conquerors_of_the_Atlas_logo.png/revision/latest?cb=20191214000513"
                    },
                    "author": {
                        "name": "Path of Exile Characters",
                        "url": "https://discordapp.com",
                        "icon_url": "https://static.wikia.nocookie.net/pathofexile_gamepedia/images/3/36/Conquerors_of_the_Atlas_logo.png/revision/latest?cb=20191214000513"
                    },
                    "fields": [
                        charObj.fields
                    ]
                };

                message.channel.send({
                    embed
                });;

            }).catch(err => {
                message.channel.send('Something went wrong with the request :/')
            })

    }

    if (input === 'uberlab') {
        const fetch = require('node-fetch');
        const JSDOM = require('jsdom').JSDOM;
        let url = 'https://www.poelab.com/kddzd/';
        fetch(url)
            .then(resp => resp.text())
            .then(text => {
                let dom = new JSDOM(text)
                let {
                    document
                } = dom.window;
                const img = document.querySelector('div#regular-container').innerHTML;
                let regex = new RegExp('(http|ftp|https):(..www.*.jpg)');
                let imageUrl = img.match(regex)[0];
                message.channel.send(imageUrl);
                return Promise.resolve();
            });
    }
});



client.login(config.secret);