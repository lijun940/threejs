<script setup>
// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入draco解码器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Duck from "./assets/model/Duck.glb";
import hdr from "./assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr";
import matcapsJpg from "./assets/texture/matcaps/50332C_D98D79_955F52_AA7C6C-512px.png";
import png1 from "./assets/texture/watercover/CityNewYork002_COL_VAR1_1K.png";
import png2 from "./assets/texture/watercover/CityNewYork002_REFL_1K.jpg";
import png3 from "./assets/texture/watercover/CityNewYork002_NRM_1K.jpg";
import png4 from "./assets/texture/watercover/CityNewYork002_DISP_1K.jpg";
import png5 from "./assets/texture/watercover/CityNewYork002_AO_1K.jpg";
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 开启抗锯齿
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = true;

// 渲染函数
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // 渲染
  renderer.render(scene, camera);
}
animate();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});

let eventObj = {
  Fullscreen: function () {
    // 全屏
    document.body.requestFullscreen();
    console.log("全屏");
  },
  ExitFullscreen: function () {
    document.exitFullscreen();
    console.log("退出全屏");
  },
};

// 创建GUI
const gui = new GUI();
// 添加按钮
gui.add(eventObj, "Fullscreen").name("全屏");
gui.add(eventObj, "ExitFullscreen").name("退出全屏");
// 控制立方体的位置
// gui.add(cube.position, "x", -5, 5).name("立方体x轴位置");

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load(hdr, (envMap) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 设置环境贴图
  scene.environment = envMap;
  planeMaterial.envMap = envMap;
});
// 环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
// 点光源
let pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// 添加纹理
let textureLoader = new THREE.TextureLoader();
let colorTexture = textureLoader.load(png1);
colorTexture.colorSpace = THREE.SRGBColorSpace;
// 高光贴图
let specularTexture = textureLoader.load(png2);
// 法线贴图 反射效果
let normalTexture = textureLoader.load(png3);
// 凹凸贴图 凹凸效果
let bumpTexture = textureLoader.load(png4);
// 环境光遮蔽贴图
let aoTexture = textureLoader.load(png5);
// 创建平面
let planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
let planeMaterial = new THREE.MeshLambertMaterial({
  map: colorTexture,
  transparent: true,
  specularMap: specularTexture,
  normalMap: normalTexture,
  bumpMap: bumpTexture,
  // 置换贴图性能要求很高，能不用就不用 使用凹凸贴图即可
  displacementMap: bumpTexture,
  // 置换的程度
  displacementScale: 0.1,
  aoMap: aoTexture,
});
// let planeMaterial = new THREE.MeshPhongMaterial({
//   map: colorTexture,
//   transparent: true,
//   specularMap: specularTexture,
//   // normalMap: normalTexture,
//   bumpMap: bumpTexture,
//   displacementMap: bumpTexture,
//   // 置换的程度
//   displacementScale: 0.1,
//   aoMap: aoTexture,
// });

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
</script>

<template></template>

<style scoped>
.btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  &.exit {
    left: 100px;
  }
}
</style>
