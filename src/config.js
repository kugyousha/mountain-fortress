import Dispatcher from "./dispatcher";

const config = {
  canvasHeight: 776,
  canvasWidth: 576,
  moveAniSpeed: 8,
  tileSize: 64,
  currentMap: null,
  mapCols: 0,
  mapRows: 0,
  rowsToShow: 4, //There should probably also be a colsToShow in cause I want to display a non-square play area
  maxOffsetX: 0,
  maxOffsetY: 0,
  minimumMonsters: 3,
  maximumMonsters: 12,
  generateMonsterTick: 20,
  setMaxOffsetX(){
    this.maxOffsetX = this.mapCols - 1 - this.rowsToShow;
  },
  setMaxOffsetY(){
    this.maxOffsetY = this.mapRows - 1 - this.rowsToShow;
  },
  changeMap(newMap){
    this.currentMap = newMap;
    this.mapCols = newMap.mapCols;
    this.setMaxOffsetX();
    this.mapRows = newMap.mapRows;
    this.setMaxOffsetY();
  }
};
export default config;

Dispatcher.addListener(config);
Dispatcher.addAction(config, {name: "Change Map", trigger: config.changeMap.bind(config)});
