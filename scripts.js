var errorAudio;
var alarmAudio;
var missedBlocks;
var frequency;
var delegateName;
var node;
var interval;
var playError;
var playMissed;

window.onload = function() {
    errorAudio = document.getElementById("Error");
    alarmAudio = document.getElementById("Alarm");
};

function stop() {
    document.getElementById('status').innerHTML = 'Status: <font color="red">Not Checking</font>';
    enableOptions();
    clearInterval(interval);
}

function start() {
    missedBlocks = 0;
    frequency = document.getElementById('frequency').value * 1000 * 60;
    delegateName = document.getElementById('delegate').value;

    if (document.getElementById('radmainnet').checked) {
        let nodeselect = document.getElementById('mainnetnodes');
        node = nodeselect[nodeselect.selectedIndex].value;
    } else if (document.getElementById('radtestnet').checked) {
        let nodeselect = document.getElementById('testnetnodes');
        node = nodeselect[nodeselect.selectedIndex].value;
    } else if (document.getElementById('radcustom').checked) {
        node = document.getElementById('customnode').value;
    }

    if (frequency >= 1000 * 60) //one minute
    {
        disableOptions();
        preloadErrorSound();
        preloadMissedBlockSound();
        window.scrollTo(0, 0);
        fetch(node + '/api/delegates?username=' + delegateName)
            .then(res => res.json())
            .then((out) => {
                document.getElementById('status').innerHTML = 'Status: <font color="green">Checking</font>';
                missedBlocks = out.data[0].missedBlocks;
                document.getElementById('numOfMissedBlocks').innerText = 'Number of Missed Blocks for ' + delegateName + ': ' + missedBlocks;
                interval = setInterval(function() {
                    checkMissedBlocks();
                }, frequency);
            }).catch(err => alert(err));
    } else {
        alert("Frequency must by 1 minute or greater");
    }
}

function checkMissedBlocks() {
    fetch(node + '/api/delegates?username=' + delegateName)
        .then(res => res.json())
        .then((body) => {
            try {
                let missedBlocks2 = body.data[0].missedBlocks;
                let dt = new Date();

                let minutes;
                if (dt.getMinutes() > 9) {
                    minutes = dt.getMinutes();
                } else {
                    minutes = '0' + dt.getMinutes();
                }

                let seconds;
                if (dt.getSeconds() > 9) {
                    seconds = dt.getSeconds();
                } else {
                    seconds = '0' + dt.getSeconds();
                }

                let dtformat = dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear() + ' ' + dt.getHours() + ':' + minutes + ':' + seconds;
                if (missedBlocks2 > missedBlocks) {
                    playMissedBlocksSound();
                    missedBlocks = missedBlocks2;
                    document.getElementById('numOfMissedBlocks').innerText = 'Number of Missed Blocks for ' + delegateName + ': ' + missedBlocks;
                    document.getElementById('lastMissedBlock').innerText = 'Last Missed Block: ' + dtformat;
                } else {
                    document.getElementById('lastCheck').innerText = 'Last Check: ' + dtformat;
                }
            } catch (e) {
                processError(e);
            }
        }).catch(e => processError(e));
}

function processError(e)
{
    playErrorSound();
    let dt = new Date();

    let minutes;
    if (dt.getMinutes() > 9) {
        minutes = dt.getMinutes();
    } else {
        minutes = '0' + dt.getMinutes();
    }

    let seconds;
    if (dt.getSeconds() > 9) {
        seconds = dt.getSeconds();
    } else {
        seconds = '0' + dt.getSeconds();
    }

    let dtformat = dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear() + ' ' + dt.getHours() + ':' + minutes + ':' + seconds;

    document.getElementById('lastError').innerText = 'Last Error: ' + e + ' at ' + dtformat;
}

function preloadErrorSound()
{
    let source = document.getElementById('Error');
    let sourceselect = document.getElementById('errorblocksound');
    if(sourceselect[sourceselect.selectedIndex].value !== 'none')
    {
        source.src = sourceselect[sourceselect.selectedIndex].value;
        sourceselect.preload;
        playError = true;
    }
    else
    {
        playError = false;
    }
}

function preloadMissedBlockSound()
{
    let source = document.getElementById('Alarm');
    let sourceselect = document.getElementById('missedblocksound');
    if(sourceselect[sourceselect.selectedIndex].value !== 'none')
    {
        source.src = sourceselect[sourceselect.selectedIndex].value;
        sourceselect.preload;
        playMissed = true;
    }
    else
    {
        playMissed = false;
    }
}

function testErrorSound() {
    preloadErrorSound();
    if(playError)
    {
        errorAudio.play();
    }
}

function testMissedBlocksSound() {
    preloadMissedBlockSound();
    if(playMissed)
    {
        alarmAudio.play();
    }
}

function playErrorSound() {
    if(playError)
    {
        errorAudio.play();
    }
}

function playMissedBlocksSound() {
    if(playMissed)
    {
        alarmAudio.play();
    }
}

function stopSounds() {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    errorAudio.pause();
    errorAudio.currentTime = 0;
}

function showmainnetnodes() {
    document.getElementById("mainnetnodes").style.display = 'block';
    document.getElementById("testnetnodes").style.display = 'none';
    document.getElementById("customnode").style.display = 'none';
}

function showtestnetnodes() {
    document.getElementById("mainnetnodes").style.display = 'none';
    document.getElementById("testnetnodes").style.display = 'block';
    document.getElementById("customnode").style.display = 'none';
}

function showcustomnode() {
    document.getElementById("mainnetnodes").style.display = 'none';
    document.getElementById("testnetnodes").style.display = 'none';
    document.getElementById("customnode").style.display = 'block';
}

function disableOptions() {
    document.getElementById('radmainnet').disabled = true;
    document.getElementById('radtestnet').disabled = true;
    document.getElementById('radcustom').disabled = true;
    document.getElementById('mainnetnodes').disabled = true;
    document.getElementById('testnetnodes').disabled = true;
    document.getElementById('customnode').disabled = true;
    document.getElementById('frequency').disabled = true;
    document.getElementById('errorblocksound').disabled = true;
    document.getElementById('missedblocksound').disabled = true;
    document.getElementById('delegate').disabled = true;
}

function enableOptions() {
    document.getElementById('radmainnet').disabled = false;
    document.getElementById('radtestnet').disabled = false;
    document.getElementById('radcustom').disabled = false;
    document.getElementById('mainnetnodes').disabled = false;
    document.getElementById('testnetnodes').disabled = false;
    document.getElementById('customnode').disabled = false;
    document.getElementById('frequency').disabled = false;
    document.getElementById('errorblocksound').disabled = false;
    document.getElementById('missedblocksound').disabled = false;
    document.getElementById('delegate').disabled = false;
}
