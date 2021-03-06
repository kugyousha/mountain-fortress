import Config from "./config";
import {ctx} from "./canvas";
import {spritesheet} from "./sprites";
import {buildEntityMap} from "./entities";
import * as MapUtil from "./map-util";
import Model from "./model";
import Dispatcher from "./dispatcher";
import { messageLog } from './messageLog';

let currentCoords = null;
let translateOffset = {x: 0, y: 0};
let topOffest = 100;

let fadeOut = false;
let fadeIn = false;
let animationCounter = 0;

export const draw = (state) => {
  ctx.clearRect(0, 0, Config.canvasWidth, Config.canvasHeight);

  if(state.currentScene.name === "start") {
   drawCover("start");
   drawInstructions("startGame");
  }

  if(state.currentScene.name === "gameOver") {
   //drawCover("gaveOver");
   ctx.fillStyle = "#000";
   ctx.fillRect(0, 0, Config.canvasWidth, Config.canvasHeight);
   drawInstructions("endGame");
  }

  if(state.currentScene.currentLevel && state.currentScene.currentLevel.map) { //Temporary
    ctx.save();
    let currentCoords = MapUtil.indexToXY(Model.state.player.index);
    let sightPoints = MapUtil.getAllPoints(currentCoords, 4);
    let sightIndices = sightPoints.map((p) => {
      return MapUtil.xyToIndex(p);
    });
    sightIndices.push(Model.state.player.index);
    let viewport = MapUtil.getIndicesInViewport(1);
    //console.log(viewport.length);
    //console.log(translateOffset);
    //ctx.translate(translateOffset.x * -spritesheet.tileSize, translateOffset.y * -spritesheet.tileSize);
    ctx.translate(translateOffset.x, translateOffset.y + topOffest);
    drawMap(state.currentScene.currentLevel.map, viewport);
    drawEntities(state.currentScene.currentLevel, sightIndices, viewport);
    drawFog(state.currentScene.currentLevel.map, sightIndices, viewport);
    ctx.restore();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Config.canvasWidth, topOffest);
    ctx.fillRect(0, Config.canvasHeight - topOffest, Config.canvasWidth, Config.canvasHeight);

    if(fadeOut){
      drawFade();
    }
    drawStats(messageLog.currentStats);
    drawLog(messageLog.messages);
  }

}

const drawFade = () => {
  animationCounter++;
  let curAlpha;
  if (fadeIn){
    if (animationCounter <= 16) {
      curAlpha = animationCounter / 16;
    }
    if (animationCounter > 16) {
      let fadeIn = (16 - (animationCounter % 16)) / 16;
      curAlpha = Math.floor(animationCounter / 2) % 16;
    }
    if (animationCounter === 32) {
      curAlpha = 0;
    }
  } else {
    curAlpha = animationCounter / 32
  }
  ctx.fillStyle = `rgba(0,0,0,${curAlpha})`;
  ctx.fillRect(0, 0, Config.canvasWidth, Config.canvasHeight);
  if (animationCounter === 32) {
    animationCounter = 0;
    fadeIn = false;
    fadeOut = false;
  }
}

const drawInstructions = (scene) => {
  let messages = messageLog[scene].messages;
  ctx.fillStyle = "#fff";
  for(let i = 0; i < messages.length; i++){
    ctx.font = `${messages[i].size}px Orange Kid`;
    ctx.fillText(messages[i].text, messages[i].x, messages[i].y);
  }
}
const setCameraOffset = () => {
  //console.log("this got called");
  currentCoords = MapUtil.indexToXY(Model.state.player.index); //only get this on scene/level change
  translateOffset = MapUtil.getTranslation(currentCoords); // ''
  translateOffset.x *= -Config.tileSize;
  translateOffset.y *= -Config.tileSize;
  // I don't know if I really want to put this here but just for the sake of simplicity
  Config.translateOffset = translateOffset;
}

