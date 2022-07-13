import ReloadPrompt from "@components/reload";
import DarkLightMode from "../../components/shared/DarkLightMode";
import { createSignal, createEffect } from "solid-js";

import { ChiptuneJsConfig, ChiptuneJsPlayer } from "../../libs/chiptune2.mjs";
let groups = await fetch(
  "https://bitti-modplayer.mybitti.workers.dev/index.txt"
).then((r) => r.text());

var g = groups.split(/\r?\n/);
console.log(g);

const [started, setStarted] = createSignal(false);
let c;
let buffer;
 let [index, setIndex] = createSignal(0);
let [gindex, setIndexg] = createSignal("SnD/");
let [files, setfiles] = createSignal();

let [msg, setMsg] = createSignal("");
let [duration, setDuration] = createSignal(0);
let [position, setPosition] = createSignal(0);
let [loop, setLoops] = createSignal(0);

let [title, setTitle] = createSignal("");
let t  = await fetch(
  "https://bitti-modplayer.mybitti.workers.dev/" + gindex() + "/index.txt"
).then((r) => r.text());
let tracks = t.split(/\r?\n/);
tracks.pop(2);
tracks.pop();
setfiles(tracks)
console.log(tracks.length);
async function test() {
  if (c == undefined && !started()) {
    var xx =
      "https://bitti-modplayer.mybitti.workers.dev/" +
      gindex() +
      escape(files()[index()]);
    console.log(xx);
    buffer = await fetch(xx).then((r) => r.arrayBuffer());
    c = new ChiptuneJsPlayer(new ChiptuneJsConfig({ repeatCount: 0 }));
    console.log(c);
    c.play(buffer);
    createEffect(() => {
      console.log("The index is now", c.getLoop());
    });
    setInterval(() => {
      setPosition(c.getPosition().toFixed(2));
    }, 100);
    let { title, message } = c.metadata();
    if (message == undefined) {
      setMsg("no message");
    } else {
      setMsg(message.replace(/(?:\r\n|\r|\n)/g, "<br>"));
    }
    if (title == undefined) {
      setTitle("no title");
    } else {
      setTitle(title);
    }
    if (c.duration() == undefined) {
      setDuration(0);
    } else {
      setDuration(c.duration());
    }
    setStarted(true);
  } else if (c !== undefined && started()) {
    c.stop();
    setStarted(false);
    clearInterval();
    console.log("stopped 1");
  } else if (c !== undefined && !started()) {
    c.play(buffer);
    setInterval(() => {
      setPosition(c.getPosition().toFixed(2));
    }, 100);
    setStarted(true);
    console.log("started 2");
  } else {
    c.stop();
    c = undefined;
    clearInterval();
    console.log("stopped 2");
  }
}
async function next() {
  if (index() + 1 !== tracks.length) {
    c.stop();
    setStarted(false);
    clearInterval();
    setIndex(index() + 1);
    var xx =
      "https://bitti-modplayer.mybitti.workers.dev/" +
      gindex() +
      escape(files()[index()]);
    buffer = await fetch(xx).then((r) => r.arrayBuffer());
    c.play(buffer);
    setInterval(() => {
      setPosition(c.getPosition().toFixed(2));
    }, 100);
    let { title, message } = c.metadata();
    if (message == undefined) {
      setMsg("no message");
    } else {
      setMsg(message.replace(/(?:\r\n|\r|\n)/g, "<br>"));
    }
    if (title == undefined) {
      setTitle("no title");
    } else {
      setTitle(title);
    }
    if (c.duration() == undefined) {
      setDuration(0);
    } else {
      setDuration(c.duration());
    }
    setStarted(true);
  }
}
async function prev() {
  if (index() - 1 >= 0) {
    c.stop();
    setStarted(false);
    clearInterval();

    setIndex(index() - 1);
    var xx =
      "https://bitti-modplayer.mybitti.workers.dev/" +
      gindex() +
      escape(files()[index()]);
    console.log(xx);
    buffer = await fetch(xx).then((r) => r.arrayBuffer());
    c.play(buffer);
    setInterval(() => {
      setPosition(c.getPosition().toFixed(2));
    }, 100);
    let { title, message } = c.metadata();
    if (message == undefined) {
      setMsg("no message");
    } else {
      setMsg(message.replace(/(?:\r\n|\r|\n)/g, "<br>"));
    }
    if (title == undefined) {
      setTitle("no title");
    } else {
      setTitle(title);
    }
    if (c.duration() == undefined) {
      setDuration(0);
    } else {
      setDuration(c.duration());
    }
    setStarted(true);
  }
}
async function switchtrack(id) {
  console.log(JSON.stringify(id));
  console.log(id);

  setStarted(false);
  clearInterval();

  c.stop();
  setIndex(id);
  var xx =
    "https://bitti-modplayer.mybitti.workers.dev/" +
    gindex() +
    escape(files()[index()]);
  console.log(tracks[index()]);
  console.log(index());
  buffer = await fetch(xx).then((r) => r.arrayBuffer());
  c.play(buffer);

  let { title, message } = c.metadata();
  setInterval(() => {
    setPosition(c.getPosition().toFixed(2));
  }, 100);
  if (message == undefined) {
    setMsg("no message");
  } else {
    setMsg(message.replace(/(?:\r\n|\r|\n)/g, "<br>"));
  }
  if (title == undefined) {
    setTitle("no title");
  } else {
    setTitle(title);
  }
  if (c.duration() == undefined) {
    setDuration(0);
  } else {
    setDuration(c.duration());
  }
  setStarted(true); /**/
}
function sLoop() {
  var x = loop() == 1 ? 0 : 1;
  console.log(x);
  console.log("old" + c.getLoop());

  c.setLoop(x);
  setLoops(x);
  console.log(loop());
  console.log("news" + c.getLoop());
}
async function checkclick(id) {
  console.log(id);
  setIndexg(id);
  let t  = await fetch(
    "https://bitti-modplayer.mybitti.workers.dev/" + gindex() + "/index.txt"
  ).then((r) => r.text());
  let tracks = t.split(/\r?\n/);
  tracks.pop();
  tracks.pop();
  setfiles(tracks)
}
const ReloadPromptCheck =
  typeof window !== "undefined" ? () => <ReloadPrompt /> : () => null;

export default function () {
  return (
    <div class="h-screen flex-col bg-white dark:bg-gray-500 pl-5">
      <ReloadPromptCheck />
      <div class="flex items-end space-x-6">
        <DarkLightMode />
      </div>
      <div class="grid grid-cols-2">
        <div>
          <button onClick={test} class="btn">
            {" "}
            test{" "}
          </button>
          <button onClick={next} class="btn">
            {" "}
            next{" "}
          </button>
          <button onClick={prev} class="btn">
            {" "}
            prev{" "}
          </button>
          <br></br>
          <div>title: {title()}</div>
          <br></br>
          <div>Duration: {duration().toFixed(2)} seconds</div>
          <br></br>
          <div>Position: {position()} seconds</div>
          <br></br>
          <button onClick={sLoop} class="btn btn-primary">
            {" "}
            {loop()}
          </button>
        </div>
        <div class="overflow-y-auto h-200">
          <div class="max-h-96">
            <For each={files()}>
              {(cat, i) => (
                <li onclick={(e) => switchtrack(i())}>
                  {i}: {cat}
                </li>
              )}
            </For>
          </div>
        </div>

        <div innerHTML={msg()} />
        <div class="overflow-y-auto h-200">
          <div class="max-h-96">
            <For each={g}>
              {(cat, i) => (
                <li onclick={(e) => checkclick(cat)}>
                  {i}: {cat}
                </li>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
