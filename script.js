document.addEventListener('DOMContentLoaded', () => {
    const audioCheckboxesContainer = document.getElementById('audio-checkboxes');
    const playCountInput = document.getElementById('play-count');
    const playButton = document.getElementById('play-button');
    const cancelButton = document.getElementById('cancel-button');
    const skipButton = document.getElementById('skip-button');
    const audioPlayer = document.getElementById('audio-player');
    const nowPlayingDisplay = document.getElementById('now-playing');
    const audioTextDisplay = document.getElementById('audio-text-display');

    // --- Configuration ---
    // Restructured to support hierarchical groups
    const audioGroups = [
        {
            name: '10 Commandments',
            id: 'ten-commandments-group',
            isOpen: true, // Default to open
            files: [
                { name: '1st Commandment', filename: 'ten_commandments/1st.mp3', htmlContent: '<b>You shall have no other gods.</b><br><em>What does this mean?&nbsp;</em>We should fear, love, and trust in God above all things.' },
                { name: '2nd Commandment', filename: 'ten_commandments/2nd.mp3', htmlContent: '<b>You shall not misuse the name of the LORD your God.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not curse, swear, use satanic arts, lie, or deceive by His name, but call upon it in every trouble, pray, praise, and give thanks.' },
                { name: '3rd Commandment', filename: 'ten_commandments/3rd.mp3', htmlContent: '<b>Remember the Sabbath day by keeping it holy.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not despise preaching and His Word, but hold it sacred and gladly hear and learn it.' },
                { name: '4th Commandment', filename: 'ten_commandments/4th.mp3', htmlContent: '<b>Honor your father and your mother.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not despise or anger our parents and other authorities, but honor them, serve and obey them, love and cherish them.' },
                { name: '5th Commandment', filename: 'ten_commandments/5th.mp3', htmlContent: '<b>You shall not murder.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not hurt or harm our neighbor in his body, but help and support him in every physical need.' },
                { name: '6th Commandment', filename: 'ten_commandments/6th.mp3', htmlContent: '<b>You shall not commit adultery.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we lead a sexually pure and decent life in what we say and do, and husband and wife love and honor each other.' },
                { name: '7th Commandment', filename: 'ten_commandments/7th.mp3', htmlContent: '<b>You shall not steal.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not take our neighbor’s money or possessions, or get them in any dishonest way, but help him to improve and protect his possessions and income.' },
                { name: '8th Commandment', filename: 'ten_commandments/8th.mp3', htmlContent: '<b>You shall not give false testimony against your neighbor.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not tell lies about our neighbor, betray him, slander him, or hurt his reputation, but defend him, speak well of him, and explain everything in the kindest way.' },
                { name: '9th Commandment', filename: 'ten_commandments/9th.mp3', htmlContent: '<b>You shall not covet your neighbor’s house.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not scheme to get our neighbor’s inheritance or house, or get it in a way which only appears right, but help and be of service to him in keeping it.' },
                { name: '10th Commandment', filename: 'ten_commandments/10th.mp3', htmlContent: '<b>You shall not covet your neighbor’s wife, or his manservant or maidservant, his ox or donkey, or anything that belongs to your neighbor.</b><br><em>What does this mean?&nbsp;</em>We should fear and love God so that we do not entice or force away our neighbor’s wife, workers, or animals, or turn them against him, but urge them to stay and do their duty.' },
                { name: 'Close', filename: 'close.mp3', htmlContent: '<b>What does God say about all these commandments?</b><br>He says, “I, the LORD your God, am a jealous God, punishing the children for the sin of the fathers to the third and fourth generation of those who hate Me, but showing love to a thousand generations of those who love Me and keep My commandments.” (Ex. 20: 5–6)<br>What does this mean?&nbsp; God threatens to punish all who break these commandments. Therefore, we should fear His wrath and not do anything against them. But He promises grace and every blessing to all who keep these commandments. Therefore, we should also love and trust in Him and gladly do what He commands.' },
            ]
        },
        {
            name: 'Other Audio',
            id: 'other-audio-group',
            isOpen: false, // Default to closed
            files: []
        }
        // Add more groups here as needed
    ];
    // --- End Configuration ---

    // Function to populate the audio checkboxes
    function populateAudioCheckboxes() {
        audioCheckboxesContainer.innerHTML = ''; // Clear existing content

        audioGroups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'audio-group';

            const groupHeader = document.createElement('div');
            groupHeader.className = 'group-header';
            groupHeader.textContent = group.name;
            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'toggle-icon';
            toggleIcon.textContent = '▼'; // Down arrow
            groupHeader.appendChild(toggleIcon);

            const groupContent = document.createElement('div');
            groupContent.className = 'audio-group-content';
            if (!group.isOpen) {
                groupContent.classList.add('hidden');
                groupHeader.classList.add('collapsed');
                toggleIcon.textContent = '▶'; // Right arrow
            }

            groupHeader.addEventListener('click', () => {
                groupContent.classList.toggle('hidden');
                groupHeader.classList.toggle('collapsed');
                toggleIcon.textContent = groupContent.classList.contains('hidden') ? '▶' : '▼';
            });

            group.files.forEach(audio => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'audio-checkbox-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `audio-${group.id}-${audio.filename.replace(/[^a-zA-Z0-9]/g, '-')}`; // Create a unique ID
                checkbox.value = audio.filename;
                checkbox.name = 'audio-track';

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = audio.name;

                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(label);
                groupContent.appendChild(checkboxDiv);
            });

            groupDiv.appendChild(groupHeader);
            groupDiv.appendChild(groupContent);
            audioCheckboxesContainer.appendChild(groupDiv);
        });
    }

    // Function to play audio a specified number of times
    let currentSequenceIndex = 0;
    let currentRepetition = 0;
    let audioFilesToPlay = [];
    let totalPlays = 0; // Moved to global scope

    function playNextInSequence() {
        if (currentRepetition < totalPlays) {
            if (currentSequenceIndex < audioFilesToPlay.length) {
                const filename = audioFilesToPlay[currentSequenceIndex];
                const audioInfo = audioGroups.flatMap(group => group.files).find(audio => audio.filename === filename);
                const trackName = audioInfo ? audioInfo.name : filename;
                const trackHtmlContent = audioInfo ? audioInfo.htmlContent : '';

                nowPlayingDisplay.textContent = `Playing: ${trackName} (Rep ${currentRepetition + 1} of ${totalPlays})`;
                audioTextDisplay.innerHTML = trackHtmlContent;
                audioPlayer.src = `audio/${filename}`;
                audioPlayer.play();
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
                    audioTextDisplay.innerHTML = ''; // Clear text display
                    audioPlayer.onended = null; // Remove the event listener
                }
            }
        }
    }

    function playAudioRepeatedly(filenames, repetitions) {
        if (filenames.length === 0) {
            alert('No audio files selected to play.');
            return;
        }

        audioFilesToPlay = filenames;
        currentSequenceIndex = 0;
        currentRepetition = 0;
        totalPlays = repetitions;

        audioPlayer.onended = playNextInSequence;
        playNextInSequence(); // Start the first track
    }

    // Event listener for the cancel button
    cancelButton.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Rewind to the beginning
        audioPlayer.src = ''; // Clear the audio source
        currentSequenceIndex = 0;
        currentRepetition = 0;
        audioFilesToPlay = [];
        nowPlayingDisplay.textContent = ''; // Clear now playing display
        audioTextDisplay.innerHTML = ''; // Clear text display
        audioPlayer.onended = null; // Remove the event listener
        console.log('Playback cancelled.');
    });

    // Event listener for the skip button
    skipButton.addEventListener('click', () => {
        if (audioFilesToPlay.length > 0 && currentRepetition < totalPlays) {
            audioPlayer.pause(); // Pause current track
            playNextInSequence(); // Immediately play the next track
        } else {
            console.log('No active playback to skip.');
        }
    });

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