//TODO DRY up these two methods
const drawEntities = (level, sightIndices, viewport) => { //Temporary
  //buildEntityMap(level);
  //console.log("entitiesMap", level.entitiesMap);
  // drawMap(level.entitiesMap);
  // need to draw entities by X and Y values so that I can animate them,
  // probably also need to store the offset as X and Y so the screen shift will also be smooth
  for(let i = 0; i <  level.entities.length; i++){
    let entity = level.entities[i];
    //console.log(entity);
    if (viewport.indexOf(entity.index) !== -1 && (sightIndices.indexOf(entity.index) !== -1 || entity.type !== "monster")) {
    //console.log(entity.x, entity.y);
    // these properties can be stored on the entity itself rather than be calculated everytime
      let sx = (entity.key % spritesheet.sheetCols) * spritesheet.tileSize;
      let sy = Math.floor(entity.key / spritesheet.sheetCols) * spritesheet.tileSize;
      ctx.drawImage(spritesheet.sheet, sx, sy, spritesheet.tileSize, spritesheet.tileSize,
                                      entity.x, entity.y, Config.tileSize, Config.tileSize);
    }
  }
}

const drawMap = (map, viewport) => { //check viewport here and only draw what's in the viewport
  for(let i = 0, len = map.grid.length;  i < len; i++){
    let tile = map.grid[i];
    if(viewport.indexOf(i) !== -1 && (tile !== 0 || map.isBG)){
      let x = (i % map.mapCols) * Config.tileSize; // index / width of drawing area in tiles * tile size
      let y = Math.floor(i / map.mapCols) * Config.tileSize;
      let sx = (tile % spritesheet.sheetCols) * spritesheet.tileSize // tile value against width of tilesheet in tiles * tile size on sheet
      let sy = Math.floor(tile / spritesheet.sheetCols) * spritesheet.tileSize;
      ctx.drawImage(spritesheet.sheet, sx, sy, spritesheet.tileSize, spritesheet.tileSize,
                                      x, y, Config.tileSize + 1, Config.tileSize + 1);
    }
  }
};
const drawFog = (map, sightIndices, viewport) => {
  for(let i = 0, len = map.grid.length;  i < len; i++){
    if (viewport.indexOf(i) !== -1 && sightIndices.indexOf(i) === -1) {
      let x = (i % map.mapCols) * Config.tileSize; // index / width of drawing area in tiles * tile size
      let y = Math.floor(i / map.mapCols) * Config.tileSize;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(x, y, Config.tileSize, Config.tileSize);
    }
  }
}
const drawStats = (stats) => {
  ctx.fillStyle = "#fff";
  ctx.font = "25px Orange Kid";
  ctx.fillText(`HP: ${stats.hp} / ${stats.maxHp}`, 20, 25);
  ctx.fillText(`Weapon: ${stats.weapon.name}`, 20, 55);
  ctx.fillText(`Armor: ${stats.armor.name}`, 20, 85);
  ctx.fillText(`Player Level: ${stats.playerLevel}`, 420, 25);
  ctx.fillText(`XP: ${stats.xp} / ${stats.nextXp}`, 420, 55);
  ctx.fillText(`Dungeon Level: ${stats.dungeonLevel}`, 420, 85);
};

const drawLog = (log) => {
  let messages = log.slice(-3);
  for(let i = 0; i < messages.length; i++){
    ctx.fillStyle = "#fff";
    ctx.font = "20px Orange Kid";
    ctx.fillText(messages[i], 20, Config.canvasHeight - topOffest + (i * 30) + 25);
  }
};

const drawCover = (name) => {
  ctx.drawImage(spritesheet[name], 0, 0, Config.canvasWidth, Config.canvasHeight);
}

// Let's see where this goes...
const drawer = {
  redraw(){
    if(Model.state.currentScene.currentLevel){
      setCameraOffset();
    }

    draw(Model.state);
  },
  updateCamera(xA, yA){
    translateOffset.x += xA;
    translateOffset.y += yA;
    translateOffset = MapUtil.constrainCameraTranslation(Model.state.player);
    Config.translateOffset = translateOffset
  },
  setFadeout(shouldFadeIn){
    fadeOut = true;
    fadeIn = shouldFadeIn;
  }
};
Dispatcher.addListener(drawer);
Dispatcher.addAction(drawer, {name: "Change Scene", trigger: drawer.redraw});
Dispatcher.addAction(drawer, {name: "Update Camera", trigger: drawer.updateCamera});
Dispatcher.addAction(drawer, {name: "Fade-out-in", trigger: drawer.setFadeout});
