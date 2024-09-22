document.addEventListener('DOMContentLoaded', function() {
    const flame = document.getElementById('flame');
    const caption = document.getElementById('birthdayCaption');

    // Only attach event listeners if the flame element is found
    if (flame) {
        flame.addEventListener('click', function() {
            // Request access to the microphone
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(stream => {
                    const audioContext = new AudioContext();
                    const analyser = audioContext.createAnalyser();
                    const microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);
                    analyser.fftSize = 512;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    // Function to check sound level
                    const checkSound = () => {
                        analyser.getByteFrequencyData(dataArray);
                        let sum = dataArray.reduce((a, b) => a + b, 0);
                        let average = sum / bufferLength;

                        // If average volume exceeds threshold, play the birthday song
                        if (average > 20) { // Adjust this threshold based on testing
                            playBirthdaySong();
                            flame.style.visibility = 'hidden';
                            flame.style.opacity = '0';
                            audioContext.close(); // Close the audio context to clean up
                            clearInterval(soundCheckInterval); // Stop checking the sound
                            caption.style.visibility = 'visible'; // Show the caption
                        }
                    };

                    // Check sound every 100 milliseconds
                    const soundCheckInterval = setInterval(checkSound, 100);
                })
                .catch(error => {
                    console.error('Error accessing the microphone', error);
                });
        }, { once: true });
    }
});

function playBirthdaySong() {
    const audio = new Audio('birthday_song.mp3'); 
    audio.play();
}
