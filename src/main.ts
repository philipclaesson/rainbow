import { AudioController } from "./audio";

const ac = new AudioController();
const nSquares = 16;
const nBalls = 4;
var isInitiated = false;
var fxEnable = false;
var progressBar: HTMLElement | null = null;
var windowSize = { width: 0, height: 0 };

function createUIElements() {
  // Create FX ui
  if (fxEnable) {
    const fxdiv = createElement("div", "fx", "fx", document.body);
    fxdiv.style.display = fxEnable ? "block" : "none";
    const fx1 = createElement("div", "fx1", "fx1", fxdiv);
    fx1.innerText = "🌊";
    const fxspacer = createElement("div", "fxspacer", "fxspacer", fxdiv);
    const fx2 = createElement("div", "fx2", "fx2", fxdiv);
    fx2.innerText = "🕥";
  }

  const matrix = createElement("div", "matrix", "matrix", document.body);
  for (let i = 0; i < nSquares; i++) {
    createElement("div", "square", `square-${i}`, matrix);
  }

  const ballHome = createElement("div", "ballhome", "ballhome", document.body);
  for (let i = 0; i < nBalls; i++) {
    const ball = createElement("div", "ball", `ball-${i}`, ballHome);
    ball.draggable = true;
    ball.innerText = `🌈`;
  }
}

function initUILogic() {
  const balls: NodeListOf<HTMLElement> = document.querySelectorAll(".ball");
  var mouseDown = false;
  // Drops a ball into a target element and mutes the track the ball came from
  const dropBall = (ball: HTMLElement, target: HTMLElement) => {
    console.log("Dropped:", ball.id, target.id);
    ac.enableTrack(getSquareId(target.id), true);
    target.appendChild(ball);
  };

  balls.forEach((ball) => {
    // Common function for starting the drag
    function startDrag(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      const originSquare = ball.parentElement as HTMLElement;
      ball.setAttribute("origin-square", originSquare.id);
      ball.setAttribute("clicked", "true");
      console.log(`[${e.type}] Lifted`, ball.id, "from", originSquare.id);
    }

    // Common function for dragging
    function doDrag(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      if (ball.getAttribute("clicked") !== "true") return;
      const position = getPositionFromEvent(e);
      ball.style.left = `${position.x - 50}px`;
      ball.style.top = `${position.y - 50}px`;
      // console.log(`[${e.type}] Moving/Dragging`, ball.id);
    }

    // Common function for ending the drag
    function endDrag(e: MouseEvent | TouchEvent) {
      if (ball.getAttribute("clicked") !== "true") return;
      const position = getPositionFromEvent(e);
      const originSquareId = ball.getAttribute("origin-square");
      ac.enableTrack(getSquareId(originSquareId), false);
      ball.setAttribute("clicked", "false");
      showBalls(false);
      const targetElement = document.elementFromPoint(
        position.x,
        position.y
      ) as HTMLElement;
      showBalls(true);
      dropBall(ball, targetElement);
      console.log(`[${e.type}] Dropped`, ball.id, "from", originSquareId);
    }

    // Add event listeners
    ball.addEventListener("mousedown", startDrag);
    ball.addEventListener("mousemove", doDrag);
    ball.addEventListener("mouseup", endDrag);
    ball.addEventListener("touchstart", startDrag);
    ball.addEventListener("touchmove", doDrag);
    ball.addEventListener("touchend", endDrag);
  });
  document.addEventListener("mouseup", (e) => {
    mouseDown = false;
  });
  document.addEventListener("mousedown", (e) => {
    mouseDown = true;
  });
  document.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;
    const position = getPositionFromEvent(e);
    var clickedBall: HTMLElement | null = balls[0];

    for (let i = 0; i < balls.length; i++) {
      if (balls[i].getAttribute("clicked") === "true"){
        clickedBall = balls[i];
      }
    }
    if (!clickedBall) return;
    if (distanceFromBall(clickedBall, e.clientX, e.clientY) == 0) return;
    clickedBall.style.left = `${position.x - 50}px`;
    clickedBall.style.top = `${position.y - 50}px`;
  });

  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;
  window.addEventListener("resize", () => {
    const oldHeight = windowSize.height;
    const oldWidth = windowSize.width;
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
    balls.forEach((ball) => {
      ball.style.left = `${(parseFloat(ball.style.left) / oldWidth) * windowSize.width}px`;
      ball.style.top = `${(parseFloat(ball.style.top) / oldHeight) * windowSize.height}px`;
    });
  });
}

function distanceFromBall(ball: HTMLElement, x: number, y: number) {
  const rect = ball.getBoundingClientRect();
  const ballX = rect.left + rect.width / 2;
  const ballY = rect.top + rect.height / 2;
  return Math.sqrt((ballX - x) ** 2 + (ballY - y) ** 2);
}

// Helper to extract position from event
function getPositionFromEvent(e: any) {
  if (
    typeof TouchEvent !== "undefined" &&
    e instanceof TouchEvent &&
    (e.touches || e.changedTouches)
  ) {
    const touches = e.touches.length > 0 ? e.touches : e.changedTouches;
    return { x: touches[0].clientX, y: touches[0].clientY };
  } else if (e instanceof MouseEvent) {
    return { x: e.clientX, y: e.clientY };
  } else {
    throw new Error("Unsupported event type");
  }
}

