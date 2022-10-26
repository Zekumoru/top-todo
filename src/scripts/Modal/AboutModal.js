import loadTutorial from "../loadTutorial";
import Modal from "./Modal";

export default class extends Modal {
  #content;
  #showTutorialButton;

  constructor(element) {
    super(element);
    this.#content = element.querySelector('.modal-content');
  }

  show() {
    this.#content.innerHTML = `
      <p>Todo-list project "Keedo" made by <a href="https://github.com/zekumoru/top-todo" target="_blank" rel="noopener noreferrer">Zekumoru</a>.</p>
      <p><a class="show-tutorial">Show Keedo tutorial</a></p>
      <p>Hello there! I am happy to announce that I am finally done with this tedious project! It took me a damn lot of time but I learned a lot along the way.</p>
      <p>I started sketching the layout of this website around the half of September and started working on September 20 so it took me a month to finish! (It's October 26, 2022 at the time of writing)</p>
      <p>One of the biggest obstacle would have been the sorting mechanism of projects, I actually implemented one myself but to make it also work for mobile and when things are scrolling... Oh my, what a pain hence I found and used this wonderful external library called SortableJS and heck it helped me a ton!!</p>
      <p>Another biggest obstacle that took my sweet 10-20 hours is implementing the pop-ups like the quick priority change pop-up and the description pop-up. I literally thought it was going to be easy since <strong>you'd think</strong> you'll only need to set it with an absolute position and open it with JavaScript <strong>but!!</strong> Have fun figuring out how to close it when the user clicked outside and when the user clicked on its button (yes, especially this one, oh the excruciating pain!).</p>
      <p>And one last biggest obstacle would be the way how completed tasks go below all the uncompleted ones. It specially got tricky when you have priority to consider too but thankfully I thought of a clever solution: each priority has a 'weight' and a task being 'checked' is also another 'weight', add them together and viola! You got yourself a nice way to rank which ones should be on the top of the list.</p>
      <p>I was planning to be finished with this project last week Sunday hence the nasty just-make-it-work code. I used to always refactor things when it gets messy but doing so takes too much time.</p>
      <p>Also, you might have noticed but I did not bother doing any animations since it's still later on in the lessons. What I did bother myself though is making sure that the User Experience (UX) is designed properly. Though, sadly, I made a huge blunder with the User Interface (UI), it's too small! Sigh...</p>
      <p>There's much left to be desired... I had planned to implement sub-lists (checklist within a todo) and also notes but I don't want to waste any more time with this project. <strong>I. am. dying.</strong> to learn about Asynchronous JavaScript and React so hell with those features!</p>
      <p>This is the first biggest project I've ever done in The Odin Project and I gotta say, it was pretty fun though exhausting. I honestly often feel like "Why am I even doing this?" or "I am tired/I don't want to continue anymore!" but I am glad I finally did it!! FINALLY!!!</p>
      <p>Thank you and I hope you like my own version of the todo-list project! :D</p>
      <p><span style="font-weight: 600;">Fun fact:</span> I often use Google Keep for making my notes hence the look of this website is heavily influenced by it. In fact, Keedo derives from 'Kee' from 'Keep' and 'do' from 'to do'.</p>
      <p><span style="font-weight: 600;">Credits:</span> Keedo's logo is photoshopped by me using Google Keep's icon and images from Freepik. The hand icons used in the tutorial came from Freepik also.</p>
    `;
    this.#showTutorialButton = this.#content.querySelector('.show-tutorial');
    this.#showTutorialButton.addEventListener('click', this.#onShowTutorialButtonClick);
    this.element.appendChild(this.#content);
    super.show();
  }

  hide() {
    this.#content.innerHTML = '';
    this.#showTutorialButton.removeEventListener('click', this.#onShowTutorialButtonClick);
    this.#showTutorialButton = null;
    super.hide();
  }

  #onShowTutorialButtonClick() {
    loadTutorial();
  }
};