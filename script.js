document.addEventListener('DOMContentLoaded', () => {
    const audioCheckboxesContainer = document.getElementById('audio-checkboxes');
    const playCountInput = document.getElementById('play-count');
    const playButton = document.getElementById('play-button');
    const audioPlayer = document.getElementById('audio-player');
    const nowPlayingDisplay = document.getElementById('now-playing');

    // --- Configuration ---
    // IMPORTANT: Replace these with your actual audio file names in the 'public/audio/' directory.
    const availableAudioFiles = [
        { name: '1st Commandment', filename: 'ten_commandments/1st.mp3' },
        { name: '2nd Commandment', filename: 'ten_commandments/2nd.mp3' },
        { name: '3rd Commandment', filename: 'ten_commandments/3rd.mp3' },
        { name: '4th Commandment', filename: 'ten_commandments/4th.mp3' },
        { name: '5th Commandment', filename: 'ten_commandments/5th.mp3' },
        { name: '6th Commandment', filename: 'ten_commandments/6th.mp3' },
        { name: '7th Commandment', filename: 'ten_commandments/7th.mp3' },
        { name: '8th Commandment', filename: 'ten_commandments/8th.mp3' },
        { name: '9th Commandment', filename: 'ten_commandments/9th.mp3' },
        { name: '10th Commandment', filename: 'ten_commandments/10th.mp3' },
        { name: 'Closing Prayer', filename: 'close.mp3' },
    ];
    // --- End Configuration ---

    // Function to populate the audio checkboxes
    function populateAudioCheckboxes() {
        audioCheckboxesContainer.innerHTML = ''; // Clear existing content
        availableAudioFiles.forEach(audio => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'audio-checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `audio-${audio.filename.replace(/[^a-zA-Z0-9]/g, '-')}`; // Create a unique ID
            checkbox.value = audio.filename;
            checkbox.name = 'audio-track';

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = audio.name;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            audioCheckboxesContainer.appendChild(checkboxDiv);
        });
    }

    // Function to play audio a specified number of times
    let currentSequenceIndex = 0;
    let currentRepetition = 0;
    let audioFilesToPlay = [];

    function playAudioRepeatedly(filenames, repetitions) {
        if (filenames.length === 0) {
            alert('No audio files selected to play.');
            return;
        }

        audioFilesToPlay = filenames;
        currentSequenceIndex = 0;
        currentRepetition = 0;
        totalPlays = repetitions;

        function playNextInSequence() {
            if (currentRepetition < totalPlays) {
                if (currentSequenceIndex < audioFilesToPlay.length) {
                    const filename = audioFilesToPlay[currentSequenceIndex];
                    const audioInfo = availableAudioFiles.find(audio => audio.filename === filename);
                    const trackName = audioInfo ? audioInfo.name : filename;

                    nowPlayingDisplay.textContent = `Playing: ${trackName} (Repetition ${currentRepetition + 1} of ${totalPlays})`;
                    audioPlayer.src = `audio/${filename}`;
                    audioPlayer.play();
                    console.log(`Playing: ${filename} (Repetition: ${currentRepetition + 1}/${totalPlays}, Track: ${currentSequenceIndex + 1}/${audioFilesToPlay.length})`);
                    currentSequenceIndex++;
                } else {
                    // End of sequence, start next repetition
                    currentSequenceIndex = 0;
                    currentRepetition++;
                    if (currentRepetition < totalPlays) {
                        playNextInSequence(); // Start the next repetition
                    } else {
                        console.log(`Finished playing all sequences ${totalPlays} times.`);
                        nowPlayingDisplay.textContent = 'Finished playing all tracks.';
                        audioPlayer.onended = null; // Remove the event listener
                    }
                }
            }
        }

        audioPlayer.onended = playNextInSequence;
        playNextInSequence(); // Start the first track
    }

    // Event listener for the play button
    playButton.addEventListener('click', () => {
        const selectedFilenames = Array.from(document.querySelectorAll('input[name="audio-track"]:checked'))
                                    .map(checkbox => checkbox.value);
        const playCount = parseInt(playCountInput.value, 10);

        if (selectedFilenames.length === 0) {
            alert('Please select at least one audio file to play.');
            return;
        }

        if (isNaN(playCount) || playCount < 1) {
            alert('Please enter a valid number of plays (at least 1).');
            return;
        }

        playAudioRepeatedly(selectedFilenames, playCount);
    });

    // Initialize the checkboxes
    populateAudioCheckboxes();
});