function initFXUI() {
  if (!fxEnable) {
    return;
  }
  const fx1 = document.getElementById("fx1");
  if (!fx1) {
    throw new Error("fx1 not found");
  }
  fx1.draggable = true;
  const fx2 = document.getElementById("fx2");
  fx1?.addEventListener("dragstart", (e: DragEvent) => {
    const { x, y } = normalizedXY(e.x, e.y);
    ac.fx1(x, y);
    console.log("dragstart");
  });
  fx1?.addEventListener("drag", (e: DragEvent) => {
    const { x, y } = normalizedXY(e.x, e.y);
    ac.fx1(x, y);
    console.log("dragmove");
  });
  fx1?.addEventListener("dragend", (e: DragEvent) => {
    ac.fx1(0, 0);
    console.log("dragend");
  });
  fx1?.addEventListener("touchstart", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    const touch = e.touches[0];
    const { x, y } = normalizedXY(touch.clientX, touch.clientY);
    ac.fx1(x, y);
    console.log("touchstart");
  });
  fx1?.addEventListener("touchmove", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    const touch = e.touches[0];
    const { x, y } = normalizedXY(touch.clientX, touch.clientY);
    ac.fx1(x, y);
    console.log("touchmove");
  });
  fx1?.addEventListener("touchend", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    ac.fx1(0, 0);
    console.log("touchend");
  });
}

function createElement(
  tag: string,
  cls: string,
  id: string,
  parent: HTMLElement
) {
  const element = document.createElement(tag);
  element.classList.add(cls);
  element.id = id;
  parent.appendChild(element);
  return element;
}

function showBalls(show: boolean) {
  const balls: NodeListOf<HTMLElement> = document.querySelectorAll(".ball");
  balls.forEach((ball) => {
    ball.style.display = show ? "block" : "none";
  });
}

function getSquareId(id: string | null): number {
  if (!id) {
    return -1;
  }
  const parts = id.split("square-");
  if (parts.length < 2) {
    return -1;
  }
  return parseInt(parts[1]);
}

function normalizedXY(x: number, y: number) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { x: x / width, y: y / height };
}

async function initAudio() {
  if (isInitiated) {
    return;
  }
  const pack1 = [
    "stems/pack1/4-on-floor.wav",
    "stems/pack1/dnb-124.wav",
    "stems/pack1/drums.wav",
    "stems/pack1/hats.wav",
    "stems/pack1/kick-hat.wav",
    "stems/pack1/toms.wav",
    "stems/pack1/smooth-chords.wav",
    "stems/pack1/bass.wav",
    "stems/pack1/bzzz.wav",
    "stems/pack1/guitar.wav",
    "stems/pack1/dnb-124.wav",
    "stems/pack1/drums.wav",
    "stems/pack1/hats.wav",
    "stems/pack1/keep-on.wav",
    "stems/pack1/what-u-doin-to-me.wav",
    "stems/pack1/extacy.wav",
  ];

  const pack2 = [
    "stems/pack2/4-floor-badam.wav",
    // "stems/pack2/4-floor-more.wav",
    "stems/pack2/groovy-drums.wav",
    // "stems/pack2/drum-thing.wav",
    "stems/pack2/drums-pstju.wav",
    "stems/pack2/drums-tikitiki.wav",
    "stems/pack2/drums-with-laser.wav",
    // "stems/pack2/snare-hat-blipp.wav",
    "stems/pack2/fat-bass.wav",
    "stems/pack2/bass.wav",
    "stems/pack2/house-bass.wav",
    "stems/pack2/groovy-synth.wav",
    "stems/pack2/pluck-synth.wav",
    "stems/pack2/house-chords.wav",
    "stems/pack2/spacy-chords.wav",
    "stems/pack2/surr.wav",
    "stems/pack2/hehehe.wav",
    "stems/pack2/thats-all.wav",
    "stems/pack2/all-that-i-can-do.wav",
  ];
  await ac.initAudio(pack1);
  isInitiated = true;
}

function spinner(show: boolean) {
  if (show) {
    createElement("div", "spinner", "spinner", document.body);
    progressBar = createElement(
      "progress",
      "progress",
      "progress",
      document.body
    );
    setTimeout(setProgress, 100);
  } else {
    const spinner = document.getElementById("spinner");
    spinner?.remove();
    progressBar?.remove();
  }
}

function setProgress() {
  if (!progressBar) {
    return;
  }
  const p = ac.loadedFiles / 16;
  console.log("Progress:", p);
  progressBar.setAttribute("value", p.toString());
  if (p != 1) {
    setTimeout(setProgress, 100);
  }
}

function createStartButton() {
  const startButton = document.getElementById("start-button");
  const info1 = document.getElementById("info-1");
  const info2 = document.getElementById("info-2");
  startButton?.addEventListener("click", async () => {
    startButton.remove();
    info1?.remove();
    info2?.remove();
    spinner(true);
    await initAudio();
    spinner(false);
    createUIElements();
    initUILogic();
    initFXUI();
    draw();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createStartButton();
});

function draw() {
  requestAnimationFrame(draw);
  if (!isInitiated) {
    return;
  }
  for (let i = 0; i < nSquares; i++) {
    const square = document.getElementById(`square-${i}`) as HTMLElement;
    if (square) {
      square.style.backgroundColor = ac.getFrequencyColor(i);
    }
  }
}
