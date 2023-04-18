import { data } from "./data.js";
import { shuffle, toMinAndSec } from "./utils.js";

const AudioController = {
  state: {
    audios: [],
    current: {},
    repeating: false,
    playing: false,
    volume: 0.5,
  },

  init() {
    this.initVariables();
    this.initEvents();
    this.renderAudios();
  },

  initVariables() {
    this.playButton = null;
    this.audioList = document.querySelector(".items");
    this.currentItem = document.querySelector(".current");
    this.repeatButton = document.querySelector(".handling-repeat");
    this.volumeButton = document.querySelector(".controls-volume");
    this.shuffleButton = document.querySelector(".handling-shuffle");
  },

  initEvents() {
    this.audioList.addEventListener("click", this.handleItem.bind(this));
    this.repeatButton.addEventListener("click", this.handleRepeat.bind(this));
    this.volumeButton.addEventListener("change", this.handleVolume.bind(this));
    this.shuffleButton.addEventListener("click", this.handleShuffle.bind(this));
  },

  handleShuffle() {
    const { children } = this.audioList;
    const shuffled = shuffle([...children]);

    this.audioList.innerHTML = "";
    shuffled.forEach((item) => this.audioList.appendChild(item));
  },

  handleVolume({ target: { value } }) {
    const { current } = this.state;

    this.state.volume = value;

    if (!current?.audio) return;

    current.audio.volume = value;
  },

  handleRepeat({ currentTarget }) {
    const { repeating } = this.state;

    currentTarget.classList.toggle("active", !repeating);
    this.state.repeating = !repeating;
  },

  handleAudioPlay() {
    const { playing, current } = this.state;
    const { audio } = current;

    !playing ? audio.play() : audio.pause();

    this.state.playing = !playing;

    this.playButton.classList.toggle("playing", !playing);
  },

  handleNext() {
    const { current } = this.state;

    const currentItem = document.querySelector(`[data-id="${current.id}"]`);
    const next = currentItem.nextSibling?.dataset;
    const first = this.audioList.firstChild?.dataset;

    const itemId = next?.id || first?.id;

    if (!itemId) return;

    this.setCurrentItem(itemId);
  },

  handlePrev() {
    const { current } = this.state;

    const currentItem = document.querySelector(`[data-id="${current.id}"]`);
    const prev = currentItem.previousSibling?.dataset;
    const last = this.audioList.lastChild?.dataset;

    const itemId = prev?.id || last?.id;

    if (!itemId) return;

    this.setCurrentItem(itemId);
  },

  handlePlayer() {
    const play = document.querySelector(".controls-play");
    const next = document.querySelector(".controls-next");
    const prev = document.querySelector(".controls-prev");

    this.playButton = play;

    play.addEventListener("click", this.handleAudioPlay.bind(this));
    next.addEventListener("click", this.handleNext.bind(this));
    prev.addEventListener("click", this.handlePrev.bind(this));
  },

  audioUpdateHandler({ audio, duration }) {
    const progress = document.querySelector(".progress-current");
    const timeline = document.querySelector(".timeline-start");

    audio.addEventListener("timeupdate", ({ target }) => {
      const { currentTime } = target;
      const width = (currentTime * 100) / duration;

      timeline.innerHTML = toMinAndSec(currentTime);
      progress.style.width = `${width}%`;
    });

    audio.addEventListener("ended", ({ target }) => {
      target.currentTime = 0;
      progress.style.width = `0%`;

      this.state.repeating ? target.play() : this.handleNext();
    });
  },

  renderCurrentItem({ link, track, year, group, duration }) {
    const [image] = link.split(".");

    return `<div
            class="current-image"
            style="background-image: url(./assets/images/${image}.jpg)"
          ></div>

          <div class="current-info">
            <div class="current-info__top">
              <div class="current-info__titles">
                <h2 class="current-info__group">${group}</h2>
                <h3 class="current-info__track">${track}</h3>
              </div>

              <div class="current-info__year">${year}</div>
            </div>

            <div class="controls">
              <div class="controls-buttons">
                <button class="controls-button controls-prev">
                  <svg class="icon-arrow">
                    <use xlink:href="./assets/images/sprite.svg#arrow"></use>
                  </svg>
                </button>

                <button class="controls-button controls-play">
                  <svg class="icon-pause">
                    <use xlink:href="./assets/images/sprite.svg#pause"></use>
                  </svg>
                  <svg class="icon-play">
                    <use xlink:href="./assets/images/sprite.svg#play"></use>
                  </svg>
                </button>

                <button class="controls-button controls-next">
                  <svg class="icon-arrow">
                    <use xlink:href="./assets/images/sprite.svg#arrow"></use>
                  </svg>
                </button>
              </div>

              <div class="controls-progress">
                <div class="progress">
                  <div class="progress-current"></div>
                </div>

                <div class="timeline">
                  <span class="timeline-start">00:00</span>
                  <span class="timeline-end">${toMinAndSec(duration)}</span>
                </div>
              </div>
            </div>
          </div>`;
  },

  pauseCurrentAudio() {
    const {
      current: { audio },
    } = this.state;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  },

  togglePlaying() {
    const { playing, current } = this.state;
    const { audio } = current;

    playing ? audio.play() : audio.pause();

    this.playButton.classList.toggle("playing", playing);
  },

  setCurrentItem(itemId) {
    const current = this.state.audios.find(({ id }) => +id === +itemId);

    if (!current) return;

    this.pauseCurrentAudio();

    this.state.current = current;
    this.currentItem.innerHTML = this.renderCurrentItem(current);

    current.audio.volume = this.state.volume;

    this.handlePlayer();
    this.audioUpdateHandler(current);

    setTimeout(() => {
      this.togglePlaying();
    }, 5);
  },

  handleItem({ target }) {
    const { id } = target.dataset;

    if (!id) return;

    this.setCurrentItem(id);
  },

  renderItem({ id, link, track, genre, group, duration }) {
    const [image] = link.split(".");

    return `<div class="item" data-id="${id}">
            <div
              class="item-image"
              style="background-image: url(./assets/images/${image}.jpg)"
            ></div>

            <div class="item-titles">
              <h2 class="item-group">${group}</h2>
              <h3 class="item-track">${track}</h3>
            </div>

            <p class="item-duration">${toMinAndSec(duration)}</p>
            <p class="item-genre">${genre}</p>

            <button class="item-play">
              <svg class="icon-play">
                <use xlink:href="./assets/images/sprite.svg#play"></use>
              </svg>
            </button>
          </div>`;
  },

  loadAudioData(audio) {
    this.audioList.innerHTML += this.renderItem(audio);
  },

  renderAudios() {
    data.forEach((item) => {
      const audio = new Audio(`./assets/audio/${item.link}`);

      audio.addEventListener("loadeddata", () => {
        const newItem = { ...item, duration: audio.duration, audio };

        this.state.audios.push(newItem);
        this.loadAudioData(newItem);
      });
    });
  },
};

AudioController.init();
