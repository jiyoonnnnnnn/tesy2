(function () {
  'use strict';

  /**
   * 히어로 카드 스택 롤링 (3장 순환).
   *
   * 카드는 사라지지 않고 3개 위치(slot 0=앞, 1=중간, 2=뒤)를 서로 자리바꿈한다.
   * 매 틱마다 1->0, 2->1 로 전진하고, 맨 앞(0) 카드는 살짝 아래로 내려가
   * 작아지며 맨 뒤(2)로 미끄러져 들어간다(is-going-back). 항상 3장이 모두
   * 화면에 있으므로 빈 구간 없이 두/세 번째 카드가 자연스럽게 올라온다.
   */
  function initCardStack() {
    const stack = document.querySelector('[data-card-stack]');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('[data-card]'));
    if (cards.length < 2) return;

    const N = cards.length; // 3
    const ROLL_INTERVAL = 2200; // 카드가 넘어가는 주기(ms)
    const BACK_DELAY = 80; // is-going-back -> 맨 뒤 슬롯 전환까지의 짧은 지연

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const slotOf = new Map();

    function applySlot(card, slot) {
      for (let i = 0; i < N; i++) card.classList.remove('is-slot-' + i);
      card.classList.remove('is-going-back');
      card.classList.add('is-slot-' + slot);
      slotOf.set(card, slot);
    }

    function init() {
      cards.forEach((card, i) => applySlot(card, i));
    }

    let timer = null;
    let rolling = false;

    function rollOnce() {
      if (rolling) return;
      rolling = true;

      let goingBack = null;

      cards.forEach((card) => {
        const cur = slotOf.get(card);
        if (cur === 0) {
          // 앞 카드: 다른 카드 뒤로(z-index 0) 살짝 내려가는 중간 상태
          goingBack = card;
          card.classList.remove('is-slot-0');
          card.classList.add('is-going-back');
        } else {
          applySlot(card, cur - 1);
        }
      });

      // 짧은 지연 뒤, 내려간 카드를 맨 뒤 슬롯으로 부드럽게 수렴시킨다.
      window.setTimeout(function () {
        if (goingBack) {
          applySlot(goingBack, N - 1);
          stack.appendChild(goingBack);
        }
        rolling = false;
      }, BACK_DELAY);
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(rollOnce, ROLL_INTERVAL);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    init();
    start();

    // 탭이 보이지 않으면 멈추고, 돌아오면 재개 (불필요한 연산 방지)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 햄버거 메뉴 토글 (placeholder)
    const menuButton = document.querySelector('[data-menu-toggle]');
    if (menuButton) {
      menuButton.addEventListener('click', function () {
        console.log('menu toggle');
      });
    }

    initCardStack();

    console.log('주식투자노트 page initialized.');
  });
})();
