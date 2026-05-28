document.addEventListener('DOMContentLoaded', () => {
    const audioSelect = document.getElementById('audio-select');
    const playCountInput = document.getElementById('play-count');
    const playButton = document.getElementById('play-button');
    const audioPlayer = document.getElementById('audio-player');

    // --- Configuration ---
    // IMPORTANT: Replace these with your actual audio file names in the 'public/audio/' directory.
    const availableAudioFiles = [
        { name: 'Audio File 1', filename: 'audio1.mp3' },
        { name: 'Audio File 2', filename: 'audio2.mp3' },
        { name: 'Audio File 3', filename: 'audio3.mp3' },
        // Add more audio files here
    ];
    // --- End Configuration ---

    // Function to populate the audio select dropdown
    function populateAudioSelect() {
        audioSelect.innerHTML = '<option value="">--Please choose an audio file--</option>'; // Clear existing options
        availableAudioFiles.forEach(audio => {
            const option = document.createElement('option');
            option.value = audio.filename;
            option.textContent = audio.name;
            audioSelect.appendChild(option);
        });
    }

    // Function to play audio a specified number of times
    let currentPlayCount = 0;
    let totalPlays = 0;

    function playAudioRepeatedly(filename, count) {
        if (!filename) {
            alert('Please select an audio file first.');
            return;
        }

        audioPlayer.src = `audio/${filename}`;
        currentPlayCount = 0;
        totalPlays = count;

        // Start playing the first time
        audioPlayer.play();
        currentPlayCount++;

        // Listen for when the audio ends
        audioPlayer.onended = () => {
            if (currentPlayCount < totalPlays) {
                audioPlayer.play();
                currentPlayCount++;
            } else {
                console.log(`Finished playing ${filename} ${totalPlays} times.`);
                audioPlayer.onended = null; // Remove the event listener
            }
        };
    }

    // Event listener for the play button
    playButton.addEventListener('click', () => {
        const selectedFilename = audioSelect.value;
        const playCount = parseInt(playCountInput.value, 10);

        if (isNaN(playCount) || playCount < 1) {
            alert('Please enter a valid number of plays (at least 1).');
            return;
        }

        playAudioRepeatedly(selectedFilename, playCount);
    });

    // Initialize the dropdown
    populateAudioSelect();
});