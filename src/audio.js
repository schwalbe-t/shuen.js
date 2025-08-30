
/**
 * Starts playback of the given sound. Starting playback of the same sound
 * while it is already running will stop the playback and call the previously
 * given callback.
 * @param {string} audio The URL of the audio file to play.
 * @param {function} onStop A function that shall be called when playback is stopped.
 */
const play = (() => {

    const playerCache = {};

    function getAudioPlayer(audio) {
        const cached = playerCache[audio];
        if(cached) { return cached; }
        if(typeof audio != "string") {
            throw new Error("The played audio must be a string URL!");
        }
        const player = new Audio(audio);
        playerCache[audio] = player;
        return player;
    }

    return (audio, onStop = (() => {})) => {
        const player = getAudioPlayer(audio);
        if(!player.ended) {
            player.pause();
            if(player.onended) { player.onended(); }
            player.currentTime = 0;
        }
        player.onended = () => onStop();
        player.play();
    };

})();