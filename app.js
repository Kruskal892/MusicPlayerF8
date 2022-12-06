const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const preBtn = $('.btn-playback');
const shuffleBtn = $('.btn-shuffle');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,

    songs: [
        {
            name: 'Murder In My Mind',
            singer: 'Kordhell',
            path: './assets/music/kordhell_murder_in_my_mind.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'By the Sword',
            singer: 'JakeHill',
            path: './assets/music/jake_hill_by_the_sword.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Warrior',
            singer: 'Cowbell',
            path: './assets/music/sxmpra_cowbell_warrior.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Despair',
            singer: 'Limitless',
            path: './assets/music/despair.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Legends never die',
            singer: 'Leagues of legend',
            path: './assets/music/legends_never_die.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Rise',
            singer: 'The Glitch Mob',
            path: './assets/music/rise.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Le Castle Vania',
            singer: 'John Wick Medley',
            path: './assets/music/le_castle_vania.mp3',
            image: './assets/img/song7.jpg'
        }

    ],
    // render UI elements 
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb"
                style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[ this.currentIndex ]
            }
        })
    },
    handleEvent: function () {
        const _this = this;

        // Handle Cd animation 
        const animationCD = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        animationCD.pause()

        // Hide CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Play and Pause Button
        playBtn.onclick = function () {
            if (_this.isPlaying)
            {
                audio.pause();
            } else
            {
                audio.play();
            }

        }
        // When play 
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            animationCD.play();
        }
        // When pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            animationCD.pause();

        }
        // Show progress bar 
        audio.ontimeupdate = function () {
            if (audio.duration)
            {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Handle speed up audio
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }
        // skip song 
        nextBtn.onclick = function () {
            if(_this.isShuffle) {
                _this.shuffleSong();
            }else {
                _this.nextSong();
            }
            audio.play();
        }
        // Previous song
        preBtn.onclick = function () {
            if(_this.isShuffle) {
                _this.shuffleSong();
            }else {
                _this.previousSong();
            }
            audio.play();
        }
        //Shuffle songs 
        shuffleBtn.onclick = function (e) {
            _this.isShuffle = !_this.isShuffle
            shuffleBtn.classList.toggle('active', _this.isShuffle);
        }
        // Auto next 
        audio.onended = function () {
            nextBtn.click();
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    // Next song 
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length)
        {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0)
        {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    shuffleSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex  )
        

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        this.defineProperties();

        this.handleEvent();

        this.loadCurrentSong();

        this.render();
    }
}

app.start();