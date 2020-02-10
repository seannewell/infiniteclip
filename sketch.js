var audioContext = new AudioContext();
let mic, recorder, soundFile;
recorder = new p5.SoundRecorder();
soundFile = new p5.SoundFile();

function readFile(files) {
		var fileReader = new FileReader();
		fileReader.readAsArrayBuffer(files[0]);
		fileReader.onload = function(e) {
			playAudioFile(e.target.result);
			console.log(("Filename: '" + files[0].name + "'"), ( "(" + ((Math.floor(files[0].size/1024/1024*100))/100) + " MB)" ));
		}
	}
	function playAudioFile(file) {
			audioContext.decodeAudioData(file, function(buffer) {
				var source = audioContext.createBufferSource();
				source.buffer = buffer;
				source.loop = false;
        source.connect(infiniteClip);
				infiniteClip.connect(audioContext.destination);
				source.start();
			});
	}


var bufferSize = 4096;
var infiniteClip = (function() {
    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          if(input[i] > 0){
            output[i] = 1;
          } else if (input[i] < 0){
            output[i] = -1;
          } else {
            output[i] = input[i];
          }
					output[i] = output[i]*0.2;
        }
    }
    return node;
})();
